"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Cartao =
  | {
      tipo: "noticia";
      id: string;
      titulo: string;
      resumo: string | null;
      imagem: string | null;
      fonte: string;
      link: string;
    }
  | {
      tipo: "evento";
      id: string;
      titulo: string;
      artista: string | null;
      quando: string; // já formatado pelo servidor, no fuso de São Paulo
      onde: string;
      link: string | null;
    };

/** De quanto em quanto tempo o carrossel anda sozinho. */
const PASSO_MS = 5000;

/**
 * O carrossel da tela inicial.
 *
 * É uma tira que rola na horizontal com `scroll-snap`, ou seja, ROLAGEM DE
 * VERDADE do navegador. Isso importa: o dedo arrasta com a inércia que a
 * pessoa já conhece, o trackpad funciona, o teclado funciona, e o leitor de
 * tela lê a lista inteira. Carrossel feito com `transform` e um índice em
 * JavaScript quebra as quatro coisas.
 *
 * Ele anda sozinho a cada 5 segundos, e PARA PARA SEMPRE assim que a pessoa
 * encosta nele. Carrossel que continua andando enquanto você lê é a razão de
 * quase todo mundo odiar carrossel.
 */
export default function Carrossel({ cartoes }: { cartoes: Cartao[] }) {
  const tira = useRef<HTMLUListElement>(null);
  const [atual, setAtual] = useState(0);
  const [automatico, setAutomatico] = useState(true);

  /*
   * A largura de UM cartão, medida no elemento.
   *
   * Não dá para usar a largura da tira: acima de 40rem cabem dois cartões
   * lado a lado, e aí o passo automático pularia de dois em dois e a bolinha
   * acesa marcaria o cartão errado.
   */
  const larguraDoCartao = useCallback(() => {
    const el = tira.current;
    const primeiro = el?.firstElementChild as HTMLElement | null;
    return primeiro?.offsetWidth ?? el?.clientWidth ?? 0;
  }, []);

  /* Qual cartão está à esquerda, para acender a bolinha certa. */
  const aoRolar = useCallback(() => {
    const el = tira.current;
    const largura = larguraDoCartao();
    if (!el || !largura) return;
    setAtual(Math.round(el.scrollLeft / largura));
  }, [larguraDoCartao]);

  /* Assim que a pessoa toca, arrasta ou usa o teclado, o passeio acaba. */
  useEffect(() => {
    const el = tira.current;
    if (!el) return;
    const parar = () => setAutomatico(false);
    el.addEventListener("pointerdown", parar);
    el.addEventListener("wheel", parar, { passive: true });
    el.addEventListener("keydown", parar);
    return () => {
      el.removeEventListener("pointerdown", parar);
      el.removeEventListener("wheel", parar);
      el.removeEventListener("keydown", parar);
    };
  }, []);

  useEffect(() => {
    if (!automatico || cartoes.length < 2) return;
    // Quem pediu menos movimento no sistema não recebe carrossel andando
    // sozinho — ele continua funcionando com o dedo.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const relogio = window.setInterval(() => {
      const el = tira.current;
      if (!el) return;
      // Se a aba está em segundo plano, não adianta andar: quando a pessoa
      // voltar terá perdido metade dos cartões sem ver nenhum.
      if (document.hidden) return;
      const largura = larguraDoCartao();
      if (!largura) return;
      const proximo = (Math.round(el.scrollLeft / largura) + 1) % cartoes.length;
      el.scrollTo({ left: proximo * largura, behavior: "smooth" });
    }, PASSO_MS);
    return () => window.clearInterval(relogio);
  }, [automatico, cartoes.length, larguraDoCartao]);

  function irPara(i: number) {
    const el = tira.current;
    if (!el) return;
    setAutomatico(false);
    el.scrollTo({ left: i * larguraDoCartao(), behavior: "smooth" });
  }

  if (!cartoes.length) return null;

  return (
    <section className="carrossel" aria-label="Destaques do mundo cristão">
      <ul className="carrossel-tira" ref={tira} onScroll={aoRolar} tabIndex={0}>
        {cartoes.map((c) => (
          <li key={`${c.tipo}-${c.id}`} className="carrossel-cartao">
            {c.tipo === "evento" ? (
              <Evento cartao={c} />
            ) : (
              <Noticia cartao={c} />
            )}
          </li>
        ))}
      </ul>

      <div className="carrossel-bolinhas">
        {cartoes.map((c, i) => (
          <button
            key={`${c.tipo}-${c.id}`}
            className={`carrossel-bolinha${i === atual ? " bolinha-ativa" : ""}`}
            onClick={() => irPara(i)}
            aria-label={`Ir para o destaque ${i + 1} de ${cartoes.length}`}
            aria-current={i === atual ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  );
}

function Noticia({ cartao }: { cartao: Extract<Cartao, { tipo: "noticia" }> }) {
  return (
    <a
      className="carrossel-link"
      href={cartao.link}
      target="_blank"
      rel="noopener noreferrer nofollow"
    >
      {cartao.imagem && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          className="carrossel-imagem"
          src={cartao.imagem}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      )}
      <span className="carrossel-conteudo">
        <span className="carrossel-selo">{cartao.fonte}</span>
        <span className="carrossel-titulo">{cartao.titulo}</span>
        {cartao.resumo && <span className="carrossel-resumo">{cartao.resumo}</span>}
      </span>
    </a>
  );
}

function Evento({ cartao }: { cartao: Extract<Cartao, { tipo: "evento" }> }) {
  const conteudo = (
    <>
      <span className="carrossel-conteudo carrossel-evento">
        <span className="carrossel-selo selo-evento">Show</span>
        <span className="carrossel-titulo">{cartao.titulo}</span>
        {cartao.artista && <span className="carrossel-artista">{cartao.artista}</span>}
        <span className="carrossel-quando">{cartao.quando}</span>
        <span className="carrossel-onde">{cartao.onde}</span>
      </span>
    </>
  );

  // Evento sem link não vira link morto: fica um cartão comum.
  return cartao.link ? (
    <a
      className="carrossel-link"
      href={cartao.link}
      target="_blank"
      rel="noopener noreferrer nofollow"
    >
      {conteudo}
    </a>
  ) : (
    <div className="carrossel-link">{conteudo}</div>
  );
}
