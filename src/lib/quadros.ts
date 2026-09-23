import dados from "./quadros.json";

/**
 * Os quadros do quebra-cabeca deslizante.
 *
 * A lista e gerada por `scripts/quadros.mjs`, que tambem desenha os PNG em
 * `public/quadros/`. Nao edite o JSON a mao: o desenho e o texto nascem do
 * mesmo lugar justamente para nao poderem discordar.
 */
export type Quadro = {
  /** Nome do arquivo sem extensao: `public/quadros/{nome}.png`. */
  nome: string;
  titulo: string;
  versiculo: string;
  /** O que a cena conta. Aparece quando a pessoa monta a imagem. */
  significado: string;
};

export const QUADROS: Quadro[] = dados;

/** Quantas pecas de lado. 4 da 15 pecas mais o vazio — o jogo classico. */
export const LADO = 4;
