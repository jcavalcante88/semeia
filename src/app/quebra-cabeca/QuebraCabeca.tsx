"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Voltar from "../Voltar";
import { QUADROS, LADO, type Quadro } from "@/lib/quadros";

const TOTAL = LADO * LADO;
const VAZIO = TOTAL - 1; // a peça que falta é sempre a última da imagem

/** Chave do que já foi montado, guardado só neste aparelho. */
const GUARDADO = "semeia:quadros-montados";

/**
 * Embaralha fazendo jogadas legais a partir da imagem pronta.
 *
 * Sortear as 16 posições daria um tabuleiro impossível em metade das vezes —
 * o 15 tem duas classes de permutação e só uma delas se resolve. Andando de
 * trás para frente, toda embaralhada nasce com solução.
 */
function embaralhar(passos = 240): number[] {
  const p = Array.from({ length: TOTAL }, (_, i) => i);
  let vazio = TOTAL - 1;
  let anterior = -1;

  for (let i = 0; i < passos; i++) {
    const vizinhos = vizinhosDe(vazio).filter((v) => v !== anterior);
    const escolhido = vizinhos[Math.floor(Math.random() * vizinhos.length)];
    [p[vazio], p[escolhido]] = [p[escolhido], p[vazio]];
    anterior = vazio;
    vazio = escolhido;
  }

  // Embaralhada que cai na imagem pronta existe: sortear de novo é mais
  // simples do que tentar impedir.
  return p.every((v, i) => v === i) ? embaralhar(passos) : p;
}

/** Posições coladas a uma casa, sem dar a volta pela borda. */
function vizinhosDe(i: number): number[] {
  const linha = Math.floor(i / LADO);
  const coluna = i % LADO;
  const v: number[] = [];
  if (linha > 0) v.push(i - LADO);
  if (linha < LADO - 1) v.push(i + LADO);
  if (coluna > 0) v.push(i - 1);
  if (coluna < LADO - 1) v.push(i + 1);
  return v;
}

