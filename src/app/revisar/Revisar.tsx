"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Voltar from "../Voltar";

type Erro = {
  id: number;
  enunciado: string;
  alternativas: string[];
  correta: number;
  explicacao: string;
  versiculo: string;
  nivel: string;
};

export default function Revisar() {
  const [erros, setErros] = useState<Erro[] | null>(null);
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const r = await fetch("/api/quiz/erros");
        if (!r.ok) throw new Error();
        const d = await r.json();
        if (ativo) setErros(Array.isArray(d.erros) ? d.erros : []);
      } catch {
        if (ativo) {
          setErros(null);
          setFalhou(true);
        }
      }
    })();
    return () => {
      ativo = false;
    };
  }, []);

  return (
    <main>
      <Voltar />
      <h1>O que você errou</h1>
      <p className="referencia">Errar é como se aprende</p>

      {falhou ? (
        <p style={{ marginTop: "1.5rem" }}>
          Não deu para carregar agora. Tente recarregar daqui a pouco.
        </p>
      ) : erros === null ? (
        <p style={{ marginTop: "1.5rem" }}>Carregando…</p>
      ) : erros.length === 0 ? (
        <p style={{ marginTop: "1.5rem" }}>
          Você ainda não errou nenhuma — ou ainda não começou.{" "}
          <Link href="/quiz">Ir para o quiz.</Link>
        </p>
      ) : (
        <>
          <p style={{ marginTop: "1.25rem" }}>
            {erros.length === 1
              ? "Uma pergunta para revisar."
              : `${erros.length} perguntas para revisar.`}{" "}
            Elas não voltam no quiz, mas a explicação continua valendo.
          </p>

          <ul className="revisao">
            {erros.map((e) => (
              <li key={e.id}>
                <p className="revisao-enunciado">{e.enunciado}</p>
                <p className="revisao-certa">
                  <span className="revisao-marca" aria-hidden="true">
                    ✓
                  </span>
                  {e.alternativas[e.correta]}
                </p>
                <p className="revisao-explicacao">{e.explicacao}</p>
                <p className="referencia">{e.versiculo}</p>
              </li>
            ))}
          </ul>
        </>
      )}

      <p style={{ marginTop: "2rem" }}>
        <Link href="/quiz" className="botao">
          Responder mais perguntas
        </Link>
      </p>
    </main>
  );
}
