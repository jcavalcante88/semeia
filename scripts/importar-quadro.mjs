/**
 * Recorta uma imagem enviada pelo Jerry no tamanho do tabuleiro.
 *
 * O quebra-cabeca e 4x4, entao o quadro tem que ser quadrado. Imagem deitada
 * ou em pe perde as pontas: `attention` deixa o sharp escolher onde cortar
 * olhando o contraste da propria imagem, que acerta mais do que cortar sempre
 * pelo meio — o assunto costuma estar fora do centro geometrico.
 *
 * ANTES DE IMPORTAR, OLHE A IMAGEM. Marca d'agua, logo de banco de imagens ou
 * foto de producao com atores reais nao entram: o app e publico, e publicar e
 * redistribuir. Ja recusei tres imagens por isso.
 *
 * Rodar:  node scripts/importar-quadro.mjs <arquivo> <nome-na-lista> [foco]
 *         foco: attention (padrao) | centre | top | bottom | left | right
 */
import sharp from "sharp";
import { mkdirSync, existsSync } from "node:fs";
import { LISTA } from "./quadros-lista.mjs";

const L = 720;
const SAIDA = "public/quadros";

const [arquivo, nome, foco = "attention"] = process.argv.slice(2);

if (!arquivo || !nome) {
  console.error("uso: node scripts/importar-quadro.mjs <arquivo> <nome> [foco]");
  process.exit(1);
}
if (!existsSync(arquivo)) {
  console.error(`arquivo nao encontrado: ${arquivo}`);
  process.exit(1);
}

// O nome tem que existir na lista, senao o quadro entra sem titulo nem
// significado e o jogo mostra uma imagem muda.
const entrada = LISTA.find((q) => q.nome === nome);
if (!entrada) {
  console.error(`"${nome}" nao esta em scripts/quadros-lista.mjs — acrescente antes de importar.`);
  process.exit(1);
}
if (entrada.origem !== "imagem") {
  console.error(`"${nome}" esta marcado como ${entrada.origem}, nao como imagem.`);
  process.exit(1);
}

const posicao =
  foco === "attention" ? sharp.strategy.attention : foco === "entropy" ? sharp.strategy.entropy : foco;

const origem = sharp(arquivo);
const antes = await origem.metadata();

await origem
  .resize(L, L, { fit: "cover", position: posicao })
  // PNG porque o tabuleiro corta a imagem em 16 e o JPEG deixa sujeira nas
  // bordas de cada peca.
  .png({ compressionLevel: 9 })
  .toFile(`${SAIDA}/${nome}.png`);

const depois = await sharp(`${SAIDA}/${nome}.png`).metadata();
console.log(
  `${entrada.titulo}\n  ${antes.width}x${antes.height} ${antes.format}` +
    ` -> ${depois.width}x${depois.height} png  (${SAIDA}/${nome}.png)`,
);

mkdirSync(SAIDA, { recursive: true });
