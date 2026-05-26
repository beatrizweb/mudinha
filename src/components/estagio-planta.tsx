"use client";

import { useState } from "react";

type Props = {
  arte: string; // caminho da imagem em /public
  emoji: string; // fallback se imagem não existir
  tamanho?: number; // em px
  alt?: string;
};

/**
 * Renderiza o estágio visual da planta.
 * Se a arte (SVG/PNG) existir em public/plantas/, mostra ela.
 * Caso contrário, mostra o emoji como fallback automático.
 *
 * Assim a Bia pode ir desenhando estágio por estágio:
 * cada vez que adiciona um arquivo em public/plantas/, ele
 * aparece automaticamente substituindo o emoji.
 */
export function EstagioPlanta({ arte, emoji, tamanho = 32, alt }: Props) {
  const [erro, setErro] = useState(false);

  if (erro) {
    return (
      <span
        role="img"
        aria-label={alt || emoji}
        style={{ fontSize: tamanho, lineHeight: 1 }}
      >
        {emoji}
      </span>
    );
  }

  // Usa <img> em vez de next/image pra suporte ao onError sem config extra
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={arte}
      alt={alt || ""}
      width={tamanho}
      height={tamanho}
      onError={() => setErro(true)}
      style={{
        width: tamanho,
        height: tamanho,
        objectFit: "contain",
        display: "inline-block",
      }}
    />
  );
}
