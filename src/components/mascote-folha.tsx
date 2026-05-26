"use client";

import { motion } from "framer-motion";

type Props = {
  tamanho?: number; // largura em px
  comOlhos?: boolean;
  expressao?: "feliz" | "atenta" | "dormindo";
};

/**
 * Mascote da Mudinha — folha estilizada de costela de adão.
 * Inspirada na Monstera deliciosa: furos característicos + cor verde profunda.
 * Anima sutilmente (balança como se fosse o vento).
 */
export function MascoteFolha({
  tamanho = 120,
  comOlhos = true,
  expressao = "feliz",
}: Props) {
  return (
    <motion.div
      animate={{
        rotate: [-3, 3, -3],
        y: [0, -3, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{ width: tamanho, height: tamanho * 1.1 }}
      className="inline-block"
    >
      <svg
        viewBox="0 0 120 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        {/* Caule */}
        <path
          d="M60 130 Q58 115 60 95"
          stroke="#2D5F3F"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Folha principal — formato Monstera */}
        <path
          d="
            M60 95
            Q15 90 12 55
            Q12 25 35 15
            Q55 5 75 12
            Q105 22 108 55
            Q108 85 75 92
            Q68 94 60 95
            Z
          "
          fill="#87B891"
          stroke="#2D5F3F"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Veias da folha */}
        <path
          d="M60 95 Q55 60 35 30"
          stroke="#2D5F3F"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M60 95 Q70 60 90 30"
          stroke="#2D5F3F"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M60 95 L60 30"
          stroke="#2D5F3F"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Furos característicos da costela de adão */}
        <ellipse cx="35" cy="50" rx="6" ry="9" fill="#F5F1E8" transform="rotate(-20 35 50)" />
        <ellipse cx="85" cy="50" rx="6" ry="9" fill="#F5F1E8" transform="rotate(20 85 50)" />
        <ellipse cx="30" cy="75" rx="5" ry="7" fill="#F5F1E8" transform="rotate(-30 30 75)" />
        <ellipse cx="90" cy="75" rx="5" ry="7" fill="#F5F1E8" transform="rotate(30 90 75)" />
        <ellipse cx="60" cy="35" rx="4" ry="6" fill="#F5F1E8" />

        {/* Olhinhos */}
        {comOlhos && expressao === "feliz" && (
          <>
            <motion.circle
              cx="48"
              cy="62"
              r="3"
              fill="#0F1A14"
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: "48px 62px" }}
            />
            <motion.circle
              cx="72"
              cy="62"
              r="3"
              fill="#0F1A14"
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: "72px 62px" }}
            />
            {/* Sorriso sutil */}
            <path
              d="M52 73 Q60 78 68 73"
              stroke="#0F1A14"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}

        {comOlhos && expressao === "atenta" && (
          <>
            <circle cx="48" cy="62" r="3" fill="#0F1A14" />
            <circle cx="72" cy="62" r="3" fill="#0F1A14" />
            <circle cx="60" cy="74" r="1.5" fill="#0F1A14" />
          </>
        )}

        {comOlhos && expressao === "dormindo" && (
          <>
            <path d="M44 62 Q48 65 52 62" stroke="#0F1A14" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <path d="M68 62 Q72 65 76 62" stroke="#0F1A14" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </>
        )}
      </svg>
    </motion.div>
  );
}
