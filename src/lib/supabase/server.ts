// ════════════════════════════════════════════════════════
// Supabase — cliente para o SERVIDOR (server components)
// ════════════════════════════════════════════════════════
// Use este client em server components, route handlers e
// server actions. Ele lê os cookies de sessão automaticamente.
// ════════════════════════════════════════════════════════

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignorado: chamado de Server Component sem ação de cookies.
            // Sessão é refrescada pelo middleware.
          }
        },
      },
    }
  );
}
