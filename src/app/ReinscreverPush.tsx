"use client";

import { useEffect } from "react";

/**
 * Reinscreve o aparelho no push toda vez que o app abre, em silêncio.
 *
 * POR QUE ISTO EXISTE — foi o motivo de as mensagens pararem de chegar.
 *
 * A inscrição de push NÃO é para sempre. O Chrome e o Android trocam o
 * endereço dela sozinhos: numa atualização do navegador, numa limpeza de
 * dados, quando o aparelho fica muito tempo sem abrir o app. Quando isso
 * acontece, o endereço velho passa a responder 410 e a rota de disparo o
 * APAGA — e ela faz certo, senão ficaria tentando um endereço morto para
 * sempre.
 *
 * O buraco era o outro lado: ninguém reinscrevia. A inscrição só nascia
 * quando a pessoa apertava "Ativar as mensagens", uma vez na vida. Apagada
 * ela, o push morria calado — a permissão continuava concedida no celular, o
 * app continuava dizendo que estava tudo certo, e nada mais chegava. Em
 * 5 de outubro de 2026 o banco tinha 11 pessoas com horários marcados e
 * ZERO inscrições: todas tinham sido apagadas por 410.
 *
 * Agora, toda abertura do app confere. Se a permissão já está concedida,
 * reinscreve e manda para o servidor. Não pede nada, não mostra nada, não
 * incomoda quem nunca ativou — `Notification.permission` só vale "granted"
 * para quem já disse sim um dia.
 */
export default function ReinscreverPush() {
  useEffect(() => {
    /*
     * Só para quem JÁ autorizou. "default" é quem nunca escolheu e "denied"
     * é quem disse não — pedir de novo a qualquer um dos dois seria exatamente
     * o pop-up que o app não quer dar.
     */
    if (
      typeof Notification === "undefined" ||
      Notification.permission !== "granted" ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window)
    ) {
      return;
    }

    const chave = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!chave) return;

    let cancelado = false;

    (async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        await navigator.serviceWorker.ready;
        if (cancelado) return;

        /*
         * `getSubscription` devolve a que existe, ou null se o navegador
         * jogou fora. Nos dois casos o certo é mandar para o servidor: pode
         * ser que ela exista no aparelho e tenha sido apagada no banco pelo
         * 410 de um endereço anterior.
         */
        const inscricao =
          (await reg.pushManager.getSubscription()) ??
          (await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: paraUint8(chave),
          }));

        if (cancelado) return;

        await fetch("/api/push/inscrever", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inscricao.toJSON()),
        });
      } catch {
        /*
         * Silêncio de propósito. Isto roda na abertura de TODA página; um
         * aviso de erro aqui apareceria para quem só queria ler o versículo
         * do dia, por causa de algo que ela não pediu e não pode resolver.
         */
      }
    })();

    return () => {
      cancelado = true;
    };
  }, []);

  return null;
}

/** Converte a chave VAPID (base64url) no formato que o navegador exige. */
function paraUint8(base64: string) {
  const preenchido = (base64 + "=".repeat((4 - (base64.length % 4)) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const bruto = atob(preenchido);
  return Uint8Array.from([...bruto].map((c) => c.charCodeAt(0)));
}
