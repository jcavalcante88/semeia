"use client";

import { useState } from "react";

/**
 * Manda a palavra de hoje para alguém.
 *
 * O app já compartilhava o PLACAR, que fala de quem compartilha. Este botão
 * compartilha o versículo, que fala de quem recebe — e é o que uma pessoa
 * realmente manda para a mãe ou para um amigo que está passando por algo.
 *
 * É também a porta de entrada mais honesta que o app tem: quem recebe chega
 * por um versículo que alguém escolheu mandar, não por propaganda de
 * aplicativo.
 */
export default function CompartilharVersiculo({
  texto,
  referencia,
  versao,
}: {
  texto: string;
  referencia: string;
  versao: string;
}) {
  const [recado, setRecado] = useState("");
  const [ocupado, setOcupado] = useState(false);

  async function compartilhar() {
    setOcupado(true);
    setRecado("");

    // O link vai para a home, e não para o quiz: quem recebe um versículo
    // quer ler o versículo, não cair numa pergunta.
    const url = window.location.origin;
    const mensagem = `"${texto}"\n\n${referencia} · ${versao}\n\n`;

    try {
      if (navigator.share) {
        await navigator.share({ title: "Semeia", text: mensagem, url });
        return;
      }

      // Sem `navigator.share` — quase todo computador — o WhatsApp Web abre
      // com a mensagem pronta e a pessoa só escolhe para quem manda.
      const wa = `https://wa.me/?text=${encodeURIComponent(mensagem + url)}`;
      const janela = window.open(wa, "_blank", "noopener,noreferrer");
      if (janela) return;

      // Bloqueador de pop-up: a área de transferência é o último recurso,
      // e melhor do que um botão que não faz nada.
      await navigator.clipboard.writeText(mensagem + url);
      setRecado("Versículo copiado. É só colar na conversa.");
    } catch (e) {
      // Fechar a folha de compartilhamento não é erro: não merece recado.
      if (e instanceof DOMException && e.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(mensagem + url);
        setRecado("Versículo copiado. É só colar na conversa.");
      } catch {
        setRecado("Não deu para compartilhar agora.");
      }
    } finally {
      setOcupado(false);
    }
  }

  return (
    <>
      <button className="palavra-enviar" onClick={compartilhar} disabled={ocupado}>
        <span aria-hidden="true">↗</span>
        {ocupado ? "Preparando…" : "Mandar para alguém"}
      </button>
      {recado && (
        <p className="palavra-recado referencia">{recado}</p>
      )}
    </>
  );
}
