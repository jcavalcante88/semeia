"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

/**
 * Navegacao unica do app, em tres formatos:
 *  - lateral esquerda no desktop
 *  - lateral direita com atalhos no desktop
 *  - barra fixa no rodape do celular
 *
 * Um so lugar define os destinos, entao nao ha risco de o menu do celular
 * ficar diferente do menu do computador.
 */
const DESTINOS = [
  { href: "/", rotulo: "Início", icone: "✦" },
  { href: "/desafio", rotulo: "Desafio", icone: "◉" },
  { href: "/quiz", rotulo: "Quiz", icone: "✎" },
  { href: "/soletrar", rotulo: "Soletrar", icone: "◆" },
  { href: "/quebra-cabeca", rotulo: "Montar", icone: "▦" },
  { href: "/oracao", rotulo: "Oração", icone: "✚" },
  { href: "/ranking", rotulo: "Ranking", icone: "☆" },
  { href: "/noticias", rotulo: "Cristão", icone: "◈" },
  { href: "/configuracoes", rotulo: "Ajustes", icone: "⚙" },
];

function estaAtivo(caminho: string, href: string) {
  return href === "/" ? caminho === "/" : caminho.startsWith(href);
}

export function LateralEsquerda() {
  const caminho = usePathname();
  return (
    <aside className="lateral lateral-esq">
      <Link href="/" className="marca">
        <Logo />
      </Link>

      <nav className="menu" aria-label="Navegação principal">
        {DESTINOS.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            className="menu-item"
            aria-current={estaAtivo(caminho, d.href) ? "page" : undefined}
          >
            <span className="menu-icone" aria-hidden="true">
              {d.icone}
            </span>
            {d.rotulo}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export function LateralDireita() {
  return (
    <aside className="lateral lateral-dir">
      <div className="cartao-lateral">
        <h2 className="cartao-titulo">Um versículo por dia</h2>
        <p className="cartao-texto">
          Às 7h e às 19h. Dá para desligar quando quiser.
        </p>
        <Link href="/configuracoes" className="botao botao-vazado botao-pequeno">
          Ativar mensagens
        </Link>
      </div>

      <div className="cartao-lateral">
        <h2 className="cartao-titulo">Errou alguma?</h2>
        <p className="cartao-texto">
          Reveja as perguntas que você errou, com a explicação e o versículo.
        </p>
        <Link href="/revisar" className="botao botao-vazado botao-pequeno">
          Rever meus erros
        </Link>
      </div>

      <div className="cartao-lateral">
        <h2 className="cartao-titulo">Seu nome</h2>
        <p className="cartao-texto">
          Trocar o nome que aparece no ranking, ou sair da lista pública.
        </p>
        <Link href="/configuracoes" className="botao botao-vazado botao-pequeno">
          Configurações
        </Link>
      </div>

      {/* Discreto de propósito: um cartão na lateral, nunca pop-up nem banner.
          Pedir dinheiro na cara de quem acabou de chegar é o contrário de um
          convite. */}
      <div className="cartao-lateral">
        <h2 className="cartao-titulo">Apoiar o Semeia</h2>
        <p className="cartao-texto">
          O app é gratuito e sem anúncio. Um Pix de qualquer valor ajuda a
          manter no ar.
        </p>
        <Link href="/apoiar" className="botao botao-vazado botao-pequeno">
          Fazer um Pix
        </Link>
      </div>
    </aside>
  );
}

/**
 * Cabecalho do celular.
 *
 * A pomba e o nome vivem na lateral esquerda, que some abaixo de 992px — e
 * sem isto o app ficava sem marca nenhuma no telefone, que e onde quase todo
 * mundo vai usar. Fica grudado no topo para a pessoa sempre saber onde esta.
 */
export function CabecalhoMovel() {
  return (
    <header className="cabecalho-movel">
      <Link href="/" className="cabecalho-marca">
        <Logo />
      </Link>
    </header>
  );
}

/**
 * O menu do celular, num botao so.
 *
 * Eram nove destinos lado a lado numa barra fixa. Com nove colunas, cada uma
 * ficava com 35px num celular de 320px e o rotulo tinha que encolher para
 * 0,46rem — letra que muita gente nao le. Agora e um botao; tocando nele, os
 * nove aparecem num painel, cada um com espaco para o dedo.
 *
 * O painel fecha sozinho ao trocar de pagina, com Escape, e tocando fora.
 * Menu que so fecha pelo proprio botao prende quem abriu sem querer.
 */
export function MenuFlutuante() {
  const caminho = usePathname();
  const [aberto, setAberto] = useState(false);

  /* Trocou de pagina: fecha. Sem isto o painel fica por cima do destino. */
  useEffect(() => {
    setAberto(false);
  }, [caminho]);

  /* Escape fecha — e a tecla que todo mundo tenta. */
  useEffect(() => {
    if (!aberto) return;
    function tecla(e: KeyboardEvent) {
      if (e.key === "Escape") setAberto(false);
    }
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [aberto]);

  return (
    <>
      {/* A cortina escurece o fundo e fecha ao toque. Fica antes do painel no
          HTML para ficar atras dele sem precisar de z-index inventado. */}
      {aberto && (
        <button
          className="menu-cortina"
          aria-label="Fechar o menu"
          onClick={() => setAberto(false)}
        />
      )}

      <nav className={`menu-movel${aberto ? " menu-aberto" : ""}`} aria-label="Navegação">
        {/* `hidden` de verdade quando fechado: assim o leitor de tela e o
            Tab nao passeiam por nove links invisiveis. */}
        <ul className="menu-painel" hidden={!aberto}>
          {DESTINOS.map((d, i) => (
            <li
              key={d.href}
              /* Cada item entra um pouquinho depois do anterior. E o que faz
                 parecer que o menu ABRIU, em vez de so aparecer. */
              style={{ transitionDelay: `${i * 28}ms` }}
            >
              <Link
                href={d.href}
                className="menu-destino"
                aria-current={estaAtivo(caminho, d.href) ? "page" : undefined}
              >
                <span className="menu-destino-icone" aria-hidden="true">
                  {d.icone}
                </span>
                {d.rotulo}
              </Link>
            </li>
          ))}
        </ul>

        <button
          className="menu-gatilho"
          onClick={() => setAberto((a) => !a)}
          aria-expanded={aberto}
          aria-label={aberto ? "Fechar o menu" : "Abrir o menu"}
        >
          <span className="menu-gatilho-icone" aria-hidden="true">
            {aberto ? "✕" : "☰"}
          </span>
          <span className="menu-gatilho-texto">{aberto ? "Fechar" : "Opções"}</span>
        </button>
      </nav>
    </>
  );
}
