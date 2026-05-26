import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FormEdicaoHabito } from "@/components/form-edicao-habito";
import { calcularMaiorStreak } from "@/lib/streak";
import { verificarEspecies } from "@/lib/conquistas";
import type { Habito, Checkin } from "@/lib/types";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditarHabitoPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: habito } = await supabase
    .from("habits")
    .select("*")
    .eq("id", id)
    .single();

  if (!habito) notFound();

  // Pra mostrar quais espécies o usuário já desbloqueou
  const { data: todosHabitos } = await supabase.from("habits").select("*");
  const { data: checkins } = await supabase.from("checkins").select("*");

  const habitosArr = (todosHabitos ?? []) as Habito[];
  const checkinsArr = (checkins ?? []) as Checkin[];
  const ativos = habitosArr.filter((h) => !h.archived);

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

  const especiesDesbloqueadas = verificarEspecies(ctx)
    .filter((e) => e.desbloqueada)
    .map((e) => e.id);

  return (
    <main className="flex flex-col flex-1 bg-areia px-6 py-8 max-w-md mx-auto w-full">
      <Link href={`/habito/${id}`} className="text-costela text-sm mb-6">
        ← editar hábito
      </Link>

      <FormEdicaoHabito
        habito={habito as Habito}
        especiesDesbloqueadas={especiesDesbloqueadas}
      />
    </main>
  );
}
