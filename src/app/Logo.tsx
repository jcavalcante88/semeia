/* eslint-disable @next/next/no-img-element */

/**
 * Pomba do Semeia.
 *
 * A arte vem de `public/pomba.png`, gerada por `scripts/icones.mjs` a partir
 * do icone "peace pigeon" do Icons8. Ela e branca, entao precisa de fundo
 * escuro: o selo pinho existe por isso — sobre o vidro claro da lateral, uma
 * pomba branca simplesmente sumiria.
 *
 * A licenca gratuita do Icons8 exige link de volta. O credito esta no rodape
 * da lateral direita e na pagina de ajustes. Trocando a arte, tire o credito.
 *
 * Para a logo sem o selo, troque `selo-pomba` por `selo-pomba selo-nu` no
 * span abaixo — a regra `.selo-nu` deixa a pomba solta sobre o fundo.
 */
export function Pomba({ tamanho = 30 }: { tamanho?: number }) {
  return (
    <span
      className="selo-pomba"
      style={{ width: tamanho, height: tamanho }}
      aria-hidden="true"
    >
      <img src="/pomba.png" alt="" width={tamanho} height={tamanho} />
    </span>
  );
}

/** Pomba + nome, usada no topo das laterais. */
export default function Logo() {
  return (
    <span className="marca-conteudo">
      <Pomba tamanho={38} />
      <span className="marca-nome">Semeia</span>
    </span>
  );
}
