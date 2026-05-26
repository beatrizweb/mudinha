"use client";

import { motion } from "framer-motion";
import { ESPECIES } from "@/lib/conquistas";

type Props = {
  especieAtual: string;
  especiesDesbloqueadas: string[]; // ids
  onSelecionar: (id: string) => void;
};

export function SeletorEspecie({
  especieAtual,
  especiesDesbloqueadas,
  onSelecionar,
}: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {ESPECIES.map((e, i) => {
        const desbloqueada = especiesDesbloqueadas.includes(e.id);
        const selecionada = e.id === especieAtual;
        return (
          <motion.button
            key={e.id}
            type="button"
            onClick={() => desbloqueada && onSelecionar(e.id)}
            disabled={!desbloqueada}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03, type: "spring", stiffness: 250 }}
            className={`rounded-2xl p-3 text-center transition-all ${
              selecionada
                ? "bg-offwhite border-2 border-costela"
                : desbloqueada
                ? "bg-offwhite border border-stone-200 hover:border-costela/40 cursor-pointer"
                : "bg-stone-100 border border-stone-200 grayscale opacity-50 cursor-not-allowed"
            }`}
          >
            <div className="text-2xl mb-1">
              {desbloqueada ? e.emoji : "🔒"}
            </div>
            <div className="text-xs font-medium leading-tight">{e.nome}</div>
            <div className="text-xs text-stone-500 mt-1">
              {desbloqueada ? (selecionada ? "atual" : "trocar") : e.desbloqueio}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
