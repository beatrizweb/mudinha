"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { criarHabito } from "./actions";

const ICONES = [
  "🌱", "💧", "📖", "🏋️", "🧘", "😴", "✏️", "💼",
  "🍎", "☕", "🎨", "🎵", "🏃", "✨", "💊", "📞",
];

export default function NovoHabitoPage() {
  const [iconeEscolhido, setIconeEscolhido] = useState("🌱");
  const [frequencia, setFrequencia] = useState<"daily" | "custom">("daily");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(formData: FormData) {
    setCarregando(true);
    setErro(null);
    formData.set("icon", iconeEscolhido);
    const resultado = await criarHabito(formData);
    if (resultado?.erro) {
      setErro(resultado.erro);
      setCarregando(false);
    }
  }

  return (
    <main className="flex flex-col flex-1 bg-areia px-6 py-8 max-w-md mx-auto w-full">
      <Link href="/jardim" className="text-costela text-sm mb-6">
        ← plantar novo hábito
      </Link>

      <form action={handleSubmit} className="space-y-6">
        {/* Nome */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs uppercase tracking-wider text-stone-500">
            Como vai chamar?
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="ex: beber 2L de água"
            required
            maxLength={60}
            className="bg-offwhite"
          />
        </div>

        {/* Ícone */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-stone-500">
            Escolhe um ícone
          </Label>
          <div className="grid grid-cols-8 gap-2">
            {ICONES.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setIconeEscolhido(icon)}
                className={`bg-offwhite rounded-lg p-2 text-xl transition-all ${
                  iconeEscolhido === icon
                    ? "border-2 border-costela scale-110"
                    : "border border-stone-200 hover:border-stone-400"
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Frequência */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-stone-500">
            Qual frequência?
          </Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="frequency"
                value="daily"
                checked={frequencia === "daily"}
                onChange={() => setFrequencia("daily")}
                className="accent-costela w-4 h-4"
              />
              <span className="text-sm">todo dia</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="frequency"
                value="custom"
                checked={frequencia === "custom"}
                onChange={() => setFrequencia("custom")}
                className="accent-costela w-4 h-4"
              />
              <span className="text-sm">dias da semana</span>
            </label>
          </div>

          {frequencia === "custom" && (
            <div className="flex gap-1.5 mt-3 flex-wrap">
              {["dom", "seg", "ter", "qua", "qui", "sex", "sáb"].map(
                (dia, idx) => (
                  <label key={dia} className="cursor-pointer">
                    <input
                      type="checkbox"
                      name={`day_${idx}`}
                      defaultChecked={idx >= 1 && idx <= 5}
                      className="peer sr-only"
                    />
                    <span className="bg-stone-200 text-stone-500 text-xs px-3 py-1.5 rounded-full peer-checked:bg-costela peer-checked:text-white transition-colors">
                      {dia}
                    </span>
                  </label>
                )
              )}
            </div>
          )}
        </div>

        {/* Lembrete */}
        <div className="space-y-2">
          <Label htmlFor="reminder_time" className="text-xs uppercase tracking-wider text-stone-500">
            Lembrete? (opcional)
          </Label>
          <div className="bg-offwhite rounded-xl p-3 flex items-center gap-3 border border-stone-200">
            <span className="text-lg">⏰</span>
            <input
              id="reminder_time"
              name="reminder_time"
              type="time"
              className="bg-transparent border-none focus:outline-none flex-1 text-base"
            />
          </div>
        </div>

        {erro && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
            {erro}
          </p>
        )}

        <Button
          type="submit"
          disabled={carregando}
          className="w-full bg-costela hover:bg-costela/90 text-white rounded-full py-6 font-medium"
        >
          {carregando ? "plantando..." : "plantar 🌱"}
        </Button>
      </form>
    </main>
  );
}
