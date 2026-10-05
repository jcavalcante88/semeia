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
  /*
   * Antes de hidratar não há JavaScript, então a dica que passa não existe.
   * Até lá o campo usa um `placeholder` curto de verdade — quem chega com a
   * rede ruim vê uma barra que já diz para que serve.
   */
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  /*
   * Para de passar quando a pessoa encosta no campo. Texto que troca embaixo
   * de quem está digitando é a mesma falta de educação do carrossel que anda
   * enquanto você lê — e aqui seria pior, porque ela está escrevendo.
   *
   * Com `prefers-reduced-motion` a dica também fica parada: a troca é
   * movimento, e movimento repetido na porta de entrada do app é exatamente
   * o que essa preferência pede para não existir.
   */
  const parado = focado || termo !== "";

  useEffect(() => {
    if (parado || !montado) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
      <div className="busca-caixa">
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
        {montado && !parado && (
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
