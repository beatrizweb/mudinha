// ════════════════════════════════════════════════════════
// Supabase — cliente ADMIN (service_role)
// ════════════════════════════════════════════════════════
// IGNORA Row Level Security — só usar em rotas privadas
// como o cron de lembretes. NUNCA expor ao navegador.
// ════════════════════════════════════════════════════════

import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
}
