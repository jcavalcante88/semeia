"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * O que dá para procurar, passando um de cada vez dentro da barra.
 *
 * POR QUE PASSANDO, e não tudo escrito de uma vez: o texto fixo era
 * "Procure uma passagem, parábola ou lugar" — 38 caracteres que não cabem
 * num celular de 360px. O fim sumia, e "ou lugar" era justo a parte que
 * ninguém adivinharia sozinho. Dizer menos por vez mostra mais no total.
 *
 * Cada linha é um EXEMPLO de verdade, não a categoria. "Procure um lugar"
 * não ensina nada; "Getsêmani" mostra na hora que dá para digitar um nome
 * e que isso vira um mapa. Todos existem no banco — exemplo que não acha
 * nada ensina a pessoa a desconfiar da barra.
 */
const EXEMPLOS = [
  "o bom samaritano",
  "João 3:16",
  "Getsêmani",
  "Salmos 23",
  "a arca de Noé",
  "Jericó",
  "o filho pródigo",
  "Mar da Galileia",
];

/*
 * MOVIMENTO REDUZIDO NÃO CONGELA A DICA — e esta é a segunda vez que eu
 * erro isto no mesmo app.
 *
 * A primeira versão desta barra simplesmente não trocava o exemplo quando a
 * preferência estava ligada. No computador do Jerry ela está, e a barra ficou
 * presa em "o bom samaritano" para sempre: das oito coisas que a dica existe
 * para ensinar, ela ensinava uma. Ficou PIOR que o texto fixo antigo, que ao
 * menos dizia "passagem, parábola ou lugar" — três categorias em vez de um
 * exemplo só.
 *
 * O mesmo erro já estava escrito no CLAUDE.md sobre o carrossel: movimento
 * reduzido decide COMO a coisa se mexe, não proíbe a coisa de existir. Trocar
 * a palavra é informação; o que é movimento é o deslize e o apagar. Então com
 * a preferência ligada o exemplo continua passando e a troca é SECA — o CSS
 * zera a transição e o `translateY`, e nada desliza na tela de ninguém.
 */

/** 3,2s por exemplo: dá para ler três palavras sem pressa e sem enjoar. */
const PAUSA = 3200;
/** O apagar e o acender da troca. */
const FUSAO = 350;

export default function Busca() {
  const router = useRouter();
  const [termo, setTermo] = useState("");
  const [vez, setVez] = useState(0);
  const [visivel, setVisivel] = useState(true);
  const [focado, setFocado] = useState(false);
  const [sobre, setSobre] = useState(false);
  /*
   * Antes de hidratar não há JavaScript, então a dica que passa não existe.
   * Até lá o campo usa um `placeholder` curto de verdade — quem chega com a
   * rede ruim vê uma barra que já diz para que serve.
   */
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  /*
   * ESCONDIDO e PARADO são coisas diferentes.
   *
   * Escondida, a dica some do campo: é o que tem que acontecer quando a
   * pessoa está digitando, senão o texto dela fica por baixo de uma dica.
   *
   * Parada, ela continua na tela e só não troca mais. É o que o mouse em
   * cima pede: no computador o ponteiro chega ANTES do clique, então quem
   * está lendo a dica para decidir se vai clicar merece que ela espere. No
   * celular isso não existe — lá o dedo já chega clicando, e o foco resolve.
   */
  const escondido = focado || termo !== "";
  const parado = escondido || sobre;

  useEffect(() => {
    if (parado || !montado) return;

    const apagar = setTimeout(() => setVisivel(false), PAUSA);
    const trocar = setTimeout(() => {
      setVez((v) => (v + 1) % EXEMPLOS.length);
      setVisivel(true);
    }, PAUSA + FUSAO);

    return () => {
      clearTimeout(apagar);
      clearTimeout(trocar);
    };
  }, [vez, parado, montado]);

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    const q = termo.trim();
    if (!q) return;
    router.push(`/buscar?q=${encodeURIComponent(q)}`);
  }

  return (
    <form className="busca" onSubmit={buscar} role="search">
      <div
        className="busca-caixa"
        /* Parar com o mouse em cima também é o que a WCAG 2.2.2 pede de
           qualquer coisa que se atualiza sozinha: tem que haver um jeito de
           segurar. No celular o jeito é tocar; aqui é chegar perto. */
        onMouseEnter={() => setSobre(true)}
        onMouseLeave={() => setSobre(false)}
      >
        <input
          className="busca-campo"
          type="search"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          placeholder={montado ? "" : "Procure na Bíblia"}
          /* O rótulo do leitor de tela diz TUDO o que a dica que passa só
             mostra aos poucos: quem não enxerga a barra não pode depender
             de esperar oito trocas para saber o que dá para procurar. */
          aria-label="Procurar na Bíblia: passagem, versículo, capítulo, parábola ou lugar"
          enterKeyHint="search"
        />

        {/* `aria-hidden` porque isto é a mesma informação do aria-label, em
            outra forma. Sem isso, o leitor de tela anunciaria a troca de
            exemplo a cada 3 segundos, no meio do que a pessoa estivesse
            fazendo. `pointer-events: none` para o toque atravessar e cair
            no campo — dica que rouba o clique é dica que atrapalha. */}
        {montado && !escondido && (
          <span className="busca-dica" aria-hidden="true">
            <span className="busca-dica-fixa">Procure</span>{" "}
            <span className={`busca-dica-vez${visivel ? "" : " saindo"}`}>
              {EXEMPLOS[vez]}
            </span>
          </span>
        )}
      </div>

      <button className="busca-botao" type="submit" aria-label="Buscar">
        <span aria-hidden="true">⌕</span>
      </button>
    </form>
  );
}
