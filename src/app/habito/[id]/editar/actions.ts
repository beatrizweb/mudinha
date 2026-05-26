"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type DadosEdicao = {
  id: string;
  name: string;
  icon: string;
  species: string;
  frequency: "daily" | "custom";
  days_of_week: number[];
  reminder_time: string | null;
};

export async function editarHabito(dados: DadosEdicao) {
  const supabase = await createClient();

  if (!dados.name?.trim()) {
    return { erro: "Dá um nome pro hábito." };
  }
  if (dados.frequency === "custom" && dados.days_of_week.length === 0) {
    return { erro: "Escolhe pelo menos 1 dia da semana." };
  }

  const { error } = await supabase
    .from("habits")
    .update({
      name: dados.name.trim(),
      icon: dados.icon || "🌱",
      species: dados.species || "costela-de-adao",
      frequency: dados.frequency,
      days_of_week: dados.days_of_week,
      reminder_time: dados.reminder_time,
    })
    .eq("id", dados.id);

  if (error) return { erro: error.message };

  revalidatePath("/jardim");
  revalidatePath(`/habito/${dados.id}`);
  redirect(`/habito/${dados.id}`);
}
