"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function criarHabito(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { erro: "Você precisa estar logada." };
  }

  const name = (formData.get("name") as string)?.trim();
  const icon = (formData.get("icon") as string) || "🌱";
  const frequency = formData.get("frequency") as string;
  const reminder = formData.get("reminder_time") as string;

  if (!name) {
    return { erro: "Dá um nome pro seu hábito." };
  }

  // Frequência: "daily" = todo dia | "custom" = dias específicos
  let days_of_week: number[] = [0, 1, 2, 3, 4, 5, 6];
  if (frequency === "custom") {
    const dias: number[] = [];
    for (let d = 0; d <= 6; d++) {
      if (formData.get(`day_${d}`)) dias.push(d);
    }
    if (dias.length === 0) {
      return { erro: "Escolhe pelo menos 1 dia da semana." };
    }
    days_of_week = dias;
  }

  const { error } = await supabase.from("habits").insert({
    user_id: user.id,
    name,
    icon,
    frequency,
    days_of_week,
    reminder_time: reminder || null,
  });

  if (error) {
    return { erro: `Erro ao plantar: ${error.message}` };
  }

  revalidatePath("/jardim");
  redirect("/jardim");
}
