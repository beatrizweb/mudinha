import { createClient } from "@/lib/supabase/server";
import { sair } from "../login/actions";
import { Button } from "@/components/ui/button";
import { NavInferior } from "@/components/nav-inferior";
import { MascoteFolha } from "@/components/mascote-folha";
import { calcularMaiorStreak } from "@/lib/streak";
import {
  verificarConquistas,
  verificarEspecies,
} from "@/lib/conquistas";
import type { Habito, Checkin } from "@/lib/types";
import { ToggleNotificacoes } from "@/components/toggle-notificacoes";

export default async function PerfilPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Busca dados pra montar estatísticas
  const { data: todosHabitos } = await supabase.from("habits").select("*");
  const { data: checkins } = await supabase.from("checkins").select("*");

  const habitosArr = (todosHabitos ?? []) as Habito[];
  const checkinsArr = (checkins ?? []) as Checkin[];
  const ativos = habitosArr.filter((h) => !h.archived);

  // Maior streak global
  let maiorStreakGlobal = 0;
  for (const h of habitosArr) {
    const datas = checkinsArr
      .filter((c) => c.habit_id === h.id)
      .map((c) => c.date);
    const s = calcularMaiorStreak(datas);
    if (s > maiorStreakGlobal) maiorStreakGlobal = s;
  }

  const ctx = {
    maiorStreak: maiorStreakGlobal,
    numHabitosAtivos: ativos.length,
    totalCheckins: checkinsArr.length,
    totalHabitosJaCriados: habitosArr.length,
  };

  const numConquistas = verificarConquistas(ctx).filter((c) => c.desbloqueada).length;
  const numEspecies = verificarEspecies(ctx).filter((e) => e.desbloqueada).length;

  const diasRegando = user?.created_at
    ? Math.max(
        1,
        Math.floor(
          (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  return (
    <main className="flex flex-col flex-1 bg-areia px-6 py-8 max-w-md mx-auto w-full">
      <h1 className="font-serif text-3xl text-costela mb-6">perfil</h1>

      {/* Avatar + info */}
      <div className="text-center mb-8">
        <div className="bg-brote/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden">
          <MascoteFolha tamanho={80} expressao="feliz" />
        </div>
        <h2 className="font-serif text-2xl text-costela">{user?.email?.split("@")[0]}</h2>
        <p className="text-sm text-stone-600 mb-1">{user?.email}</p>
        <p className="text-xs text-stone-500 italic">
          regando há {diasRegando} {diasRegando === 1 ? "dia" : "dias"}
        </p>
      </div>

      <hr className="border-stone-200 mb-5" />

      {/* Meu jardim */}
      <p className="text-xs uppercase tracking-wider text-stone-500 mb-3">
        meu jardim
      </p>
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm">{ativos.length} hábitos ativos</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">{numConquistas} conquistas</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">{numEspecies} espécies</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">🔥 {maiorStreakGlobal}d maior streak</span>
        </div>
      </div>

      <hr className="border-stone-200 mb-5" />

      {/* Ajustes (placeholders pra Fase 7) */}
      <p className="text-xs uppercase tracking-wider text-stone-500 mb-3">
        ajustes
      </p>
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center opacity-50">
          <span className="text-sm">🌙 modo escuro</span>
          <span className="text-xs italic text-stone-500">em breve</span>
        </div>
        <ToggleNotificacoes />
      </div>

      <hr className="border-stone-200 mb-5" />

      {/* Sair */}
      <form action={sair}>
        <Button
          type="submit"
          variant="ghost"
          className="w-full text-stone-600 hover:text-costela text-sm"
        >
          sair
        </Button>
      </form>

      <div className="mt-auto" />
      <NavInferior ativa="perfil" />
    </main>
  );
}
