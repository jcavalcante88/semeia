"use client";

import { useEffect, useState } from "react";

/**
 * Card de compartilhamento na página inicial.
 *
 * Antes ele só existia no fim de uma rodada — ou seja, atrás de dezenas de perguntas
 * respondidas. Sendo a peça que traz gente nova pelo Instagram, estar
 * enterrada era o pior lugar possível. Aqui ele fica a um toque, com o
 * placar acumulado da pessoa.
 *
 * Só aparece para quem já respondeu alguma coisa: um card "0 de 0" não
 * convida ninguém.
 */
export default function CompartilharPlacar() {
  const [dados, setDados] = useState<{ acertos: number; total: number } | null>(null);
  const [nome, setNome] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [recado, setRecado] = useState("");

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const [rp, ru] = await Promise.all([fetch("/api/placar"), fetch("/api/usuario")]);
        if (!rp.ok) return;
        const p = await rp.json();
        const u = ru.ok ? await ru.json() : null;
        if (!ativo) return;
        setDados({ acertos: Number(p.acertos) || 0, total: Number(p.total) || 0 });
        setNome(u?.usuario?.apelido ?? "");
      } catch {
        // sem placar, o bloco simplesmente não aparece
      }
    })();
    return () => {
      ativo = false;
    };
  }, []);

  if (!dados || dados.total === 0) return null;

  const cardUrl = `/api/og/resultado?a=${dados.acertos}&t=${dados.total}&n=${encodeURIComponent(nome)}`;
  const texto = `Acertei ${dados.acertos} de ${dados.total} no quiz bíblico do Semeia. Tenta bater: `;

  async function compartilhar() {
    const url = window.location.origin + "/quiz";
    setOcupado(true);
    setRecado("");
    try {
      let arquivo: File | null = null;
      try {
        const r = await fetch(cardUrl);
        if (r.ok) arquivo = new File([await r.blob()], "semeia.png", { type: "image/png" });
      } catch {
        arquivo = null;
      }

      // canShare({files}) é a única forma honesta de perguntar se o aparelho
      // aceita imagem: quase todo celular sim, quase todo computador não.
      if (arquivo && navigator.canShare?.({ files: [arquivo] })) {
        await navigator.share({ files: [arquivo], text: texto + url });
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: "Semeia", text: texto, url });
        return;
      }
      await navigator.clipboard.writeText(texto + url);
      setRecado("Link copiado.");
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      setRecado("Não deu para compartilhar agora.");
    } finally {
      setOcupado(false);
    }
  }

  async function salvar() {
    setRecado("");
    try {
      const r = await fetch(cardUrl);
      if (!r.ok) throw new Error();
      const href = URL.createObjectURL(await r.blob());
      const a = document.createElement("a");
      a.href = href;
      a.download = "semeia.png";
      a.click();
      URL.revokeObjectURL(href);
    } catch {
      setRecado("Não deu para gerar a imagem agora.");
    }
  }

  return (
    <>
      <h2>Seu resultado</h2>
      <p>
        Você acertou {dados.acertos} de {dados.total}. Manda para alguém — é
        assim que a maioria das pessoas chega aqui.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="card-resultado"
        src={cardUrl}
        alt={`Você acertou ${dados.acertos} de ${dados.total}`}
      />

      <button className="botao" onClick={compartilhar} disabled={ocupado}>
        {ocupado ? "Preparando…" : "Compartilhar meu resultado"}
      </button>

      <p style={{ marginTop: "0.6rem" }}>
        <button className="botao botao-vazado" onClick={salvar}>
          Salvar imagem para o story
        </button>
      </p>

      {recado && (
        <p className="referencia" style={{ marginTop: "0.75rem" }}>
          {recado}
        </p>
      )}
    </>
  );
}
