import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  calcularStreakAtual,
  calcularMaiorStreak,
  gerarHistoricoUltimosNDias,
  regouHoje,
} from "@/lib/streak";
import { estagioPorStreak, progressoNoEstagio } from "@/lib/plantas";
import { Historico28Dias } from "@/components/historico-28-dias";
import { AcoesHabito } from "@/components/acoes-habito";
import { RegarBotao } from "@/components/regar-botao";
import { PlantaGrande } from "@/components/planta-grande";
import type { Habito, Checkin } from "@/lib/types";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DetalheHabitoPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Busca o hábito
  const { data: habito } = await supabase
    .from("habits")
    .select("*")
    .eq("id", id)
    .single();

  if (!habito) notFound();

  // Busca todos os checkins desse hábito
  const { data: checkins } = await supabase
    .from("checkins")
    .select("*")
    .eq("habit_id", id)
    .order("date", { ascending: false });

  const h = habito as Habito;
  const datas = ((checkins ?? []) as Checkin[]).map((c) => c.date);

  const streakAtual = calcularStreakAtual(datas);
  const maiorStreak = calcularMaiorStreak(datas);
  const estagio = estagioPorStreak(streakAtual);
  const progresso = progressoNoEstagio(streakAtual);
  const ehoje = regouHoje(datas);
  const ultimosDias = gerarHistoricoUltimosNDias(datas, 28);

  return (
    <main className="flex flex-col flex-1 bg-areia px-6 py-8 max-w-md mx-auto w-full">
      <header className="flex justify-between items-center mb-4">
        <Link href="/jardim" className="text-costela text-sm">
          ← {h.icon} {h.name}
        </Link>
        <Link
          href={`/habito/${h.id}/editar`}
          className="text-stone-500 hover:text-costela text-sm"
        >
          editar
        </Link>
      </header>

      {h.paused && (
        <div className="bg-terra/15 border border-terra/30 rounded-xl p-3 mb-4 text-center text-sm text-terra">
          ⏸ Hábito pausado — sem cobrança, sem culpa.
        </div>
      )}

      {/* Planta grande animada */}
      <PlantaGrande
        emoji={estagio.emoji}
        progresso={progresso}
        nome={estagio.nome}
        proximoEm={estagio.proximoEm}
      />

      <hr className="border-stone-200 mb-4" />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-offwhite rounded-xl p-4 text-center border border-stone-200">
          <div className="font-serif text-2xl text-costela">
            🔥 {streakAtual}d
          </div>
          <div className="text-xs text-stone-600 mt-1">streak atual</div>
        </div>
        <div className="bg-offwhite rounded-xl p-4 text-center border border-stone-200">
          <div className="font-serif text-2xl text-costela">
            💚 {maiorStreak}d
          </div>
          <div className="text-xs text-stone-600 mt-1">seu recorde</div>
        </div>
      </div>

      {/* Histórico */}
      <p className="text-sm font-medium mb-1">histórico</p>
      <p className="text-xs text-stone-500 mb-3">últimas 4 semanas</p>
      <Historico28Dias dias={ultimosDias} />

      {/* Botão regar (se não pausado e não regado hoje) */}
      <div className="mt-6 mb-6">
        {h.paused ? (
          <Button
            disabled
            className="w-full bg-stone-300 text-stone-600 rounded-full py-6"
          >
            pausado
          </Button>
        ) : ehoje ? (
          <div className="text-center py-3 bg-brote/20 border border-brote/40 rounded-full text-costela font-medium">
            ✓ regado hoje!
          </div>
        ) : (
          <RegarBotao habitId={h.id} />
        )}
      </div>

      <hr className="border-stone-200 mb-4" />

      <AcoesHabito habitId={h.id} pausado={h.paused} />
    </main>
  );
}
