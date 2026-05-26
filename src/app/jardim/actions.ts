"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function regar(habitId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { erro: "Não logada." };

  // Tenta inserir checkin de hoje. Se já existe, o UNIQUE
  // (habit_id, date) impede duplicar.
  const hoje = new Date();
  const dataISO = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;

  const { error } = await supabase.from("checkins").insert({
    habit_id: habitId,
    user_id: user.id,
    date: dataISO,
  });

  // Erro 23505 = unique violation = já regou hoje (ignora)
  if (error && error.code !== "23505") {
    return { erro: error.message };
  }

  revalidatePath("/jardim");
  return { ok: true };
}
