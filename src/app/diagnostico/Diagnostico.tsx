"use client";

import { useEffect, useState } from "react";
import Voltar from "../Voltar";

/**
 * Página de conserto, não do app.
 *
 * Por que existe: as animações de rolagem não apareceram no celular do Jerry
 * duas vezes seguidas, e eu errei as duas tentativas de adivinhar o motivo —
 * daqui não dá para inspecionar o aparelho dele, e o Chrome sem interface
 * gráfica que eu uso para testar mente sobre movimento reduzido.
 *
 * Em vez de uma terceira adivinhação, o aparelho responde sozinho. Ele abre,
 * manda o print, e a causa aparece.
 *
 * NÃO está no menu e não é indexada. Pode apagar quando o assunto fechar.
 */
type Linha = { nome: string; valor: string; bom: boolean | null };

export default function Diagnostico() {
  const [linhas, setLinhas] = useState<Linha[] | null>(null);
  const [revelados, setRevelados] = useState("medindo…");

  useEffect(() => {
    const raiz = document.documentElement;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const temObservador = "IntersectionObserver" in window;
    const temClasse = raiz.classList.contains("revela-ligado");
    const alvos = document.querySelectorAll("[data-revela]");

    setLinhas([
      {
        nome: "Movimento reduzido no aparelho",
        // É a causa mais provável, e é uma configuração do celular, não do app.
        valor: reduzido ? "LIGADO — é por isso que não anima" : "desligado",
        bom: !reduzido,
      },
      {
        nome: "Suporte a IntersectionObserver",
        valor: temObservador ? "sim" : "NÃO — navegador antigo demais",
        bom: temObservador,
      },
      {
        nome: "Script das animações rodou",
        valor: temClasse ? "sim" : reduzido ? "pulou, porque você pediu menos movimento" : "NÃO",
        bom: temClasse || reduzido,
      },
      {
        nome: "Blocos marcados nesta página",
        valor: String(alvos.length),
        bom: null,
      },
      {
        nome: "Animação guiada por rolagem em CSS",
        // O que eu tinha usado antes. Se aqui disser "não", era essa a causa
        // da primeira tentativa.
        valor: CSS.supports("animation-timeline", "view()") ? "suportada" : "NÃO suportada",
        bom: null,
      },
      { nome: "Navegador", valor: navigator.userAgent, bom: null },
      {
        nome: "Tela",
        valor: `${window.innerWidth} x ${window.innerHeight}`,
        bom: null,
      },
    ]);
  }, []);

  /* Conta quantos blocos desta própria página já apareceram, enquanto rola. */
  useEffect(() => {
    const contar = () => {
      const alvos = document.querySelectorAll("[data-revela]");
      const feitos = document.querySelectorAll("[data-revela].revelado");
      setRevelados(`${feitos.length} de ${alvos.length} já apareceram`);
    };
    contar();
    window.addEventListener("scroll", contar, { passive: true });
    // Também no relógio: a rede de segurança das animações revela os blocos
    // sozinha depois de 3 segundos, e sem isto o número no print ficaria
    // velho justamente na hora de me mandar a foto.
    const relogio = window.setInterval(contar, 500);
    return () => {
      window.clearInterval(relogio);
      window.removeEventListener("scroll", contar);
    };
  }, []);

  return (
    <main>
      <Voltar />
      <h1>Diagnóstico</h1>
      <p className="referencia">Página de conserto — não faz parte do app</p>

      <p style={{ marginTop: "1rem" }}>
        Role até o fim e me mande um print desta tela. Ela responde por que as
        animações não estão aparecendo no seu aparelho.
      </p>

      {linhas === null ? (
        <p>Medindo…</p>
      ) : (
        <ul className="diagnostico">
          {linhas.map((l) => (
            <li key={l.nome}>
              <span className="diagnostico-nome">{l.nome}</span>
              <span
                className={
                  l.bom === null
                    ? "diagnostico-valor"
                    : `diagnostico-valor ${l.bom ? "diagnostico-ok" : "diagnostico-ruim"}`
                }
              >
                {l.valor}
              </span>
            </li>
          ))}
        </ul>
      )}

      <h2 data-revela>Teste ao vivo</h2>
      <p data-revela>
        Estes três blocos estão marcados para aparecer ao rolar. Se eles
        surgirem subindo conforme você desce a tela, a animação está
        funcionando.
      </p>
      <p data-revela>
        <strong>{revelados}</strong>
      </p>

      <div style={{ height: "60vh" }} aria-hidden="true" />

      <p data-revela>
        Se você chegou aqui e este parágrafo apareceu subindo, está tudo certo.
      </p>

      <footer className="rodape">
        Depois que o problema for resolvido, esta página pode ser apagada.
      </footer>
    </main>
  );
}
