"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * A barra de busca da tela inicial.
 *
 * Só leva para `/buscar?q=` — quem procura de verdade é a página de
 * resultados, que é componente de servidor e consulta o banco direto. Assim
 * não há `fetch` no navegador, não há tela piscando, e o resultado já vem
 * pronto no HTML.
 */
export default function Busca() {
  const router = useRouter();
  const [termo, setTermo] = useState("");

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    const q = termo.trim();
    if (!q) return;
    router.push(`/buscar?q=${encodeURIComponent(q)}`);
  }

  return (
    <form className="busca" onSubmit={buscar} role="search">
      <input
        className="busca-campo"
        type="search"
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        placeholder="Procure uma passagem, parábola ou lugar"
        aria-label="Procurar na Bíblia"
        /* enterkeyhint muda a tecla do teclado do celular de "ir" para
           "buscar" — detalhe pequeno que faz a barra parecer nativa. */
        enterKeyHint="search"
      />
      <button className="busca-botao" type="submit" aria-label="Buscar">
        <span aria-hidden="true">⌕</span>
      </button>
    </form>
  );
}
