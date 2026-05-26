"use client";

import { motion } from "framer-motion";
import { EstagioPlanta } from "@/components/estagio-planta";

type Props = {
  emoji: string;
  arte: string;
  estagioId: string;
  progresso: number;
  nome: string;
  proximoEm: number | null;
};

export function PlantaGrande({
  emoji,
  arte,
  estagioId,
  progresso,
  nome,
  proximoEm,
}: Props) {
  return (
    <div className="text-center py-6 mb-2">
      <motion.div
        key={estagioId}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{
          scale: [0.6, 1.1, 1],
          opacity: 1,
        }}
        transition={{
          scale: { duration: 0.7, times: [0, 0.6, 1], ease: "easeOut" },
          opacity: { duration: 0.4 },
        }}
        className="mb-3 inline-block"
      >
        <motion.div
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
          <EstagioPlanta arte={arte} emoji={emoji} tamanho={128} alt={nome} />
        </motion.div>
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
