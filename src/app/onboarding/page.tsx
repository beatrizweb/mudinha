"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { criarHabitoNoOnboarding } from "./actions";

const HABITOS_SUGERIDOS = [
  { icon: "💧", nome: "beber 2L de água" },
  { icon: "📖", nome: "ler 10 min" },
  { icon: "🏋️", nome: "treinar" },
  { icon: "🧘", nome: "meditar 5 min" },
  { icon: "😴", nome: "dormir cedo" },
  { icon: "✏️", nome: "estudar" },
];

const DIAS_LABELS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

export default function OnboardingPage() {
  const router = useRouter();
  const [passo, setPasso] = useState(1);

  // Dados do hábito sendo construído
  const [nome, setNome] = useState("");
  const [icone, setIcone] = useState("🌱");
  const [frequencia, setFrequencia] = useState<"daily" | "custom">("daily");
  const [diasSemana, setDiasSemana] = useState<number[]>([1, 2, 3, 4, 5]);
  const [lembrete, setLembrete] = useState("");

  const [erro, setErro] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function escolherSugestao(s: (typeof HABITOS_SUGERIDOS)[number]) {
    setNome(s.nome);
    setIcone(s.icon);
    setPasso(3);
  }

  function continuarComCustom() {
    if (!nome.trim()) {
      setErro("Escreve o nome do seu hábito.");
      return;
    }
    setIcone("🌱");
    setErro(null);
    setPasso(3);
  }

  function toggleDia(d: number) {
    setDiasSemana((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  }

  function finalizar() {
    if (frequencia === "custom" && diasSemana.length === 0) {
      setErro("Escolhe pelo menos 1 dia da semana.");
      return;
    }
    setErro(null);

    startTransition(async () => {
      const r = await criarHabitoNoOnboarding({
        name: nome,
        icon: icone,
        frequency: frequencia,
        days_of_week:
          frequencia === "custom" ? diasSemana : [0, 1, 2, 3, 4, 5, 6],
        reminder_time: lembrete || null,
      });
      if (r?.erro) {
        setErro(r.erro);
      } else {
        setPasso(4);
      }
    });
  }

  return (
    <main className="flex flex-col flex-1 bg-areia px-6 py-8 max-w-md mx-auto w-full">
      {/* Progresso */}
      <div className="flex justify-center gap-2 mb-10 mt-3">
        {[1, 2, 3, 4].map((p) => (
          <motion.div
            key={p}
            initial={false}
            animate={{
              backgroundColor: p <= passo ? "#2D5F3F" : "#E7E5E4",
              scale: p === passo ? 1.15 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="w-8 h-1.5 rounded-full"
          />
        ))}
      </div>

      <AnimatePresence mode="wait">

      {/* Passo 1: Boas-vindas */}
      {passo === 1 && (
        <motion.div
          key="passo1"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-center flex-1 flex flex-col"
        >
          <h1 className="font-serif text-4xl text-costela mb-6">
            oi! eu sou a Mudinha. 🌿
          </h1>
          <p className="text-stone-700 leading-relaxed mb-10">
            vou te ajudar a manter seus hábitos sem você se cobrar tanto.
          </p>

          <div className="bg-brote/20 rounded-3xl p-16 mb-12 text-8xl flex-1 flex items-center justify-center">
            🌿
          </div>

          <Button
            onClick={() => setPasso(2)}
            className="w-full bg-costela hover:bg-costela/90 text-white rounded-full py-6 font-medium"
          >
            bora plantar
          </Button>
          <button
            onClick={() => router.push("/jardim")}
            className="text-sm text-stone-500 mt-4"
          >
            pular
          </button>
        </motion.div>
      )}

      {/* Passo 2: Escolher hábito */}
      {passo === 2 && (
        <motion.div
          key="passo2"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <h2 className="font-serif text-2xl text-costela mb-8 text-center">
            qual hábito você quer começar a regar?
          </h2>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {HABITOS_SUGERIDOS.map((s) => (
              <button
                key={s.nome}
                onClick={() => escolherSugestao(s)}
                className="bg-offwhite rounded-2xl p-4 text-center border border-stone-200 hover:border-costela transition-colors"
              >
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-xs">{s.nome}</div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-4">
            <hr className="flex-1 border-stone-300" />
            <span className="text-xs text-stone-500 whitespace-nowrap">
              ou crie o seu
            </span>
            <hr className="flex-1 border-stone-300" />
          </div>

          <Input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="escrever meu hábito"
            maxLength={60}
            className="bg-offwhite mb-6"
          />

          {erro && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              {erro}
            </p>
          )}

          <Button
            onClick={continuarComCustom}
            disabled={!nome.trim()}
            className="w-full bg-costela hover:bg-costela/90 text-white rounded-full py-6 font-medium"
          >
            continuar
          </Button>

          <button
            onClick={() => setPasso(1)}
            className="text-sm text-stone-500 mt-4 block mx-auto"
          >
            voltar
          </button>
        </motion.div>
      )}

      {/* Passo 3: Frequência + lembrete */}
      {passo === 3 && (
        <motion.div
          key="passo3"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <h2 className="font-serif text-2xl text-costela mb-2 text-center">
            {icone} {nome}
          </h2>
          <p className="text-stone-600 text-center mb-8 text-sm">
            quando você quer regar?
          </p>

          <Label className="text-xs uppercase tracking-wider text-stone-500 block mb-3">
            frequência
          </Label>
          <div className="space-y-2 mb-6">
            <label className="flex items-center gap-2 cursor-pointer p-3 bg-offwhite rounded-xl border border-stone-200">
              <input
                type="radio"
                checked={frequencia === "daily"}
                onChange={() => setFrequencia("daily")}
                className="accent-costela w-4 h-4"
              />
              <span className="text-sm">todo dia</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-3 bg-offwhite rounded-xl border border-stone-200">
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
            <div className="flex gap-1.5 mb-6 flex-wrap justify-center">
              {DIAS_LABELS.map((label, idx) => (
                <button
                  key={label}
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

          <Label className="text-xs uppercase tracking-wider text-stone-500 block mb-2">
            lembrete? (opcional)
          </Label>
          <div className="bg-offwhite rounded-xl p-3 flex items-center gap-3 mb-8 border border-stone-200">
            <span className="text-lg">⏰</span>
            <input
              type="time"
              value={lembrete}
              onChange={(e) => setLembrete(e.target.value)}
              className="bg-transparent border-none focus:outline-none flex-1 text-base"
            />
          </div>

          {erro && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              {erro}
            </p>
          )}

          <Button
            onClick={finalizar}
            disabled={isPending}
            className="w-full bg-costela hover:bg-costela/90 text-white rounded-full py-6 font-medium"
          >
            {isPending ? "plantando..." : "plantar 🌱"}
          </Button>

          <button
            onClick={() => setPasso(2)}
            className="text-sm text-stone-500 mt-4 block mx-auto"
          >
            voltar
          </button>
        </motion.div>
      )}

      {/* Passo 4: Sucesso */}
      {passo === 4 && (
        <motion.div
          key="passo4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 18 }}
          className="text-center flex-1 flex flex-col"
        >
          <h1 className="font-serif text-5xl text-costela mb-6">plantado! 🌱</h1>
          <p className="text-stone-700 mb-2 text-lg">
            sua primeira mudinha tá no seu jardim.
          </p>
          <p className="text-stone-600 mb-12">
            volta aqui amanhã pra regar. eu te lembro.
          </p>

          <div className="bg-brote/20 rounded-3xl p-16 mb-12 text-7xl flex-1 flex items-center justify-center">
            🌱💧
          </div>

          <Button
            onClick={() => router.push("/jardim")}
            className="w-full bg-costela hover:bg-costela/90 text-white rounded-full py-6 font-medium"
          >
            ver meu jardim
          </Button>
        </motion.div>
      )}

      </AnimatePresence>
    </main>
  );
}
