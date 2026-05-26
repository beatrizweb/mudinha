// ════════════════════════════════════════════════════════
// Sistema de evolução das plantas — 7 estágios
// ════════════════════════════════════════════════════════
// Cada estágio tem:
// - emoji: fallback rápido (se a arte ainda não existir)
// - arte:  caminho pra ilustração em public/plantas/ (Bia desenha)
// - id:    identificador estável
// - nome:  texto de exibição
// ════════════════════════════════════════════════════════

import type { Estagio } from "./types";

export function estagioPorStreak(dias: number): Estagio {
  if (dias >= 100)
    return {
      emoji: "🌺",
      arte: "/plantas/majestosa.svg",
      id: "majestosa",
      nome: "majestosa",
      proximoEm: null,
    };
  if (dias >= 60)
    return {
      emoji: "🌴",
      arte: "/plantas/crescida.svg",
      id: "crescida",
      nome: "crescida",
      proximoEm: 100 - dias,
    };
  if (dias >= 30)
    return {
      emoji: "🌳",
      arte: "/plantas/vaso-medio.svg",
      id: "vaso-medio",
      nome: "vaso médio",
      proximoEm: 60 - dias,
    };
  if (dias >= 14)
    return {
      emoji: "🪴",
      arte: "/plantas/vaso-pequeno.svg",
      id: "vaso-pequeno",
      nome: "vaso pequeno",
      proximoEm: 30 - dias,
    };
  if (dias >= 7)
    return {
      emoji: "🍃",
      arte: "/plantas/mudinha.svg",
      id: "mudinha",
      nome: "mudinha",
      proximoEm: 14 - dias,
    };
  if (dias >= 3)
    return {
      emoji: "🌿",
      arte: "/plantas/brotinho.svg",
      id: "brotinho",
      nome: "brotinho",
      proximoEm: 7 - dias,
    };
  return {
    emoji: "🌱",
    arte: "/plantas/semente.svg",
    id: "semente",
    nome: "semente",
    proximoEm: 3 - dias,
  };
}

// Progresso (0-100%) dentro do estágio atual
export function progressoNoEstagio(dias: number): number {
  if (dias >= 100) return 100;
  if (dias >= 60) return ((dias - 60) / 40) * 100;
  if (dias >= 30) return ((dias - 30) / 30) * 100;
  if (dias >= 14) return ((dias - 14) / 16) * 100;
  if (dias >= 7) return ((dias - 7) / 7) * 100;
  if (dias >= 3) return ((dias - 3) / 4) * 100;
  return (dias / 3) * 100;
}
