"use client";

import { useState } from "react";

const HORARIOS = ["07:00", "12:00", "20:00"];

/** Converte a chave VAPID (base64url) no formato que o navegador exige. */
function paraUint8(base64: string) {
  const preenchido = (base64 + "=".repeat((4 - (base64.length % 4)) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const bruto = atob(preenchido);
  return Uint8Array.from([...bruto].map((c) => c.charCodeAt(0)));
}

export default function AtivarMensagens() {
  const [estado, setEstado] = useState<"parado" | "indo" | "pronto" | "erro">("parado");
  const [recado, setRecado] = useState("");

  async function ativar() {
    setEstado("indo");
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setRecado(
          "Este navegador não recebe mensagens. No iPhone, toque em Compartilhar e depois em Adicionar à Tela de Início — daí funciona.",
        );
        return setEstado("erro");
      }

      const permissao = await Notification.requestPermission();
      if (permissao !== "granted") {
        setRecado("Você pode liberar as mensagens depois, nas configurações do navegador.");
        return setEstado("erro");
      }

      const reg = await navigator.serviceWorker.register("/sw.js");
      const inscricao = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: paraUint8(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      });

      const r = await fetch("/api/push/inscrever", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...inscricao.toJSON(), horarios: HORARIOS }),
      });

      // Sem esta conferencia, um 401 passava batido e o app prometia mensagens
      // que nunca chegariam: a inscricao nao tinha sido gravada em lugar nenhum.
      if (!r.ok) {
        const d = await r.json().catch(() => null);
        await inscricao.unsubscribe().catch(() => {});
        setRecado(
          d?.erro === "Sem perfil."
            ? "Escolha um nome no quiz antes de ativar as mensagens."
            : "Não deu para salvar sua inscrição. Tente de novo mais tarde.",
        );
        return setEstado("erro");
      }

      setEstado("pronto");
    } catch {
      setRecado("Não deu para ativar agora. Tente de novo mais tarde.");
      setEstado("erro");
    }
  }

  if (estado === "pronto") {
    return (
      <p style={{ marginTop: "1.5rem" }} className="referencia">
        Pronto. Você recebe um versículo às 7h, ao meio-dia e às 20h.
      </p>
    );
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Um versículo três vezes ao dia</h2>
      <p>Manhã, meio-dia e noite. Dá para desligar quando quiser.</p>
      <button className="botao botao-vazado" onClick={ativar} disabled={estado === "indo"}>
        {estado === "indo" ? "Ativando…" : "Ativar as mensagens"}
      </button>
      {recado && (
        <p className="referencia" style={{ marginTop: "0.75rem" }}>
          {recado}
        </p>
      )}
    </div>
  );
}
