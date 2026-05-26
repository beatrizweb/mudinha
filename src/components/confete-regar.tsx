"use client";

import { motion } from "framer-motion";

const EMOJIS = ["🌿", "💚", "✨", "🍃", "💧"];

export function ConfeteRegar() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {EMOJIS.map((emoji, i) => {
        const xOffset = (i - 2) * 25; // spread horizontal
        const delay = i * 0.05;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 0, x: xOffset, scale: 0.5 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [0, -60 - i * 10],
              x: [xOffset, xOffset + (Math.random() - 0.5) * 30],
              scale: [0.5, 1.2, 1, 0.8],
              rotate: [0, (Math.random() - 0.5) * 60],
            }}
            transition={{
              duration: 1.2,
              delay,
              ease: "easeOut",
            }}
            className="absolute left-1/2 top-1/2 text-2xl"
            style={{ marginLeft: "-12px", marginTop: "-12px" }}
          >
            {emoji}
          </motion.span>
        );
      })}
    </div>
  );
}
