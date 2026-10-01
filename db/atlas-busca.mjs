/**
 * Preenche a coluna `busca` de `lugares` com o nome sem acento.
 *
 * Existe porque quem digita no celular quase nunca poe acento — "getsemani"
 * tem que achar "Getsêmani". A extensao `unaccent` do Postgres resolveria
 * isso no banco, mas ligar extensao exige superusuario, que o Neon nao da.
 *
 * Rode depois de acrescentar lugares em db/atlas.sql.
 *
 * Rodar:  node db/atlas-busca.mjs
 */
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

for (const l of readFileSync(".env.local", "utf8").split("\n")) {
  const m = l.match(/^([A-Z_]+)="(.*)"$/);
  if (m) process.env[m[1]] = m[2];
}

const sql = neon(process.env.DATABASE_URL);
const semAcento = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const lugares = await sql`select id, nome, atual from lugares`;
for (const l of lugares) {
  const termo = semAcento([l.nome, l.atual].filter(Boolean).join(" "));
  await sql`update lugares set busca = ${termo} where id = ${l.id}`;
}
console.log(`${lugares.length} lugares indexados`);
