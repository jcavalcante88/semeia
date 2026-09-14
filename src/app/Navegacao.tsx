"use client";

import Link from "next/link";
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
  { href: "/quiz", rotulo: "Quiz", icone: "✎" },
  { href: "/oracao", rotulo: "Oração", icone: "✚" },
  { href: "/ranking", rotulo: "Ranking", icone: "☆" },
  { href: "/noticias", rotulo: "Gospel", icone: "◈" },
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
          Manhã, meio-dia e noite. Dá para desligar quando quiser.
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

/** Barra fixa do celular: o mesmo menu, no polegar. */
export function BarraInferior() {
  const caminho = usePathname();
  return (
    <nav className="barra-inferior" aria-label="Navegação">
      {DESTINOS.map((d) => (
        <Link
          key={d.href}
          href={d.href}
          className="barra-item"
          aria-current={estaAtivo(caminho, d.href) ? "page" : undefined}
        >
          <span className="barra-icone" aria-hidden="true">
            {d.icone}
          </span>
          <span className="barra-rotulo">{d.rotulo}</span>
        </Link>
      ))}
    </nav>
  );
}
