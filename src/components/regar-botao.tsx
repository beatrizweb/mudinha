"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { regar } from "@/app/jardim/actions";

export function RegarBotao({ habitId }: { habitId: string }) {
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  function handle() {
    setErro(null);
    startTransition(async () => {
      const r = await regar(habitId);
      if (r?.erro) setErro(r.erro);
    });
  }

  return (
    <>
      <Button
        onClick={handle}
        disabled={isPending}
        className="w-full bg-costela hover:bg-costela/90 text-white rounded-full py-6 font-medium"
      >
        {isPending ? "regando..." : "regar hoje 💧"}
      </Button>
      {erro && (
        <p className="text-xs text-red-700 mt-2 text-center">{erro}</p>
      )}
    </>
  );
}
