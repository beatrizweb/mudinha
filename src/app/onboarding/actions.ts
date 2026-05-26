"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type DadosHabito = {
  name: string;
  icon: string;
  frequency: "daily" | "custom";
  days_of_week: number[];
  reminder_time: string | null;
};

export async function criarHabitoNoOnboarding(dados: DadosHabito) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { erro: "Você precisa estar logada." };

  if (!dados.name?.trim()) return { erro: "Dá um nome pro seu hábito." };

  const { error } = await supabase.from("habits").insert({
    user_id: user.id,
    name: dados.name.trim(),
    icon: dados.icon || "🌱",
    frequency: dados.frequency,
    days_of_week: dados.days_of_week,
    reminder_time: dados.reminder_time,
  });

  if (error) return { erro: `Erro ao plantar: ${error.message}` };

  revalidatePath("/jardim");
  return { ok: true };
}