export default function QuebraCabeca() {
  const [quadro, setQuadro] = useState<Quadro | null>(null);
  const [pecas, setPecas] = useState<number[]>([]);
  const [jogadas, setJogadas] = useState(0);
  const [espiando, setEspiando] = useState(false);
  const [montados, setMontados] = useState<string[]>([]);
  const tabuleiro = useRef<HTMLDivElement>(null);

  const pronto = pecas.length > 0 && pecas.every((v, i) => v === i);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(GUARDADO);
      if (salvo) setMontados(JSON.parse(salvo));
    } catch {
      // Aba anônima ou armazenamento bloqueado: joga sem lembrar, e tudo bem.
    }
  }, []);

  /* Guarda o quadro montado assim que ele fica pronto. */
  useEffect(() => {
    if (!pronto || !quadro) return;
    setMontados((antes) => {
      if (antes.includes(quadro.nome)) return antes;
      const novo = [...antes, quadro.nome];
      try {
        localStorage.setItem(GUARDADO, JSON.stringify(novo));
      } catch {}
      return novo;
    });
  }, [pronto, quadro]);

  function abrir(q: Quadro) {
    setQuadro(q);
    setPecas(embaralhar());
    setJogadas(0);
    setEspiando(false);
  }

  /** Move a peça da casa `i`, se ela fizer divisa com o buraco. */
  const mover = useCallback(
    (i: number) => {
      setPecas((atual) => {
        if (atual.every((v, k) => v === k)) return atual; // já montado
        const buraco = atual.indexOf(VAZIO);
        if (!vizinhosDe(buraco).includes(i)) return atual;
        const novo = [...atual];
        [novo[buraco], novo[i]] = [novo[i], novo[buraco]];
        setJogadas((n) => n + 1);
        return novo;
      });
    },
    [],
  );

  /**
   * Setas do teclado.
   *
   * A seta diz para onde a peça vai, não para onde o buraco vai — é o que a
   * mão espera. Seta para cima empurra para cima a peça que está embaixo.
   */
  useEffect(() => {
    if (!quadro) return;
    function tecla(e: KeyboardEvent) {
      const passo: Record<string, number> = {
        ArrowUp: LADO,
        ArrowDown: -LADO,
        ArrowLeft: 1,
        ArrowRight: -1,
      };
      const d = passo[e.key];
      if (d === undefined) return;
      e.preventDefault();
      setPecas((atual) => {
        const buraco = atual.indexOf(VAZIO);
        const alvo = buraco + d;
        if (alvo < 0 || alvo >= TOTAL) return atual;
        // Esquerda e direita não podem pular de uma linha para a outra.
        if (Math.abs(d) === 1 && Math.floor(alvo / LADO) !== Math.floor(buraco / LADO)) return atual;
        const novo = [...atual];
        [novo[buraco], novo[alvo]] = [novo[alvo], novo[buraco]];
        setJogadas((n) => n + 1);
        return novo;
      });
    }
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [quadro]);

  /**
   * Arrastar com o dedo.
   *
   * Tocar na peça já resolve tudo, mas no celular a mão pede para empurrar.
   * O gesto move a peça que está do lado contrário ao arrasto, igual às setas.
   */
  useEffect(() => {
    const el = tabuleiro.current;
    if (!el || !quadro) return;
    let x0 = 0;
    let y0 = 0;

    function comecou(e: TouchEvent) {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    }
    function terminou(e: TouchEvent) {
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return; // foi toque, não arrasto
      setPecas((atual) => {
        const buraco = atual.indexOf(VAZIO);
        const horizontal = Math.abs(dx) > Math.abs(dy);
        const alvo = horizontal
          ? buraco + (dx > 0 ? -1 : 1)
          : buraco + (dy > 0 ? -LADO : LADO);
        if (alvo < 0 || alvo >= TOTAL) return atual;
        if (horizontal && Math.floor(alvo / LADO) !== Math.floor(buraco / LADO)) return atual;
        const novo = [...atual];
        [novo[buraco], novo[alvo]] = [novo[alvo], novo[buraco]];
        setJogadas((n) => n + 1);
        return novo;
      });
    }

    el.addEventListener("touchstart", comecou, { passive: true });
    el.addEventListener("touchend", terminou, { passive: true });
    return () => {
      el.removeEventListener("touchstart", comecou);
      el.removeEventListener("touchend", terminou);
    };
  }, [quadro]);

  /* ---------------- escolha do quadro ---------------- */
  if (!quadro) {
    return (
      <main>
        <Voltar />
        <h1>Quebra-cabeça</h1>
        <p className="referencia">
          {montados.length} de {QUADROS.length} montados
        </p>

        <p style={{ marginTop: "1rem" }}>
          Escolha uma cena e deslize as peças até formar a imagem. Sem tempo e
          sem pontuação — quando ficar pronta, você lê o que ela conta.
        </p>

        <ul className="quadros">
          {QUADROS.map((q) => (
            <li key={q.nome}>
              <button className="quadro" onClick={() => abrir(q)}>
                <img src={`/quadros/${q.nome}.png`} alt="" loading="lazy" />
                <span className="quadro-nome">
                  {montados.includes(q.nome) && (
                    <span className="quadro-feito" aria-hidden="true">
                      ✓{" "}
                    </span>
                  )}
                  {q.titulo}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <footer className="rodape">
          O quebra-cabeça não pontua no ranking — é só para brincar.{" "}
          <Link href="/soletrar">Soletrar</Link> e <Link href="/quiz">o quiz</Link>{" "}
          continuam onde estavam.
        </footer>
      </main>
    );
  }

  /* ---------------- um quadro ---------------- */
  const fundo = `/quadros/${quadro.nome}.png`;

  return (
    <main>
      <nav className="voltar-barra">
        <button className="voltar voltar-discreto" onClick={() => setQuadro(null)}>
          <span aria-hidden="true">←</span> Quadros
        </button>
        <span className="referencia">{jogadas} jogadas</span>
      </nav>

      <h1 className="quadro-titulo">{quadro.titulo}</h1>

      {/* Três camadas para a moldura ter relevo: a banda dourada larga, o
          filete escuro que faz o rebaixo, e o tabuleiro como tela. Uma borda
          só, por mais grossa que fosse, ficaria chapada. */}
      <div className="moldura">
        <div className="moldura-rebaixo">
          <div
            ref={tabuleiro}
            className={`tabuleiro${pronto ? " tabuleiro-pronto" : ""}`}
            style={{ gridTemplateColumns: `repeat(${LADO}, 1fr)` }}
          >
            {pecas.map((peca, casa) => {
              const escondida = peca === VAZIO && !pronto && !espiando;
              const linha = Math.floor(peca / LADO);
              const coluna = peca % LADO;
              return (
                <button
                  key={casa}
                  className={`peca${escondida ? " peca-vazia" : ""}`}
                  onClick={() => mover(casa)}
                  disabled={escondida || pronto}
                  aria-label={escondida ? "Espaço vazio" : `Peça ${peca + 1}`}
                  style={
                    escondida
                      ? undefined
                      : {
                          backgroundImage: `url(${fundo})`,
                          backgroundSize: `${LADO * 100}% ${LADO * 100}%`,
                          backgroundPosition: `${(coluna / (LADO - 1)) * 100}% ${
                            (linha / (LADO - 1)) * 100
                          }%`,
                        }
                  }
                />
              );
            })}
          </div>
        </div>
      </div>

      {pronto ? (
        <div className="explicacao explicacao-certa">
          <p>
            <strong>Pronto.</strong> {quadro.significado}
          </p>
          <p className="referencia">{quadro.versiculo}</p>
        </div>
      ) : (
        <p className="quadro-dica">
          Toque numa peça vizinha do espaço vazio, arraste com o dedo ou use as
          setas do teclado.
        </p>
      )}

      <div className="quadro-acoes">
        {!pronto && (
          <button
            className="botao botao-vazado"
            onMouseDown={() => setEspiando(true)}
            onMouseUp={() => setEspiando(false)}
            onMouseLeave={() => setEspiando(false)}
            onTouchStart={() => setEspiando(true)}
            onTouchEnd={() => setEspiando(false)}
          >
            Segure para ver a imagem
          </button>
        )}
        <button className="botao botao-vazado" onClick={() => abrir(quadro)}>
          {pronto ? "Montar de novo" : "Embaralhar"}
        </button>
        {pronto && (
          <button className="botao" onClick={() => setQuadro(null)}>
            Escolher outro quadro
          </button>
        )}
      </div>
    </main>
  );
}
