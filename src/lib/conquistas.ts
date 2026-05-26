// ════════════════════════════════════════════════════════
// Sistema de conquistas e coleção de espécies
// ════════════════════════════════════════════════════════
// Conquistas são calculadas on-the-fly com base nos dados
// do usuário (sem tabela própria no banco — MVP simples).
// ════════════════════════════════════════════════════════

export type ContextoUsuario = {
  maiorStreak: number;
  numHabitosAtivos: number;
  totalCheckins: number;
  totalHabitosJaCriados: number;
};

export type Conquista = {
  id: string;
  emoji: string;
  nome: string;
  requisito: string;
  verifica: (ctx: ContextoUsuario) => boolean;
};

export const CONQUISTAS: Conquista[] = [
  {
    id: "primeira",
    emoji: "🌱",
    nome: "primeira mudinha",
    requisito: "criar 1 hábito",
    verifica: (c) => c.totalHabitosJaCriados >= 1,
  },
  {
    id: "regou-uma-vez",
    emoji: "💧",
    nome: "primeira regada",
    requisito: "1 checkin",
    verifica: (c) => c.totalCheckins >= 1,
  },
  {
    id: "brotou",
    emoji: "🌿",
    nome: "brotou",
    requisito: "3 dias seguidos",
    verifica: (c) => c.maiorStreak >= 3,
  },
  {
    id: "mudinha",
    emoji: "🍃",
    nome: "mudinha firme",
    requisito: "7 dias seguidos",
    verifica: (c) => c.maiorStreak >= 7,
  },
  {
    id: "vaso-pequeno",
    emoji: "🪴",
    nome: "vaso pequeno",
    requisito: "14 dias seguidos",
    verifica: (c) => c.maiorStreak >= 14,
  },
  {
    id: "vaso-medio",
    emoji: "🌳",
    nome: "vaso médio",
    requisito: "30 dias seguidos",
    verifica: (c) => c.maiorStreak >= 30,
  },
  {
    id: "crescida",
    emoji: "🌴",
    nome: "planta crescida",
    requisito: "60 dias seguidos",
    verifica: (c) => c.maiorStreak >= 60,
  },
  {
    id: "majestosa",
    emoji: "🌺",
    nome: "majestosa",
    requisito: "100 dias seguidos",
    verifica: (c) => c.maiorStreak >= 100,
  },
  {
    id: "trio",
    emoji: "🌷",
    nome: "trio botânico",
    requisito: "3 hábitos ativos",
    verifica: (c) => c.numHabitosAtivos >= 3,
  },
  {
    id: "quinteto",
    emoji: "💐",
    nome: "quinteto",
    requisito: "5 hábitos ativos",
    verifica: (c) => c.numHabitosAtivos >= 5,
  },
];

export type Especie = {
  id: string;
  emoji: string;
  nome: string;
  desbloqueio: string;
  verifica: (ctx: ContextoUsuario) => boolean;
};

export const ESPECIES: Especie[] = [
  {
    id: "costela-de-adao",
    emoji: "🪴",
    nome: "costela de adão",
    desbloqueio: "padrão",
    verifica: () => true,
  },
  {
    id: "suculenta",
    emoji: "🌵",
    nome: "suculenta",
    desbloqueio: "7d streak",
    verifica: (c) => c.maiorStreak >= 7,
  },
  {
    id: "espada-de-sao-jorge",
    emoji: "🗡️",
    nome: "espada de são jorge",
    desbloqueio: "14d streak",
    verifica: (c) => c.maiorStreak >= 14,
  },
  {
    id: "samambaia",
    emoji: "🌿",
    nome: "samambaia",
    desbloqueio: "30d streak",
    verifica: (c) => c.maiorStreak >= 30,
  },
  {
    id: "anturio",
    emoji: "🌺",
    nome: "antúrio",
    desbloqueio: "50d streak",
    verifica: (c) => c.maiorStreak >= 50,
  },
  {
    id: "cacto",
    emoji: "🌵",
    nome: "cacto",
    desbloqueio: "3 hábitos ativos",
    verifica: (c) => c.numHabitosAtivos >= 3,
  },
  {
    id: "bromelia",
    emoji: "🌸",
    nome: "bromélia",
    desbloqueio: "100d streak",
    verifica: (c) => c.maiorStreak >= 100,
  },
  {
    id: "lirio-da-paz",
    emoji: "🤍",
    nome: "lírio da paz",
    desbloqueio: "150d streak",
    verifica: (c) => c.maiorStreak >= 150,
  },
  {
    id: "jiboia",
    emoji: "🍀",
    nome: "jiboia",
    desbloqueio: "200d streak",
    verifica: (c) => c.maiorStreak >= 200,
  },
  {
    id: "orquidea",
    emoji: "💮",
    nome: "orquídea",
    desbloqueio: "365d streak",
    verifica: (c) => c.maiorStreak >= 365,
  },
];

export function verificarConquistas(ctx: ContextoUsuario) {
  return CONQUISTAS.map((c) => ({ ...c, desbloqueada: c.verifica(ctx) }));
}

export function verificarEspecies(ctx: ContextoUsuario) {
  return ESPECIES.map((e) => ({ ...e, desbloqueada: e.verifica(ctx) }));
}
