"use client";

import { useState, useTransition } from "react";
import { pausarHabito, arrancarHabito } from "@/app/habito/[id]/actions";

type Props = {
  habitId: string;
  pausado: boolean;
};

export function AcoesHabito({ habitId, pausado }: Props) {
  const [isPending, startTransition] = useTransition();
  const [confirmandoArrancar, setConfirmandoArrancar] = useState(false);

  function handlePausar() {
    startTransition(async () => {
      await pausarHabito(habitId, !pausado);
    });
  }

  function handleArrancar() {
    if (!confirmandoArrancar) {
      setConfirmandoArrancar(true);
      setTimeout(() => setConfirmandoArrancar(false), 4000);
      return;
    }
    startTransition(async () => {
      await arrancarHabito(habitId);
    });
  }

  return (
    <div className="text-center space-y-3">
      <button
        onClick={handlePausar}
        disabled={isPending}
        className="text-sm text-stone-600 hover:text-costela block w-full transition-colors"
      >
        {isPending ? "..." : pausado ? "🌱 retomar hábito" : "⏸ pausar hábito"}
      </button>

      <button
        onClick={handleArrancar}
        disabled={isPending}
        className="text-sm text-red-700 hover:text-red-900 block w-full transition-colors"
      >
        {confirmandoArrancar
          ? "tem certeza? clica de novo pra arrancar 🥀"
          : "arrancar 🥀"}
      </button>
    </div>
  );
}
