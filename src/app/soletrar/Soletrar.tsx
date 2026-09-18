"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Voltar from "../Voltar";

type Mapa = { total: number; resolvidos: number[] };
type Puzzle = {
  nivel: number;
  enunciado: string;
  tamanho: number;
  letras: string[];
  resolvido: boolean;
};
type Acerto = { resposta: string; explicacao: string; versiculo: string };

export default function Soletrar() {
  const [mapa, setMapa] = useState<Mapa | null>(null);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [escolhidas, setEscolhidas] = useState<number[]>([]);
  const [acerto, setAcerto] = useState<Acerto | null>(null);
  const [errou, setErrou] = useState(false);
  const [conferindo, setConferindo] = useState(false);
  const [erro, setErro] = useState("");

  const carregarMapa = useCallback(async () => {
    try {
      const r = await fetch("/api/soletrar");
      if (!r.ok) throw new Error();
      setMapa(await r.json());
    } catch {
      setErro("Não deu para carregar os níveis agora.");
    }
  }, []);

  useEffect(() => {
    carregarMapa();
  }, [carregarMapa]);

  async function abrir(nivel: number) {
    setErro("");
    setAcerto(null);
    setErrou(false);
    setEscolhidas([]);
    try {
      const r = await fetch(`/api/soletrar?nivel=${nivel}`);
      if (!r.ok) throw new Error();
      setPuzzle(await r.json());
    } catch {
      setErro("Não deu para abrir esse nível.");
    }
  }

  function voltarAoMapa() {
    setPuzzle(null);
    setEscolhidas([]);
    setAcerto(null);
    setErrou(false);
    carregarMapa();
  }

  /** Confere no servidor assim que a palavra fica completa. */
  const conferir = useCallback(
    async (indices: number[]) => {
      if (!puzzle) return;
      const palavra = indices.map((i) => puzzle.letras[i]).join("");
      setConferindo(true);
      setErrou(false);
      try {
        const r = await fetch("/api/soletrar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nivel: puzzle.nivel, palavra }),
        });
        const d = await r.json().catch(() => null);
        if (!r.ok) {
          setErro(d?.erro ?? "Não deu para conferir agora.");
          return;
        }
        if (d.certo) setAcerto(d);
        else setErrou(true);
      } catch {
        setErro("Não deu para conferir. Verifique sua conexão.");
      } finally {
        setConferindo(false);
      }
    },
    [puzzle],
  );

  function tocarLetra(i: number) {
    if (!puzzle || acerto || conferindo) return;
    if (escolhidas.includes(i)) return;
    if (escolhidas.length >= puzzle.tamanho) return;

    const novas = [...escolhidas, i];
    setEscolhidas(novas);
    setErrou(false);
    if (novas.length === puzzle.tamanho) conferir(novas);
  }

  function apagar() {
    if (acerto || conferindo) return;
    setEscolhidas((e) => e.slice(0, -1));
    setErrou(false);
  }

  /* ---------------- mapa de níveis ---------------- */
  if (!puzzle) {
    const feitos = mapa?.resolvidos ?? [];
    const proximo =
      mapa && Array.from({ length: mapa.total }, (_, i) => i + 1).find((n) => !feitos.includes(n));

    return (
      <main>
        <Voltar />
        <h1>Soletrar</h1>
        <p className="referencia">
          {mapa ? `${feitos.length} de ${mapa.total} resolvidos` : "Carregando…"}
        </p>

        <p style={{ marginTop: "1rem" }}>
          Descubra a palavra montando as letras. Errar não custa nada — pode
          tentar quantas vezes quiser.
        </p>

        {erro && <p style={{ color: "var(--barro)" }}>{erro}</p>}

        {proximo && (
          <button className="botao" onClick={() => abrir(proximo)}>
            {feitos.length ? `Continuar no nível ${proximo}` : "Começar pelo nível 1"}
          </button>
        )}

        {mapa && (
          <ul className="niveis">
            {Array.from({ length: mapa.total }, (_, i) => i + 1).map((n) => (
              <li key={n}>
                {/* Nenhum nível fica trancado. Travar o 7 até resolver o 6
                    empurra quem só queria brincar um pouco — e o app é um
                    convite, não um funil. */}
                <button
                  className={`nivel${feitos.includes(n) ? " nivel-feito" : ""}`}
                  onClick={() => abrir(n)}
                  aria-label={`Nível ${n}${feitos.includes(n) ? ", resolvido" : ""}`}
                >
                  {feitos.includes(n) ? "✓" : n}
                </button>
              </li>
            ))}
          </ul>
        )}

        <footer className="rodape">
          Soletrar não pontua no ranking — é outro jogo, com progresso
          próprio.
        </footer>
      </main>
    );
  }

  /* ---------------- um nível ---------------- */
  const palavraNaTela = Array.from({ length: puzzle.tamanho }, (_, i) =>
    i < escolhidas.length ? puzzle.letras[escolhidas[i]] : null,
  );

  return (
    <main>
      <nav className="voltar-barra">
        <button className="voltar voltar-discreto" onClick={voltarAoMapa}>
          <span aria-hidden="true">←</span> Níveis
        </button>
        <span className="referencia">Nível {puzzle.nivel}</span>
      </nav>

      <p className="soletrar-pergunta">{puzzle.enunciado}</p>

      <div className={`soletrar-palavra${errou ? " soletrar-errou" : ""}`}>
        {palavraNaTela.map((letra, i) => (
          <span
            key={i}
            className={`soletrar-vaga${letra ? " soletrar-vaga-cheia" : ""}${
              acerto ? " soletrar-vaga-certa" : ""
            }`}
          >
            {letra ?? ""}
          </span>
        ))}
      </div>

      {errou && (
        <p className="soletrar-recado">
          Ainda não é essa. Apague e tente outra combinação.
        </p>
      )}

      {acerto ? (
        <>
          <div className="explicacao explicacao-certa">
            <p>
              <strong>Isso mesmo.</strong> {acerto.explicacao}
            </p>
            <p className="referencia">{acerto.versiculo}</p>
          </div>

          {puzzle.nivel < (mapa?.total ?? 0) ? (
            <button className="botao" onClick={() => abrir(puzzle.nivel + 1)}>
              Próximo nível
            </button>
          ) : (
            <p>Você resolveu o último nível. Níveis novos entram com as perguntas novas.</p>
          )}
          <p style={{ marginTop: "0.6rem" }}>
            <button className="botao botao-vazado" onClick={voltarAoMapa}>
              Ver os níveis
            </button>
          </p>
        </>
      ) : (
        <>
          <ul className="soletrar-letras">
            {puzzle.letras.map((l, i) => (
              <li key={i}>
                <button
                  className={`letra${escolhidas.includes(i) ? " letra-usada" : ""}`}
                  onClick={() => tocarLetra(i)}
                  disabled={escolhidas.includes(i) || conferindo}
                >
                  {l}
                </button>
              </li>
            ))}
          </ul>

          <button
            className="botao botao-vazado"
            onClick={apagar}
            disabled={!escolhidas.length || conferindo}
          >
            Apagar a última
          </button>
        </>
      )}

      {erro && <p style={{ color: "var(--barro)", marginTop: "0.75rem" }}>{erro}</p>}

      <footer className="rodape">
        Sem pressa e sem cronômetro. <Link href="/quiz">O quiz</Link> é que
        tem tempo, aqui não.
      </footer>
    </main>
  );
}
