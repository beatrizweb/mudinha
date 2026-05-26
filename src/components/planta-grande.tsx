"use client";

import { motion } from "framer-motion";

type Props = {
  emoji: string;
  progresso: number;
  nome: string;
  proximoEm: number | null;
};

export function PlantaGrande({ emoji, progresso, nome, proximoEm }: Props) {
  return (
    <div className="text-center py-6 mb-2">
      <motion.div
        key={emoji}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{
          scale: [0.6, 1.1, 1],
          opacity: 1,
        }}
        transition={{
          scale: { duration: 0.7, times: [0, 0.6, 1], ease: "easeOut" },
          opacity: { duration: 0.4 },
        }}
        className="text-8xl mb-3 inline-block"
      >
        <motion.span
          animate={{
            y: [0, -4, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="inline-block"
        >
          {emoji}
        </motion.span>
      </motion.div>

      <div className="w-32 mx-auto bg-stone-200 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progresso}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-brote h-full"
        />
      </div>
      <p className="font-serif text-sm text-stone-600 mt-2 italic">
        {nome}
        {proximoEm !== null && ` · faltam ${proximoEm}d pro próximo estágio`}
      </p>
    </div>
  );
}
