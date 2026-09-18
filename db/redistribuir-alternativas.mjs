/**
 * Espalha a resposta certa entre as quatro posicoes, em todas as perguntas.
 *
 * Por que isto existe: escrevendo pergunta a mao, a gente poe a resposta certa
 * na primeira linha sem perceber. Em setembro de 2026 o banco estava assim:
 * 97 perguntas com a certa na 1a opcao, 37 na 2a, 18 na 3a e NENHUMA na 4a.
 * Quem chutasse sempre o primeiro botao acertava 64% das vezes, e a ultima
 * alternativa era sempre descartavel. Isso esvazia o quiz e o ranking junto.
 *
 * O app nao embaralha na tela de proposito: `/api/quiz/responder` compara o
 * indice que o navegador mandou com o `correta` do banco, e embaralhar no
 * cliente quebraria essa conferencia. Embaralhar no servidor exigiria mandar
 * o mapa de posicoes junto — mais uma peca para vazar. Entao a ordem certa
 * e a que esta gravada, e quem arruma e este script.
 *
 * Rode depois de cada seed novo de perguntas. E seguro repetir: so reordena,
 * nunca troca o texto da resposta certa, e `respostas` guarda acerto e pontos,
 * nao o indice escolhido — o historico de ninguem muda.
 *
 * Rodar:  node db/redistribuir-alternativas.mjs
 */
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

for (const l of readFileSync(".env.local", "utf8").split("\n")) {
  const m = l.match(/^([A-Z_]+)="(.*)"$/);
  if (m) process.env[m[1]] = m[2];
}

const sql = neon(process.env.DATABASE_URL);
const perguntas = await sql`select id, alternativas, correta from perguntas order by id`;

const planos = perguntas.map((p, i) => {
  const certa = p.alternativas[p.correta];
  const alvo = i % p.alternativas.length; // 0, 1, 2, 3, 0, 1, 2, 3...
  const resto = p.alternativas.filter((_, k) => k !== p.correta);
  return {
    id: p.id,
    novo: [...resto.slice(0, alvo), certa, ...resto.slice(alvo)],
    alvo,
    certa,
  };
});

// Confere ANTES de gravar: o conjunto de alternativas tem que ser o mesmo,
// so em outra ordem, e o gabarito tem que apontar para o mesmo texto.
let erros = 0;
planos.forEach((pl, i) => {
  const antes = [...perguntas[i].alternativas].sort();
  const depois = [...pl.novo].sort();
  if (JSON.stringify(antes) !== JSON.stringify(depois)) {
    console.error(`conjunto mudou na pergunta ${pl.id}`);
    erros++;
  }
  if (pl.novo[pl.alvo] !== pl.certa) {
    console.error(`gabarito errado na pergunta ${pl.id}`);
    erros++;
  }
});
if (erros) {
  console.error(`${erros} problemas — nada foi gravado.`);
  process.exit(1);
}

for (const pl of planos) {
  await sql`
    update perguntas
       set alternativas = ${JSON.stringify(pl.novo)}::jsonb, correta = ${pl.alvo}
     where id = ${pl.id}
  `;
}

const dist = await sql`select correta, count(*)::int c from perguntas group by correta order by correta`;
console.log(`${planos.length} perguntas — ${JSON.stringify(dist)}`);
