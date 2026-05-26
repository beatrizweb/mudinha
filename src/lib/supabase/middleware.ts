// ════════════════════════════════════════════════════════
// Supabase — helper de middleware
// ════════════════════════════════════════════════════════
// Refresca a sessão do usuário automaticamente a cada
// request, e protege rotas que exigem login.
// ════════════════════════════════════════════════════════

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Rotas que exigem usuário logado
const ROTAS_PROTEGIDAS = ["/jardim", "/perfil", "/habito", "/conquistas", "/onboarding"];

// Rotas só pra deslogado (redireciona pra /jardim se logado)
const ROTAS_DE_AUTH = ["/login", "/cadastro"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANTE: getUser() deve ser chamado logo após createServerClient
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Rota protegida + sem usuário → manda pro login
  const ehRotaProtegida = ROTAS_PROTEGIDAS.some((rota) =>
    pathname.startsWith(rota)
  );
  if (ehRotaProtegida && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Rota de auth + já logado → manda pro jardim
  const ehRotaDeAuth = ROTAS_DE_AUTH.some((rota) => pathname.startsWith(rota));
  if (ehRotaDeAuth && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/jardim";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
