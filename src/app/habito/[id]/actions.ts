"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function pausarHabito(habitId: string, pausar: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("habits")
    .update({ paused: pausar })
    .eq("id", habitId);

  if (error) return { erro: error.message };

  revalidatePath("/jardim");
  revalidatePath(`/habito/${habitId}`);
  return { ok: true };
}

export async function arrancarHabito(habitId: string) {
  const supabase = await createClient();

  // Soft delete: arquivamos em vez de deletar (preserva histórico)
  const { error } = await supabase
    .from("habits")
    .update({ archived: true })
    .eq("id", habitId);

  if (error) return { erro: error.message };

  revalidatePath("/jardim");
  redirect("/jardim");
}
