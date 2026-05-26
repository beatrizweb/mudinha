"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cadastrar } from "../login/actions";

export default function CadastroPage() {
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(formData: FormData) {
    setCarregando(true);
    setErro(null);
    const resultado = await cadastrar(formData);
    if (resultado?.erro) {
      setErro(resultado.erro);
      setCarregando(false);
    }
  }

  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-areia px-6 py-16">
      <div className="max-w-md w-full">
        <Link href="/" className="text-costela text-sm mb-12 block">
          ← Mudinha 🌿
        </Link>

        <h1 className="font-serif text-4xl text-costela text-center mb-2">
          bora plantar.
        </h1>
        <p className="text-center text-stone-600 mb-10">
          cria sua conta em 30 segundos.
        </p>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">seu email</Label>
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
            <Label htmlFor="password">crie uma senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="mínimo 6 caracteres"
              required
              minLength={6}
              autoComplete="new-password"
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
            {carregando ? "plantando..." : "plantar minha mudinha 🌱"}
          </Button>
        </form>

        <hr className="border-stone-200 my-8" />

        <p className="text-center text-sm">
          já tem conta?{" "}
          <Link href="/login" className="text-costela font-medium underline">
            entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
