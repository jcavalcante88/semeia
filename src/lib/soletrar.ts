/**
 * Soletrar: montar a resposta escolhendo letras embaralhadas.
 *
 * A regra de ouro do projeto continua valendo — a palavra certa NUNCA é
 * enviada ao navegador. O que sai daqui é o tamanho dela e um monte de
 * letras, onde as certas estão misturadas com engano. A conferência
 * acontece no servidor, em `/api/soletrar`.
 */

/**
 * Tira acento e deixa em maiúscula.
 *
 * As peças do teclado não têm acento: um Ê ou um Ó no meio das letras
 * confunde mais do que desafia, e ninguém sabe se deve procurar E ou Ê.
 * "GÊNESIS" vira "GENESIS" tanto na peça quanto na conferência.
 */
export function normalizar(palavra: string): string {
  return palavra
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

/** Serve para soletrar? Precisa ser uma palavra só, nem curta nem enorme. */
export function serveComoSoletrar(resposta: string): boolean {
  const n = normalizar(resposta);
  return n.length >= 3 && n.length <= 12 && !/\s/.test(resposta.trim());
}

/**
 * Gerador determinístico simples.
 *
 * O embaralho precisa ser o MESMO toda vez que a pessoa abre o nível:
 * recarregar a página e ver outras letras faria parecer que o jogo está
 * trapaceando. Por isso a semente é o número do nível, não o relógio.
 */
function sorteio(semente: number) {
  let s = semente * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Monta o teclado: as letras da resposta mais enganos, embaralhados.
 *
 * As letras de engano são sorteadas entre as mais comuns do português —
 * encher de K, W e Y entregaria quais peças são de verdade.
 */
export function montarLetras(resposta: string, nivel: number): string[] {
  const certas = normalizar(resposta).split("");
  const comuns = "AEIOURSTNLMCDPGVBFHQJZX".split("");
  const aleatorio = sorteio(nivel);

  // Um teclado com pelo menos 12 peças, e sempre ao menos 5 de engano.
  const alvo = Math.min(16, Math.max(12, certas.length + 5));
  const letras = [...certas];
  while (letras.length < alvo) {
    letras.push(comuns[Math.floor(aleatorio() * comuns.length)]);
  }

  // Fisher-Yates com o mesmo sorteio determinístico.
  for (let i = letras.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [letras[i], letras[j]] = [letras[j], letras[i]];
  }
  return letras;
}
