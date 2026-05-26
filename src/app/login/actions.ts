"use server";

// ════════════════════════════════════════════════════════
// Server Actions de autenticação
// ════════════════════════════════════════════════════════
// "use server" indica que estas funções rodam no SERVIDOR
// — não no navegador. Podem usar segredos com segurança.
// ════════════════════════════════════════════════════════

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function entrar(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { erro: traduzirErro(error.message) };
  }

  revalidatePath("/", "layout");
  redirect("/jardim");
}

export async function cadastrar(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { erro: traduzirErro(error.message) };
  }

  revalidatePath("/", "layout");
  // Primeira vez: passa pelo onboarding pra plantar a 1ª mudinha guiada
  redirect("/onboarding");
}

export async function sair() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

// Traduz mensagens de erro do Supabase pra português
function traduzirErro(mensagem: string): string {
  const traducoes: Record<string, string> = {
    "Invalid login credentials": "Email ou senha incorretos.",
    "User already registered": "Este email já tem conta. Tenta entrar.",
    "Email not confirmed": "Confirma seu email antes de entrar.",
    "Password should be at least 6 characters":
      "A senha precisa ter pelo menos 6 caracteres.",
    "Unable to validate email address: invalid format": "Email inválido.",
  };
  return traducoes[mensagem] ?? mensagem;
}
