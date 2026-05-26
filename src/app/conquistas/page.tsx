import { createClient } from "@/lib/supabase/server";
import { calcularMaiorStreak } from "@/lib/streak";
import {
  verificarConquistas,
  verificarEspecies,
  type ContextoUsuario,
} from "@/lib/conquistas";
import { NavInferior } from "@/components/nav-inferior";
import type { Habito, Checkin } from "@/lib/types";

export default async function ConquistasPage() {
  const supabase = await createClient();

  // Busca hábitos ativos e arquivados (pra contar total já criado)
  const { data: todosHabitos } = await supabase.from("habits").select("*");
  const habitosArr = (todosHabitos ?? []) as Habito[];
  const ativos = habitosArr.filter((h) => !h.archived);

  // Busca todos os checkins do usuário
  const { data: checkins } = await supabase.from("checkins").select("*");
  const checkinsArr = (checkins ?? []) as Checkin[];

  // Calcula maior streak entre TODOS os hábitos
  let maiorStreakGlobal = 0;
  for (const h of habitosArr) {
    const datas = checkinsArr
      .filter((c) => c.habit_id === h.id)
      .map((c) => c.date);
    const s = calcularMaiorStreak(datas);
    if (s > maiorStreakGlobal) maiorStreakGlobal = s;
  }

  const ctx: ContextoUsuario = {
    maiorStreak: maiorStreakGlobal,
    numHabitosAtivos: ativos.length,
    totalCheckins: checkinsArr.length,
    totalHabitosJaCriados: habitosArr.length,
  };

  const conquistas = verificarConquistas(ctx);
  const especies = verificarEspecies(ctx);

  const destrancadas = conquistas.filter((c) => c.desbloqueada);
  const aDestrancar = conquistas.filter((c) => !c.desbloqueada);

  const especiesTem = especies.filter((e) => e.desbloqueada);
  const especiesFaltam = especies.filter((e) => !e.desbloqueada);

  return (
    <main className="flex flex-col flex-1 bg-areia px-6 py-8 max-w-md mx-auto w-full">
      <header className="mb-6">
        <h1 className="font-serif text-3xl text-costela">conquistas</h1>
      </header>

      {/* Destrancadas */}
      <p className="text-xs uppercase tracking-wider font-medium mb-3 text-costela">
        🏆 destrancadas ({destrancadas.length})
      </p>
      {destrancadas.length === 0 ? (
        <p className="text-sm text-stone-500 mb-6 italic">
          ainda nenhuma. plantando você desbloqueia! 🌱
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2 mb-6">
          {destrancadas.map((c) => (
            <div
              key={c.id}
              className="bg-offwhite rounded-2xl p-3 text-center border border-brote/40"
            >
              <div className="text-3xl mb-1">{c.emoji}</div>
              <div className="text-xs font-medium leading-tight">{c.nome}</div>
              <div className="text-xs text-stone-500 mt-1">{c.requisito}</div>
            </div>
          ))}
        </div>
      )}

      {/* A destrancar */}
      {aDestrancar.length > 0 && (
        <>
          <p className="text-xs uppercase tracking-wider font-medium mb-3 text-stone-500">
            🔒 a destrancar ({aDestrancar.length})
          </p>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {aDestrancar.map((c) => (
              <div
                key={c.id}
                className="bg-stone-100 rounded-2xl p-3 text-center grayscale opacity-50"
              >
                <div className="text-3xl mb-1">{c.emoji}</div>
                <div className="text-xs font-medium leading-tight">{c.nome}</div>
                <div className="text-xs text-stone-500 mt-1">{c.requisito}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <hr className="border-stone-200 mb-4" />

      {/* Coleção de espécies */}
      <p className="text-xs uppercase tracking-wider font-medium mb-3 text-costela">
        🌿 sua coleção ({especiesTem.length}/{especies.length})
      </p>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {especiesTem.map((e) => (
          <div
            key={e.id}
            className="bg-offwhite rounded-2xl p-3 text-center border border-brote/40"
          >
            <div className="text-3xl mb-1">{e.emoji}</div>
            <div className="text-xs font-medium leading-tight">{e.nome}</div>
            <div className="text-xs text-stone-500 mt-1">tem</div>
          </div>
        ))}
        {especiesFaltam.map((e) => (
          <div
            key={e.id}
            className="bg-stone-100 rounded-2xl p-3 text-center grayscale opacity-50"
          >
            <div className="text-3xl mb-1">🔒</div>
            <div className="text-xs font-medium leading-tight">{e.nome}</div>
            <div className="text-xs text-stone-500 mt-1">{e.desbloqueio}</div>
          </div>
        ))}
      </div>

      {especiesFaltam.length > 0 && (
        <p className="text-xs text-stone-500 text-center mt-3 italic">
          troque a espécie do hábito em breve · feature da Fase 6
        </p>
      )}

      <div className="mt-auto" />
      <NavInferior ativa="conquistas" />
    </main>
  );
}
