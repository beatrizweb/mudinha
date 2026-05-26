"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { editarHabito } from "@/app/habito/[id]/editar/actions";
import { SeletorEspecie } from "@/components/seletor-especie";
import type { Habito } from "@/lib/types";

const ICONES = [
  "🌱", "💧", "📖", "🏋️", "🧘", "😴", "✏️", "💼",
  "🍎", "☕", "🎨", "🎵", "🏃", "✨", "💊", "📞",
];
const DIAS_LABELS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

type Props = {
  habito: Habito;
  especiesDesbloqueadas: string[];
};

export function FormEdicaoHabito({ habito, especiesDesbloqueadas }: Props) {
  const [nome, setNome] = useState(habito.name);
  const [icone, setIcone] = useState(habito.icon);
  const [frequencia, setFrequencia] = useState<"daily" | "custom">(
    habito.frequency
  );
  const [diasSemana, setDiasSemana] = useState<number[]>(habito.days_of_week);
  const [lembrete, setLembrete] = useState(habito.reminder_time ?? "");
  const [especie, setEspecie] = useState(habito.species ?? "costela-de-adao");

  const [erro, setErro] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggleDia(d: number) {
    setDiasSemana((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  }

  function salvar() {
    setErro(null);
    startTransition(async () => {
      const r = await editarHabito({
        id: habito.id,
        name: nome,
        icon: icone,
        species: especie,
        frequency: frequencia,
        days_of_week:
          frequencia === "custom" ? diasSemana : [0, 1, 2, 3, 4, 5, 6],
        reminder_time: lembrete || null,
      });
      if (r?.erro) setErro(r.erro);
    });
  }

  return (
    <div className="space-y-6">
      {/* Nome */}
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-stone-500">
          nome
        </Label>
        <Input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          maxLength={60}
          className="bg-offwhite"
        />
      </div>

      {/* Ícone */}
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-stone-500">
          ícone
        </Label>
        <div className="grid grid-cols-8 gap-2">
          {ICONES.map((ic) => (
            <button
              key={ic}
              type="button"
              onClick={() => setIcone(ic)}
              className={`bg-offwhite rounded-lg p-2 text-xl transition-all ${
                icone === ic
                  ? "border-2 border-costela scale-110"
                  : "border border-stone-200 hover:border-stone-400"
              }`}
            >
              {ic}
            </button>
          ))}
        </div>
      </div>

      {/* Frequência */}
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-stone-500">
          frequência
        </Label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={frequencia === "daily"}
              onChange={() => setFrequencia("daily")}
              className="accent-costela w-4 h-4"
            />
            <span className="text-sm">todo dia</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={frequencia === "custom"}
              onChange={() => setFrequencia("custom")}
              className="accent-costela w-4 h-4"
            />
            <span className="text-sm">dias da semana</span>
          </label>
        </div>
        {frequencia === "custom" && (
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {DIAS_LABELS.map((label, idx) => (
              <button
                key={label}
                type="button"
                onClick={() => toggleDia(idx)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                  diasSemana.includes(idx)
                    ? "bg-costela text-white"
                    : "bg-stone-200 text-stone-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Espécie */}
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-stone-500">
          espécie da planta
        </Label>
        <SeletorEspecie
          especieAtual={especie}
          especiesDesbloqueadas={especiesDesbloqueadas}
          onSelecionar={setEspecie}
        />
        <p className="text-xs text-stone-500 italic">
          desbloqueia novas espécies em /conquistas
        </p>
      </div>

      {/* Lembrete */}
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-stone-500">
          lembrete (opcional)
        </Label>
        <div className="bg-offwhite rounded-xl p-3 flex items-center gap-3 border border-stone-200">
          <span className="text-lg">⏰</span>
          <input
            type="time"
            value={lembrete}
            onChange={(e) => setLembrete(e.target.value)}
            className="bg-transparent border-none focus:outline-none flex-1 text-base"
          />
          {lembrete && (
            <button
              type="button"
              onClick={() => setLembrete("")}
              className="text-xs text-stone-500 hover:text-costela"
            >
              limpar
            </button>
          )}
        </div>
      </div>

      {erro && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          {erro}
        </p>
      )}

      <Button
        onClick={salvar}
        disabled={isPending}
        className="w-full bg-costela hover:bg-costela/90 text-white rounded-full py-6 font-medium"
      >
        {isPending ? "salvando..." : "salvar mudanças"}
      </Button>
    </div>
  );
}
