// ════════════════════════════════════════════════════════
// Supabase — cliente para o NAVEGADOR (client components)
// ════════════════════════════════════════════════════════
// Use este client em componentes marcados com "use client".
// Para server components / route handlers, use ./server.ts.
// ════════════════════════════════════════════════════════

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
