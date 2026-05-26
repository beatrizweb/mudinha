import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { calcularStreakAtual, regouHoje } from "@/lib/streak";
import { estagioPorStreak, progressoNoEstagio } from "@/lib/plantas";
import { CardHabito } from "@/components/card-habito";
import { NavInferior } from "@/components/nav-inferior";
import { MascoteFolha } from "@/components/mascote-folha";
import type { Habito, Checkin } from "@/lib/types";

export default async function JardimPage() {
  const supabase = await createClient();

  // Busca hábitos do usuário (não arquivados)
  const { data: habitos } = await supabase
    .from("habits")
    .select("*")
    .eq("archived", false)
    .order("created_at", { ascending: true });

  // Busca checkins de TODOS os hábitos do usuário
  const { data: checkins } = await supabase
    .from("checkins")
    .select("*")
    .order("date", { ascending: false });

  const habitosArr = (habitos ?? []) as Habito[];
  const checkinsArr = (checkins ?? []) as Checkin[];

  // Calcula info por hábito
  const habitosComStats = habitosArr.map((h) => {
    const datas = checkinsArr
      .filter((c) => c.habit_id === h.id)
      .map((c) => c.date);
    const streak = calcularStreakAtual(datas);
    const ehoje = regouHoje(datas);
    const estagio = estagioPorStreak(streak);
    const progresso = progressoNoEstagio(streak);
    return { habito: h, streak, regouHoje: ehoje, estagio, progresso };
  });

  // Maior streak geral
  const maiorStreak = habitosComStats.reduce(
    (max, h) => Math.max(max, h.streak),
    0
  );

  const saudacao = obterSaudacao();
  const diaDaSemana = obterDiaDaSemana();

  return (
    <main className="flex flex-col flex-1 bg-areia px-6 py-8 max-w-md mx-auto w-full">
      <header className="mb-6">
        <h1 className="font-serif text-3xl text-costela">
          {saudacao} 🌿
        </h1>
        <p className="text-sm text-stone-600">{diaDaSemana}</p>
      </header>

      {/* Stats hero */}
      <div className="bg-costela rounded-2xl p-5 text-white mb-6">
        <div className="flex gap-8">
          <div>
            <div className="font-serif text-2xl">🔥 {maiorStreak} {maiorStreak === 1 ? "dia" : "dias"}</div>
            <div className="text-xs opacity-80">maior streak</div>
          </div>
          <div>
            <div className="font-serif text-2xl">🌿 {habitosArr.length}</div>
            <div className="text-xs opacity-80">{habitosArr.length === 1 ? "hábito" : "hábitos"}</div>
          </div>
        </div>
      </div>

      {habitosArr.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <p className="text-xs text-stone-500 mb-3 uppercase tracking-wider">
            pra hoje ({habitosArr.length})
          </p>
          <div className="space-y-3 mb-6">
            {habitosComStats.map(({ habito, streak, regouHoje, estagio, progresso }, index) => (
              <CardHabito
                key={habito.id}
                habito={habito}
                streak={streak}
                regouHoje={regouHoje}
                estagio={estagio}
                progresso={progresso}
                index={index}
              />
            ))}
          </div>

          <Link
            href="/habito/novo"
            className="block w-full border-2 border-costela text-costela rounded-full py-3 text-sm font-medium text-center hover:bg-costela/5 transition-colors"
          >
            + plantar hábito
          </Link>
        </>
      )}

      <div className="mt-auto" />
      <NavInferior ativa="jardim" />
    </main>
  );
}

function EmptyState() {
  return (
    <div className="bg-offwhite rounded-2xl p-8 border border-stone-200 text-center">
      <div className="flex justify-center mb-4">
        <MascoteFolha tamanho={120} expressao="atenta" />
      </div>
      <h2 className="font-serif text-xl text-costela mb-2">
        seu jardim tá vazio
      </h2>
      <p className="text-sm text-stone-600 mb-6">
        plante sua primeira mudinha pra começar.
      </p>
      <Link
        href="/habito/novo"
        className="inline-block bg-costela text-white rounded-full px-8 py-3 font-medium hover:bg-costela/90 transition-colors"
      >
        plantar primeira mudinha 🌱
      </Link>
    </div>
  );
}

function obterSaudacao() {
  const h = new Date().getHours();
  if (h < 5)  return "boa madrugada";
  if (h < 12) return "bom dia";
  if (h < 18) return "boa tarde";
  return "boa noite";
}

function obterDiaDaSemana() {
  const dias = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  return `hoje é ${dias[new Date().getDay()]}`;
}
