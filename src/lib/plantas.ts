// ════════════════════════════════════════════════════════
// Sistema de evolução das plantas
// ════════════════════════════════════════════════════════
// 7 estágios baseados na streak (dias consecutivos):
//   0-2d   🌱 semente
//   3-6d   🌿 brotinho
//   7-13d  🍃 mudinha
//   14-29d 🪴 vaso pequeno
//   30-59d 🌳 vaso médio
//   60-99d 🌴 crescida
//   100d+  🌺 majestosa
// ════════════════════════════════════════════════════════

import type { Estagio } from "./types";

export function estagioPorStreak(dias: number): Estagio {
  if (dias >= 100) return { emoji: "🌺", nome: "majestosa", proximoEm: null };
  if (dias >= 60)  return { emoji: "🌴", nome: "crescida", proximoEm: 100 - dias };
  if (dias >= 30)  return { emoji: "🌳", nome: "vaso médio", proximoEm: 60 - dias };
  if (dias >= 14)  return { emoji: "🪴", nome: "vaso pequeno", proximoEm: 30 - dias };
  if (dias >= 7)   return { emoji: "🍃", nome: "mudinha", proximoEm: 14 - dias };
  if (dias >= 3)   return { emoji: "🌿", nome: "brotinho", proximoEm: 7 - dias };
  return { emoji: "🌱", nome: "semente", proximoEm: 3 - dias };
}

// Progresso (0-100%) dentro do estágio atual
export function progressoNoEstagio(dias: number): number {
  if (dias >= 100) return 100;
  if (dias >= 60)  return ((dias - 60) / 40) * 100;
  if (dias >= 30)  return ((dias - 30) / 30) * 100;
  if (dias >= 14)  return ((dias - 14) / 16) * 100;
  if (dias >= 7)   return ((dias - 7) / 7) * 100;
  if (dias >= 3)   return ((dias - 3) / 4) * 100;
  return (dias / 3) * 100;
}
