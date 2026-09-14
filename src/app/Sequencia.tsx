"use client";

import { useEffect, useState } from "react";

/**
 * Faixa de sequência: "3 dias seguidos".
 *
 * Regra de tom, e ela é deliberada: **nada de castigo**. Quando a sequência
 * quebra, a faixa simplesmente desaparece — sem "você perdeu seus 12 dias",
 * sem chama apagando, sem cobrança. O Semeia é um convite; culpa por não ter
 * aberto o app ontem é o oposto disso.
 *
 * Por isso também não aparece com 1 dia: "1 dia seguido" não é conquista
 * nenhuma, é só ruído na tela de quem acabou de chegar.
 */
export default function Sequencia() {
  const [dias, setDias] = useState(0);
  const [hoje, setHoje] = useState(false);

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const r = await fetch("/api/sequencia");
        if (!r.ok) return;
        const d = await r.json();
        if (!ativo) return;
        setDias(Number(d.sequencia) || 0);
        setHoje(Boolean(d.hoje));
      } catch {
        // enfeite: falhou, não mostra nada
      }
    })();
    return () => {
      ativo = false;
    };
  }, []);

  if (dias < 2) return null;

  return (
    <p className="sequencia">
      <span className="sequencia-numero">{dias}</span>
      <span>
        dias seguidos
        {!hoje && " — responda uma pergunta para manter"}
      </span>
    </p>
  );
}
