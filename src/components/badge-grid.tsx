"use client";

import { motion } from "framer-motion";

type Item = {
  id: string;
  emoji: string;
  nome: string;
  rotulo: string; // requisito ou desbloqueio
  desbloqueada: boolean;
};

type Props = {
  items: Item[];
  comCadeado?: boolean; // se true, items bloqueados mostram 🔒 em vez do emoji
};

export function BadgeGrid({ items, comCadeado = false }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: i * 0.05,
            type: "spring",
            stiffness: 200,
            damping: 14,
          }}
          className={`rounded-2xl p-3 text-center ${
            item.desbloqueada
              ? "bg-offwhite border border-brote/40"
              : "bg-stone-100 grayscale opacity-50"
          }`}
        >
          <motion.div
            animate={
              item.desbloqueada
                ? { y: [0, -2, 0] }
                : {}
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
            className="text-3xl mb-1"
          >
            {item.desbloqueada
              ? item.emoji
              : comCadeado
              ? "🔒"
              : item.emoji}
          </motion.div>
          <div className="text-xs font-medium leading-tight">{item.nome}</div>
          <div className="text-xs text-stone-500 mt-1">{item.rotulo}</div>
        </motion.div>
      ))}
    </div>
  );
}
