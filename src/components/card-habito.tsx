"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { regar } from "@/app/jardim/actions";
import { ConfeteRegar } from "@/components/confete-regar";
import type { Habito, Estagio } from "@/lib/types";

type Props = {
  habito: Habito;
  streak: number;
  regouHoje: boolean;
  estagio: Estagio;
  progresso: number;
  index?: number;
};

export function CardHabito({
  habito,
  streak,
  regouHoje,
  estagio,
  progresso,
  index = 0,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarConfete, setMostrarConfete] = useState(false);

  function handleRegar(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setErro(null);
    setMostrarConfete(true);
    setTimeout(() => setMostrarConfete(false), 1500);
    startTransition(async () => {
      const r = await regar(habito.id);
      if (r?.erro) setErro(r.erro);
    });
  }

  const jaRegado = regouHoje;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07, ease: "easeOut" }}
      className="relative"
    >
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
          <span className="text-xs text-stone-500">{streak}d</span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <motion.div
            key={estagio.emoji}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="text-2xl relative"
          >
            {estagio.emoji}
            <AnimatePresence>
              {mostrarConfete && <ConfeteRegar />}
            </AnimatePresence>
          </motion.div>
          <div className="flex-1">
            <div className="bg-stone-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progresso}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="bg-brote h-full"
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="text-center text-sm text-costela font-medium py-2"
          >
            ✓ regado!
          </motion.div>
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
    </motion.div>
  );
}
