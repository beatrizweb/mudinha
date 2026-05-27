// ════════════════════════════════════════════════════════
// Cron de lembretes — roda a cada 15min via Vercel Cron
// ════════════════════════════════════════════════════════
// Pega hábitos ativos cujo reminder_time bate com "agora"
// em horário de Brasília (UTC-3), filtra os que ainda não
// foram regados hoje, e dispara push pra cada subscription
// do dono do hábito.
// ════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

type HabitRow = {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  reminder_time: string | null;
  paused: boolean;
  archived: boolean;
  frequency: string;
  days_of_week: number[];
};

type SubscriptionRow = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

const FRASES = [
  "tá com sede 🌱",
  "tá te chamando",
  "pede uma aguinha",
  "tá no aguardo",
  "vai murchar se você esquecer",
  "tá pronta pra crescer hoje",
];

function fraseAleatoria() {
  return FRASES[Math.floor(Math.random() * FRASES.length)];
}

// Hora atual em São Paulo (UTC-3, sem horário de verão)
function agoraEmSaoPaulo() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60_000;
  const sp = new Date(utc + -3 * 3_600_000);
  return sp;
}

export async function GET(req: Request) {
  // Proteção: só Vercel Cron (Bearer) ou request com ?secret=...
  const authHeader = req.headers.get("authorization");
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const expected = process.env.CRON_SECRET;

  const okAuth = authHeader === `Bearer ${expected}` || secret === expected;
  if (!okAuth) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const agora = agoraEmSaoPaulo();
  const hojeISO = agora.toISOString().slice(0, 10);
  const horaAgora = agora.getHours();
  const minutoAgora = agora.getMinutes();
  const minutosAgora = horaAgora * 60 + minutoAgora;
  const diaSemana = agora.getDay();

  // Busca hábitos com reminder_time
  const { data: habits, error: habitsErr } = await supabase
    .from("habits")
    .select("id, user_id, name, icon, reminder_time, paused, archived, frequency, days_of_week")
    .eq("archived", false)
    .eq("paused", false)
    .not("reminder_time", "is", null);

  if (habitsErr) {
    return NextResponse.json({ error: habitsErr.message }, { status: 500 });
  }

  // Janela de ±15min em torno do reminder_time
  const aDisparar: HabitRow[] = [];
  for (const h of (habits as HabitRow[]) ?? []) {
    if (!h.reminder_time) continue;
    if (h.frequency === "custom" && !h.days_of_week.includes(diaSemana)) continue;

    const [hStr, mStr] = h.reminder_time.split(":");
    const minutosLembrete = parseInt(hStr) * 60 + parseInt(mStr);
    const diff = Math.abs(minutosAgora - minutosLembrete);
    if (diff <= 15) aDisparar.push(h);
  }

  if (aDisparar.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, message: "nenhum lembrete nessa janela" });
  }

  // Filtra os que já foram regados hoje
  const ids = aDisparar.map((h) => h.id);
  const { data: checkinsHoje } = await supabase
    .from("checkins")
    .select("habit_id")
    .in("habit_id", ids)
    .eq("date", hojeISO);

  const regados = new Set((checkinsHoje ?? []).map((c) => c.habit_id));
  const pendentes = aDisparar.filter((h) => !regados.has(h.id));

  if (pendentes.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, message: "todos os hábitos da janela já foram regados" });
  }

  // Busca subscriptions de cada user único
  const userIds = Array.from(new Set(pendentes.map((h) => h.user_id)));
  const { data: subs } = await supabase
    .from("push_subscriptions")
    .select("user_id, endpoint, p256dh, auth")
    .in("user_id", userIds);

  const subsPorUser = new Map<string, SubscriptionRow[]>();
  for (const s of (subs as Array<SubscriptionRow & { user_id: string }>) ?? []) {
    const arr = subsPorUser.get(s.user_id) ?? [];
    arr.push({ endpoint: s.endpoint, p256dh: s.p256dh, auth: s.auth });
    subsPorUser.set(s.user_id, arr);
  }

  let enviados = 0;
  const expirados: string[] = [];

  for (const h of pendentes) {
    const userSubs = subsPorUser.get(h.user_id) ?? [];
    const payload = JSON.stringify({
      title: `${h.icon} ${h.name}`,
      body: `sua ${h.name.toLowerCase()} ${fraseAleatoria()}`,
      tag: `habito-${h.id}`,
      url: `/habito/${h.id}`,
    });

    for (const s of userSubs) {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload
        );
        enviados++;
      } catch (err: unknown) {
        const e = err as { statusCode?: number };
        if (e.statusCode === 404 || e.statusCode === 410) {
          expirados.push(s.endpoint);
        }
      }
    }
  }

  if (expirados.length > 0) {
    await supabase.from("push_subscriptions").delete().in("endpoint", expirados);
  }

  return NextResponse.json({
    ok: true,
    sent: enviados,
    habitsConsidered: pendentes.length,
    expiredRemoved: expirados.length,
  });
}
