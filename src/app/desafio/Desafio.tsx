"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Voltar from "../Voltar";
import AtivarMensagens from "../quiz/AtivarMensagens";

type Pergunta = {
  id: number;
  enunciado: string;
  alternativas: string[];
  nivel: string;
};

type Respondida = { perguntaId: number; acertou: boolean };

type Dados = {
  dia: string;
  perguntas: Pergunta[];
  respondidas: Respondida[];
  sequencia: number;
  media: number | null;
  participantes: number;
};

type Resultado = {
  certo: boolean;
  correta: number;
  explicacao: string;
  versiculo: string;
};

/** "2026-09-23" -> "terça-feira, 23 de setembro". */
function porExtenso(dia: string) {
  const [a, m, d] = dia.split("-").map(Number);
  return new Date(a, m - 1, d).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function Desafio() {
  const [dados, setDados] = useState<Dados | null>(null);
  const [erro, setErro] = useState("");
  const [atual, setAtual] = useState(0);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [enviando, setEnviando] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const r = await fetch("/api/desafio");
      const d = await r.json().catch(() => null);
      if (!r.ok) {
        setErro(d?.erro ?? "Não deu para carregar o desafio de hoje.");
        return;
      }
      setDados(d);
      // Quem já respondeu algumas hoje volta na primeira que falta, não no
      // começo: recarregar a página não pode custar o que já foi feito.
      const feitas = new Set(d.respondidas.map((x: Respondida) => x.perguntaId));
      const proxima = d.perguntas.findIndex((p: Pergunta) => !feitas.has(p.id));
      setAtual(proxima === -1 ? d.perguntas.length : proxima);
    } catch {
      setErro("Não deu para carregar. Verifique sua conexão.");
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function responder(i: number) {
    if (!dados || resultado || enviando) return;
    setEscolha(i);
    setEnviando(true);
    setErro("");
    try {
      const r = await fetch("/api/desafio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ perguntaId: dados.perguntas[atual].id, escolha: i }),
      });
      const d = await r.json().catch(() => null);
      if (!r.ok) {
        setErro(d?.erro ?? "Não deu para registrar a resposta.");
        setEscolha(null);
        return;
      }
      setResultado(d);
      setDados((antes) =>
        antes
          ? {
              ...antes,
              respondidas: [
                ...antes.respondidas,
                { perguntaId: antes.perguntas[atual].id, acertou: d.certo },
              ],
            }
          : antes,
      );
    } catch {
      setErro("Não deu para enviar. Verifique sua conexão.");
      setEscolha(null);
    } finally {
      setEnviando(false);
    }
  }

  function proxima() {
    setResultado(null);
    setEscolha(null);
    setAtual((n) => n + 1);
  }

  if (erro && !dados) {
    return (
      <main>
        <Voltar />
        <h1>Desafio de hoje</h1>
        <p style={{ color: "var(--barro)" }}>{erro}</p>
      </main>
    );
  }

  if (!dados) {
    return (
      <main>
        <Voltar />
        <h1>Desafio de hoje</h1>
        <p className="referencia">Carregando…</p>
      </main>
    );
  }

  const acertos = dados.respondidas.filter((r) => r.acertou).length;
  const terminou = atual >= dados.perguntas.length;

  /* ---------------- terminou o dia ---------------- */
  if (terminou) {
    return (
      <main>
        <Voltar />
        <h1>Desafio de hoje</h1>
        <p className="referencia">{porExtenso(dados.dia)}</p>

        <div className="desafio-placar">
          <span className="desafio-nota">
            {acertos}
            <span className="desafio-de">de {dados.perguntas.length}</span>
          </span>
          {dados.sequencia > 1 && (
            <p className="desafio-sequencia">
              <strong>{dados.sequencia} dias seguidos.</strong> Volte amanhã para não perder.
            </p>
          )}
        </div>

        {dados.participantes > 1 && dados.media !== null && (
          <p className="desafio-media">
            Hoje {dados.participantes} pessoas jogaram, com média de{" "}
            <strong>{dados.media.toString().replace(".", ",")}</strong> acertos.
          </p>
        )}

        <p style={{ marginTop: "1.25rem" }}>
          As cinco de amanhã são outras — e são as mesmas para todo mundo. O
          desafio troca à meia-noite.
        </p>

        {/* O melhor momento para oferecer a notificação é agora, com a pessoa
            satisfeita e querendo voltar amanhã. */}
        <AtivarMensagens />

        <p style={{ marginTop: "1rem" }}>
          <Link href="/quiz" className="botao botao-vazado">
            Jogar o quiz completo
          </Link>
        </p>

        <footer className="rodape">
          O desafio não pontua no ranking e não gasta as perguntas do quiz — as
          duas coisas são separadas.
        </footer>
      </main>
    );
  }

  /* ---------------- uma pergunta ---------------- */
  const p = dados.perguntas[atual];

  return (
    <main>
      <nav className="voltar-barra">
        <Voltar />
        <span className="referencia">
          {atual + 1} de {dados.perguntas.length}
        </span>
      </nav>

      <p className="desafio-rotulo">Desafio de {porExtenso(dados.dia)}</p>

      <div className="desafio-trilha" aria-hidden="true">
        {dados.perguntas.map((q, i) => {
          const feita = dados.respondidas.find((r) => r.perguntaId === q.id);
          return (
            <span
              key={q.id}
              className={`desafio-passo${
                feita ? (feita.acertou ? " passo-certo" : " passo-errado") : ""
              }${i === atual ? " passo-atual" : ""}`}
            />
          );
        })}
      </div>

      <h1 className="desafio-pergunta">{p.enunciado}</h1>

      {p.alternativas.map((alt, i) => {
        let classe = "alternativa";
        if (resultado) {
          if (i === resultado.correta) classe += " certa";
          else if (i === escolha) classe += " errada";
        }
        return (
          <button
            key={i}
            className={classe}
            disabled={!!resultado || enviando}
            onClick={() => responder(i)}
          >
            {alt}
          </button>
        );
      })}

      {erro && <p style={{ color: "var(--barro)", marginTop: "0.75rem" }}>{erro}</p>}

      {resultado && (
        <>
          <div
            className={`explicacao ${resultado.certo ? "explicacao-certa" : "explicacao-errada"}`}
          >
            <p>
              <strong>{resultado.certo ? "Isso mesmo." : "Não era essa."}</strong>{" "}
              {resultado.explicacao}
            </p>
            <p className="referencia">{resultado.versiculo}</p>
          </div>

          <button className="botao" onClick={proxima}>
            {atual + 1 === dados.perguntas.length ? "Ver o resultado" : "Próxima"}
          </button>
        </>
      )}

      <footer className="rodape">
        Cinco perguntas, as mesmas para todo mundo, até a meia-noite. Sem
        cronômetro.
      </footer>
    </main>
  );
}
