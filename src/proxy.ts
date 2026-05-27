// ════════════════════════════════════════════════════════
// Proxy do Next.js — roda ANTES de cada request
// ════════════════════════════════════════════════════════
// (Antes chamado de "middleware" — renomeado no Next 16)
// Aqui a gente refresca a sessão do Supabase e protege
// rotas que exigem login.
// ════════════════════════════════════════════════════════

import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Aplica em tudo, exceto arquivos estáticos e imagens
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
