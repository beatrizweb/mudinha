import { createClient } from "@/lib/supabase/server";
import { calcularMaiorStreak } from "@/lib/streak";
import {
  verificarConquistas,
  verificarEspecies,
  type ContextoUsuario,
} from "@/lib/conquistas";
import { NavInferior } from "@/components/nav-inferior";
import { BadgeGrid } from "@/components/badge-grid";
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
        <div className="mb-6">
          <BadgeGrid
            items={destrancadas.map((c) => ({
              id: c.id,
              emoji: c.emoji,
              nome: c.nome,
              rotulo: c.requisito,
              desbloqueada: true,
            }))}
          />
        </div>
      )}

      {/* A destrancar */}
      {aDestrancar.length > 0 && (
        <>
          <p className="text-xs uppercase tracking-wider font-medium mb-3 text-stone-500">
            🔒 a destrancar ({aDestrancar.length})
          </p>
          <div className="mb-6">
            <BadgeGrid
              items={aDestrancar.map((c) => ({
                id: c.id,
                emoji: c.emoji,
                nome: c.nome,
                rotulo: c.requisito,
                desbloqueada: false,
              }))}
            />
          </div>
        </>
      )}

      <hr className="border-stone-200 mb-4" />

      {/* Coleção de espécies */}
      <p className="text-xs uppercase tracking-wider font-medium mb-3 text-costela">
        🌿 sua coleção ({especiesTem.length}/{especies.length})
      </p>

      <div className="mb-3">
        <BadgeGrid
          comCadeado
          items={[
            ...especiesTem.map((e) => ({
              id: e.id,
              emoji: e.emoji,
              nome: e.nome,
              rotulo: "tem",
              desbloqueada: true,
            })),
            ...especiesFaltam.map((e) => ({
              id: e.id,
              emoji: e.emoji,
              nome: e.nome,
              rotulo: e.desbloqueio,
              desbloqueada: false,
            })),
          ]}
        />
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
