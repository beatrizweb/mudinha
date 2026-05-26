"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { entrar } from "./actions";

export default function LoginPage() {
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(formData: FormData) {
    setCarregando(true);
    setErro(null);
    const resultado = await entrar(formData);
    if (resultado?.erro) {
      setErro(resultado.erro);
      setCarregando(false);
    }
    // Sucesso: redireciona dentro da action, nada a fazer aqui
  }

  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-areia px-6 py-16">
      <div className="max-w-md w-full">
        <Link href="/" className="text-costela text-sm mb-12 block">
          ← Mudinha 🌿
        </Link>

        <h1 className="font-serif text-4xl text-costela text-center mb-2">
          bom te ver.
        </h1>
        <p className="text-center text-stone-600 mb-10">
          entra na sua estufa.
        </p>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="voce@exemplo.com"
              required
              autoComplete="email"
              className="bg-offwhite"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="current-password"
              className="bg-offwhite"
            />
          </div>

          {erro && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
              {erro}
            </p>
          )}

          <Button
            type="submit"
            disabled={carregando}
            className="w-full bg-costela hover:bg-costela/90 text-white rounded-full py-6 font-medium"
          >
            {carregando ? "entrando..." : "entrar"}
          </Button>
        </form>

        <hr className="border-stone-200 my-8" />

        <p className="text-center text-sm">
          primeira vez?{" "}
          <Link href="/cadastro" className="text-costela font-medium underline">
            plantar agora
          </Link>
        </p>
      </div>
    </main>
  );
}
