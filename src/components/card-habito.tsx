"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { regar } from "@/app/jardim/actions";
import type { Habito, Estagio } from "@/lib/types";

type Props = {
  habito: Habito;
  streak: number;
  regouHoje: boolean;
  estagio: Estagio;
  progresso: number;
};

export function CardHabito({ habito, streak, regouHoje, estagio, progresso }: Props) {
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  function handleRegar(e: React.MouseEvent) {
    e.preventDefault(); // não navega pra detalhe quando clica em regar
    e.stopPropagation();
    setErro(null);
    startTransition(async () => {
      const r = await regar(habito.id);
      if (r?.erro) setErro(r.erro);
    });
  }

  const jaRegado = regouHoje;

  return (
    <Link
      href={`/habito/${habito.id}`}
      className={`block rounded-2xl p-4 border transition-colors ${
        jaRegado
          ? "bg-brote/20 border-brote/40 hover:bg-brote/30"
          : "bg-offwhite border-stone-200 hover:border-costela/40"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="font-medium text-sm flex items-center gap-2">
          <span>{habito.icon}</span>
          <span>{habito.name}</span>
          {habito.paused && (
            <span className="text-xs text-terra ml-1">⏸ pausado</span>
          )}
        </div>
        <span className="text-xs text-stone-500">
          {streak}d
        </span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="text-2xl">{estagio.emoji}</div>
        <div className="flex-1">
          <div className="bg-stone-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brote h-full transition-all duration-500"
              style={{ width: `${progresso}%` }}
            />
          </div>
          <div className="text-xs text-stone-600 mt-1">{estagio.nome}</div>
        </div>
      </div>

      {habito.paused ? (
        <div className="text-center text-sm text-stone-500 py-2">
          hábito pausado
        </div>
      ) : jaRegado ? (
        <div className="text-center text-sm text-costela font-medium py-2">
          ✓ regado!
        </div>
      ) : (
        <Button
          onClick={handleRegar}
          disabled={isPending}
          className="w-full bg-costela hover:bg-costela/90 text-white rounded-full py-2.5 text-sm font-medium"
        >
          {isPending ? "regando..." : "regar 💧"}
        </Button>
      )}

      {erro && (
        <p className="text-xs text-red-700 mt-2 text-center">{erro}</p>
      )}
    </Link>
  );
}
