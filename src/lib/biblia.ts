/**
 * Transforma uma referência como "Salmos 46:1" num link para ler o capítulo
 * inteiro na Bíblia Online.
 *
 * O app mostra um versículo solto; quem se interessa quer o contexto. Sem
 * isto, a pessoa teria que sair do app e procurar no Google.
 *
 * O destino é a Almeida Corrigida Fiel, que é a edição da família Almeida
 * mais disponível online. O texto do app continua sendo Almeida 1911, em
 * domínio público — aqui só apontamos para fora, não redistribuímos nada.
 */

/** Abreviaturas usadas pela Bíblia Online, na ordem dos 66 livros. */
const LIVROS: Record<string, string> = {
  genesis: "gn", exodo: "ex", levitico: "lv", numeros: "nm", deuteronomio: "dt",
  josue: "js", juizes: "jz", rute: "rt",
  "1samuel": "1sm", "2samuel": "2sm", "1reis": "1rs", "2reis": "2rs",
  "1cronicas": "1cr", "2cronicas": "2cr",
  esdras: "ed", neemias: "ne", ester: "et", jo: "jó", salmos: "sl",
  proverbios: "pv", eclesiastes: "ec", cantares: "ct", "cantico dos canticos": "ct",
  isaias: "is", jeremias: "jr", lamentacoes: "lm", ezequiel: "ez", daniel: "dn",
  oseias: "os", joel: "jl", amos: "am", obadias: "ob", jonas: "jn", miqueias: "mq",
  naum: "na", habacuque: "hc", sofonias: "sf", ageu: "ag", zacarias: "zc",
  malaquias: "ml",
  mateus: "mt", marcos: "mc", lucas: "lc", joao: "jo", atos: "at",
  romanos: "rm", "1corintios": "1co", "2corintios": "2co",
  galatas: "gl", efesios: "ef", filipenses: "fp", colossenses: "cl",
  "1tessalonicenses": "1ts", "2tessalonicenses": "2ts",
  "1timoteo": "1tm", "2timoteo": "2tm", tito: "tt", filemom: "fm",
  hebreus: "hb", tiago: "tg", "1pedro": "1pe", "2pedro": "2pe",
  "1joao": "1jo", "2joao": "2jo", "3joao": "3jo", judas: "jd",
  apocalipse: "ap",
};

/** Tira acento, baixa a caixa e cola o número do livro ao nome ("1 Reis" -> "1reis"). */
function chave(livro: string): string {
  return livro
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/^([123])\s+/, "$1")
    .trim();
}

/**
 * Devolve o link do capítulo, ou null se a referência não for reconhecida.
 *
 * Null em vez de um link chutado: botão que leva a uma página de erro é pior
 * do que botão nenhum.
 */
export function linkDoCapitulo(referencia: string): string | null {
  // "1 Coríntios 13:4" -> livro "1 Coríntios", capítulo "13"
  const m = referencia.trim().match(/^(.+?)\s+(\d+)(?::|$)/);
  if (!m) return null;

  const abrev = LIVROS[chave(m[1])];
  if (!abrev) return null;

  return `https://www.bibliaonline.com.br/acf/${encodeURIComponent(abrev)}/${m[2]}`;
}

/** "Salmos 46:1" -> "Salmos 46", para escrever no botão. */
export function capituloDe(referencia: string): string {
  const m = referencia.trim().match(/^(.+?)\s+(\d+)(?::|$)/);
  return m ? `${m[1]} ${m[2]}` : referencia;
}
