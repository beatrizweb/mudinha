// ════════════════════════════════════════════════════════
// Tipos compartilhados da Mudinha
// ════════════════════════════════════════════════════════

export type Frequencia = "daily" | "custom";

export type Habito = {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  species: string;
  frequency: Frequencia;
  days_of_week: number[]; // 0=domingo, 6=sábado
  reminder_time: string | null;
  paused: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
};

export type Checkin = {
  id: string;
  habit_id: string;
  user_id: string;
  date: string; // formato YYYY-MM-DD
  created_at: string;
};

// Estágio visual da planta
export type Estagio = {
  emoji: string;
  arte: string; // caminho pra ilustração SVG/PNG em public/plantas/ (com fallback pro emoji)
  id: "semente" | "brotinho" | "mudinha" | "vaso-pequeno" | "vaso-medio" | "crescida" | "majestosa";
  nome: string;
  proximoEm: number | null;
};
