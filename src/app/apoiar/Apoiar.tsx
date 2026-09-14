"use client";

import { useState } from "react";
import Link from "next/link";
import Voltar from "../Voltar";

export default function Apoiar({
  codigo,
  chave,
  nome,
}: {
  codigo: string;
  chave: string;
  nome: string;
}) {
  const [copiado, setCopiado] = useState<"codigo" | "chave" | null>(null);

  async function copiar(texto: string, qual: "codigo" | "chave") {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(qual);
      setTimeout(() => setCopiado(null), 2500);
    } catch {
      // Em navegador que bloqueia a área de transferência, o texto continua
      // visível na tela para seleção manual — por isso ele nunca fica escondido.
      setCopiado(null);
    }
  }

  return (
    <main>
      <Voltar />
      <h1>Apoiar o Semeia</h1>
      <p className="referencia">Se puder e quiser. Nada aqui é pago.</p>

      <p style={{ marginTop: "1.25rem" }}>
        O Semeia é gratuito e vai continuar sendo. Não tem anúncio, não vende
        dado de ninguém e não guarda seu e-mail — você nem precisou dar um.
      </p>
      <p>
        Hoje ele roda em serviços de plano gratuito, e o que custa dinheiro é
        pouco: o domínio e a conta da Play Store. Qualquer valor ajuda a manter
        isso de pé e a construir as próximas ferramentas de evangelização.
      </p>

      <h2>Pix de qualquer valor</h2>
      <p>
        Copie o código abaixo e cole no app do seu banco, em <em>Pix copia e
        cola</em>. Você escolhe quanto.
      </p>

      <div className="pix-caixa">
        <code className="pix-codigo">{codigo}</code>
        <button className="botao" onClick={() => copiar(codigo, "codigo")}>
          {copiado === "codigo" ? "Código copiado" : "Copiar código Pix"}
        </button>
      </div>

      <p style={{ marginTop: "1.25rem" }}>
        Se preferir, use a chave direto:
      </p>
      <div className="pix-caixa">
        <code className="pix-chave">{chave}</code>
        <button className="botao botao-vazado" onClick={() => copiar(chave, "chave")}>
          {copiado === "chave" ? "Chave copiada" : "Copiar a chave"}
        </button>
      </div>

      <h2>Para onde vai</h2>
      <p>
        O Pix cai na conta de <strong>{nome}</strong>, que é quem faz o Semeia.
        Não há empresa, CNPJ nem intermediário no meio — e por isso também não
        há recibo nem dedução de imposto. É uma doação entre pessoas.
      </p>
      <p>
        Se você está passando aperto, não doe. Prefiro que você use o app,
        responda o quiz e mande para alguém — isso ajuda mais.
      </p>

      <p style={{ marginTop: "2rem" }}>
        <Link href="/quiz" className="botao botao-vazado">
          Voltar para o quiz
        </Link>
      </p>

      <footer className="rodape">
        Confira sempre o nome do recebedor na tela do seu banco antes de
        confirmar qualquer Pix, aqui ou em qualquer outro lugar.
      </footer>
    </main>
  );
}
