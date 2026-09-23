/**
 * Escreve `src/lib/quadros.json` a partir de `scripts/quadros-lista.mjs`.
 *
 * O app le o JSON; a lista e a fonte. Rode depois de mexer na lista —
 * `importar-quadro.mjs` ja chama isto sozinho no fim de cada importacao.
 *
 * Rodar:  node scripts/quadros-json.mjs
 */
import { writeFileSync } from "node:fs";
import { LISTA } from "./quadros-lista.mjs";

const dados = LISTA.map(({ nome, titulo, versiculo, significado }) => ({
  nome,
  titulo,
  versiculo,
  significado,
}));

writeFileSync("src/lib/quadros.json", JSON.stringify(dados, null, 2) + "\n");
console.log(`src/lib/quadros.json — ${dados.length} quadros`);
