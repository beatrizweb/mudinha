"use client";

import { useEffect, useState } from "react";
import { salvarSubscription, removerSubscription } from "@/app/perfil/push-actions";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; i++) view[i] = rawData.charCodeAt(i);
  return buffer;
}

type Estado =
  | { tipo: "carregando" }
  | { tipo: "nao-suportado" }
  | { tipo: "desativado" }
  | { tipo: "ativado"; endpoint: string }
  | { tipo: "negado" };

export function ToggleNotificacoes() {
  const [estado, setEstado] = useState<Estado>({ tipo: "carregando" });
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setEstado({ tipo: "nao-suportado" });
      return;
    }
    if (Notification.permission === "denied") {
      setEstado({ tipo: "negado" });
      return;
    }

    (async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          setEstado({ tipo: "ativado", endpoint: sub.endpoint });
        } else {
          setEstado({ tipo: "desativado" });
        }
      } catch (e) {
        console.error("erro ao registrar SW", e);
        setEstado({ tipo: "nao-suportado" });
      }
    })();
  }, []);

  async function ativar() {
    setProcessando(true);
    try {
      const permissao = await Notification.requestPermission();
      if (permissao !== "granted") {
        setEstado({ tipo: "negado" });
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const json = sub.toJSON();
      const r = await salvarSubscription({
        endpoint: json.endpoint!,
        keys: {
          p256dh: json.keys!.p256dh,
          auth: json.keys!.auth,
        },
      });

      if (r.ok) {
        setEstado({ tipo: "ativado", endpoint: json.endpoint! });
      } else {
        alert("Erro ao salvar: " + r.error);
      }
    } catch (e) {
      console.error(e);
      alert("Não consegui ativar as notificações.");
    } finally {
      setProcessando(false);
    }
  }

  async function desativar() {
    setProcessando(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await removerSubscription(sub.endpoint);
        await sub.unsubscribe();
      }
      setEstado({ tipo: "desativado" });
    } catch (e) {
      console.error(e);
    } finally {
      setProcessando(false);
    }
  }

  if (estado.tipo === "carregando") {
    return (
      <div className="flex justify-between items-center opacity-50">
        <span className="text-sm">🔔 notificações</span>
        <span className="text-xs italic text-stone-500">carregando…</span>
      </div>
    );
  }

  if (estado.tipo === "nao-suportado") {
    return (
      <div className="flex justify-between items-center opacity-50">
        <span className="text-sm">🔔 notificações</span>
        <span className="text-xs italic text-stone-500">
          não disponível nesse navegador
        </span>
      </div>
    );
  }

  if (estado.tipo === "negado") {
    return (
      <div className="flex justify-between items-center opacity-70">
        <span className="text-sm">🔔 notificações</span>
        <span className="text-xs italic text-stone-500">
          bloqueado nas configurações
        </span>
      </div>
    );
  }

  const ativado = estado.tipo === "ativado";

  return (
    <div className="flex justify-between items-center">
      <span className="text-sm">🔔 notificações</span>
      <button
        onClick={ativado ? desativar : ativar}
        disabled={processando}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${ativado ? "bg-costela" : "bg-stone-300"}
          ${processando ? "opacity-50 cursor-wait" : "cursor-pointer"}
        `}
        aria-label={ativado ? "desativar" : "ativar"}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${ativado ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </button>
    </div>
  );
}
