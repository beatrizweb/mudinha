// ════════════════════════════════════════════════════════
// Cálculo de streak (sequência de dias consecutivos)
// ════════════════════════════════════════════════════════

/**
 * Dado um array de datas (strings YYYY-MM-DD), calcula a
 * sequência atual de dias consecutivos com checkin.
 *
 * Regras:
 * - Streak conta a partir de hoje OU ontem (1 dia de grace)
 * - Se o último checkin foi a mais de 1 dia, streak = 0
 * - Múltiplos checkins no mesmo dia contam como 1
 */
export function calcularStreakAtual(datasISO: string[]): number {
  if (datasISO.length === 0) return 0;

  // Normaliza e ordena descendente, removendo duplicatas
  const datas = Array.from(new Set(datasISO))
    .map((d) => parseDataLocal(d))
    .sort((a, b) => b.getTime() - a.getTime());

  const hoje = inicioDoDia(new Date());
  const ontem = new Date(hoje);
  ontem.setDate(hoje.getDate() - 1);

  const ultimo = datas[0];

  // Se o último checkin foi a mais de 1 dia, streak quebrou
  if (ultimo.getTime() < ontem.getTime()) return 0;

  // Conta dias consecutivos
  let streak = 1;
  let referencia = ultimo;

  for (let i = 1; i < datas.length; i++) {
    const atual = datas[i];
    const diff = diasEntre(atual, referencia);
    if (diff === 1) {
      streak++;
      referencia = atual;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Verifica se o usuário já fez checkin hoje neste hábito.
 */
export function regouHoje(datasISO: string[]): boolean {
  const hoje = formatarDataISO(new Date());
  return datasISO.includes(hoje);
}

// ──────────── helpers ────────────

function inicioDoDia(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

function diasEntre(menor: Date, maior: Date): number {
  return Math.round((maior.getTime() - menor.getTime()) / (1000 * 60 * 60 * 24));
}

function parseDataLocal(iso: string): Date {
  // iso = "YYYY-MM-DD" — interpreta como local, não UTC
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatarDataISO(d: Date): string {
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}
