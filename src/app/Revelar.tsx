"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Faz os blocos marcados com `data-revela` subirem e aparecerem ao rolar.
 *
 * A primeira versao disto era `animation-timeline: view()`, CSS puro, sem
 * JavaScript. Era mais elegante e não funcionou no celular do Jerry: ou o
 * navegador não suporta, ou o aparelho pede menos movimento, e nos dois casos
 * o efeito some **sem nenhum erro** para explicar. Efeito que falha calado é
 * pior do que efeito nenhum.
 *
 * Esta versão funciona em qualquer navegador que tenha IntersectionObserver,
 * que é todo navegador desde 2019.
 *
 * O PONTO DELICADO: por que a classe entra no `<html>` antes de observar.
 *
 * O jeito ingênuo é deixar `opacity: 0` no CSS e o script revelar depois. Se o
 * script falhar, demorar ou o aparelho for velho, **a página fica em branco** —
 * num app que a pessoa abre para ler um versículo, isso é grave. Aqui o CSS só
 * esconde o que estiver dentro de `.revela-ligado`, e essa classe é posta pelo
 * próprio script. Sem script, nada esconde: a página aparece inteira e parada.
 */
export default function Revelar() {
  const caminho = usePathname();

  useEffect(() => {
    const raiz = document.documentElement;

    // Quem pediu menos movimento no sistema não recebe nenhum. Nesse caso a
    // classe nem entra, então o CSS que esconde nunca chega a valer.
    const parado = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (parado || !("IntersectionObserver" in window)) {
      raiz.classList.remove("revela-ligado");
      return;
    }

    raiz.classList.add("revela-ligado");

    const alvos = Array.from(
      document.querySelectorAll<HTMLElement>("[data-revela]:not(.revelado)"),
    );
    if (!alvos.length) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          entrada.target.classList.add("revelado");
          observador.unobserve(entrada.target);
        }
      },
      {
        // Dispara um pouco antes de o bloco encostar na borda de baixo, senão
        // ele termina de aparecer já no meio da tela e o efeito passa batido.
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.01,
      },
    );

    alvos.forEach((alvo) => observador.observe(alvo));

    /*
     * Rede de segurança: se em 3 segundos algum bloco ainda estiver escondido
     * — observador que não disparou, aba em segundo plano, aparelho lento —
     * ele aparece assim mesmo. Nenhum texto deste app pode ficar invisível por
     * causa de um enfeite.
     */
    const rede = window.setTimeout(() => {
      alvos.forEach((alvo) => alvo.classList.add("revelado"));
    }, 3000);

    return () => {
      window.clearTimeout(rede);
      observador.disconnect();
    };
  }, [caminho]); // troca de página traz blocos novos para observar

  return null;
}
