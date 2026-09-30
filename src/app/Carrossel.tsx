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
 * Ele anda sozinho a cada 5 segundos e PAUSA assim que a pessoa encosta —
 * carrossel que continua andando enquanto você lê é a razão de quase todo
 * mundo odiar carrossel. A diferença para a primeira versão é que agora a
 * pausa é reversível: tem botão para voltar a andar, e botões para ir ao
 * cartão anterior e ao próximo.
 */
export default function Carrossel({ cartoes }: { cartoes: Cartao[] }) {
  const tira = useRef<HTMLUListElement>(null);
  const [atual, setAtual] = useState(0);
  const [tocando, setTocando] = useState(true);
  /* De 0 a 1, quanto falta para o próximo cartão. Alimenta a barrinha, que é
     o que torna a pausa VISÍVEL — sem ela, parado e andando são iguais. */
  const [progresso, setProgresso] = useState(0);

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

  /**
   * Anda `quanto` cartões, dando a volta nas duas pontas: do último vai para
   * o primeiro, e do primeiro volta para o último. Botão que não faz nada na
   * ponta parece quebrado.
   */
  const andar = useCallback(
    (quanto: number) => {
      const el = tira.current;
      const largura = larguraDoCartao();
      if (!el || !largura) return;

      /*
       * A volta na ponta e decidida pela ROLAGEM, nao pelo indice.
       *
       * Contando so o indice, o carrossel travava em telas largas: com dois
       * cartoes a vista, a rolagem termina no cartao 13 de 15 — o indice 14
       * simplesmente nao e alcancavel. O `% 15` nunca chegava a 0, e a partir
       * do 13 nenhum clique fazia mais nada.
       *
       * Olhando o fim da rolagem em vez do indice, funciona igual com um
       * cartao a vista ou com cinco.
       */
      const maximo = el.scrollWidth - el.clientWidth;
      const noFim = el.scrollLeft >= maximo - 2;
      const noComeco = el.scrollLeft <= 2;

      let destino: number;
      if (quanto > 0 && noFim) destino = 0;
      else if (quanto < 0 && noComeco) destino = cartoes.length - 1;
      else destino = Math.round(el.scrollLeft / largura) + quanto;

      el.scrollTo({
        // Sem passar do fim: pedir mais do que existe faz o navegador parar
        // no meio do caminho e a conta seguinte sair errada.
        left: Math.max(0, Math.min(destino * largura, maximo)),
        behavior: "smooth",
      });
    },
    [cartoes.length, larguraDoCartao],
  );

  /*
   * Quem pediu menos movimento no sistema começa com o carrossel PARADO.
   *
   * Antes eu simplesmente não deixava andar nunca — e aí o botão de tocar
   * não fazia nada para essas pessoas, o que é pior do que não ter botão.
   * A preferência do sistema decide como ele começa; o botão continua
   * valendo, porque apertar tocar é um pedido explícito.
   */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTocando(false);
    }
  }, []);

  /* Encostar pausa. O botão de tocar traz de volta. */
  useEffect(() => {
    const el = tira.current;
    if (!el) return;
    const parar = () => setTocando(false);
    el.addEventListener("pointerdown", parar);
    el.addEventListener("wheel", parar, { passive: true });
    el.addEventListener("keydown", parar);
    return () => {
      el.removeEventListener("pointerdown", parar);
      el.removeEventListener("wheel", parar);
      el.removeEventListener("keydown", parar);
    };
  }, []);

  /*
   * O relógio do passeio.
   *
   * Corre de 50 em 50 ms em vez de um salto de 5 s, porque a barrinha precisa
   * andar junto. É barato: só soma um número e pinta uma barra por quadro,
   * sem tocar em layout.
   */
  useEffect(() => {
    if (!tocando || cartoes.length < 2) return;

    const TIQUE = 50;
    let passado = 0;

    const relogio = window.setInterval(() => {
      // Aba em segundo plano: o tempo não corre. Sem isto, quem volta depois
      // de um minuto perdeu doze cartões sem ver nenhum.
      if (document.hidden) return;
      passado += TIQUE;
      if (passado < PASSO_MS) {
        setProgresso(passado / PASSO_MS);
        return;
      }
      passado = 0;
      setProgresso(0);
      andar(1);
    }, TIQUE);

    return () => window.clearInterval(relogio);
  }, [tocando, cartoes.length, andar]);

  /* Os botões de anterior e próximo pausam: quem está navegando à mão não
     quer o carrossel puxando o tapete no meio da leitura. */
  function passar(quanto: number) {
    setTocando(false);
    setProgresso(0);
    andar(quanto);
  }

  function irPara(i: number) {
    const el = tira.current;
    if (!el) return;
    setTocando(false);
    setProgresso(0);
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

      {/* A barrinha do tempo. É ela que faz a pausa ser VISÍVEL: parada
          significa parado. Sem ela, quem aperta pausa não tem como saber se
          funcionou até esperar cinco segundos. */}
      <div className="carrossel-tempo" aria-hidden="true">
        <span
          className="carrossel-tempo-cheio"
          style={{ transform: `scaleX(${tocando ? progresso : 0})` }}
        />
      </div>

      <div className="carrossel-controles">
        <button
          className="carrossel-botao"
          onClick={() => passar(-1)}
          aria-label="Destaque anterior"
        >
          <span aria-hidden="true">‹</span>
        </button>

        <button
          className="carrossel-botao carrossel-tocar"
          onClick={() => setTocando((t) => !t)}
          aria-label={tocando ? "Pausar" : "Voltar a passar sozinho"}
        >
          <span aria-hidden="true">{tocando ? "❚❚" : "▶"}</span>
        </button>

        <button
          className="carrossel-botao"
          onClick={() => passar(1)}
          aria-label="Próximo destaque"
        >
          <span aria-hidden="true">›</span>
        </button>

        {/* As bolinhas ficam ao lado dos botões, não numa linha só delas:
            com 15 cartões elas viravam uma faixa comprida que empurrava a
            palavra de hoje para longe. */}
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

        <span className="carrossel-conta">
          {atual + 1}/{cartoes.length}
        </span>
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
        {/* O cartao inteiro ja e clicavel, mas ninguem descobre isso so
            olhando. O botao diz em palavras para onde o toque leva — e diz
            tambem que a materia completa esta FORA do Semeia. */}
        <span className="carrossel-botao-ler">
          Ver notícia completa <span aria-hidden="true">→</span>
        </span>
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
