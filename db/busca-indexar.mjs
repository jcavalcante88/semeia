/**
 * Preenche as colunas `busca` de `lugares` e `mensagens`.
 *
 * Existe porque quem digita no celular quase nunca poe acento — "getsemani"
 * tem que achar "Getsemani" e "coracao" tem que achar "coracao". A extensao
 * `unaccent` do Postgres resolveria isso no banco, mas ligar extensao exige
 * superusuario, que o Neon nao da.
 *
 * Rode depois de acrescentar lugares em db/atlas.sql ou versiculos em
 * db/seed-mensagens.sql.
 *
 * Rodar:  node db/busca-indexar.mjs
 */
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

for (const l of readFileSync(".env.local", "utf8").split("\n")) {
  const m = l.match(/^([A-Z_]+)="(.*)"$/);
  if (m) process.env[m[1]] = m[2];
}

const sql = neon(process.env.DATABASE_URL);
const semAcento = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// A coluna nasce aqui para quem roda o script num banco antigo: assim nao e
// preciso lembrar de aplicar um .sql separado antes.
await sql`alter table mensagens add column if not exists busca text not null default ''`;

const lugares = await sql`select id, nome, atual from lugares`;
for (const l of lugares) {
  const termo = semAcento([l.nome, l.atual].filter(Boolean).join(" "));
  await sql`update lugares set busca = ${termo} where id = ${l.id}`;
}
console.log(`${lugares.length} lugares indexados`);

// O versiculo entra inteiro: quem procura "nada me faltara" acha o salmo 23
// sem saber a referencia. O tema tambem, porque "fe" e "perdao" sao o que a
// pessoa digita quando nao sabe onde esta escrito.
const mensagens = await sql`select id, texto, referencia, tema from mensagens`;
for (const m of mensagens) {
  const termo = semAcento([m.texto, m.referencia, m.tema].filter(Boolean).join(" "));
  await sql`update mensagens set busca = ${termo} where id = ${m.id}`;
}
console.log(`${mensagens.length} versiculos indexados`);
