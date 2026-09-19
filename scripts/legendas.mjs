/**
 * Gera o arquivo de legendas dos Reels, na mesma ordem dos vídeos.
 *
 * Por que existe: na hora de postar, o gargalo não é o vídeo — é escrever
 * legenda 102 vezes no celular. Aqui sai tudo pronto num arquivo só, para
 * abrir no telefone e copiar.
 *
 * A legenda faz UMA pergunta e pede UMA resposta nos comentários. Comentário
 * é o sinal que mais pesa no alcance do Reels, e "comenta aí" sem pergunta
 * não gera comentário nenhum.
 */
import { neon } from "@neondatabase/serverless";
import { readFileSync, writeFileSync } from "node:fs";

for (const l of readFileSync(".env.local", "utf8").split("\n")) {
  const m = l.match(/^([A-Z_]+)="(.*)"$/);
  if (m) process.env[m[1]] = m[2];
}

/**
 * Três blocos de hashtag que se alternam por vídeo.
 *
 * Repetir exatamente as mesmas tags todo dia faz o Instagram tratar os posts
 * como repetidos. E tag gigante (#deus, 40 milhões de posts) some em segundos:
 * a maioria aqui é de nicho, onde um post novo fica visível por horas.
 */
const TAGS = [
  "#quizbiblico #biblia #versiculododia #fécristã #palavradedeus #cristãos #evangelho #jesus #deusnocontrole #bibliasagrada",
  "#biblia #quizbiblico #desafiobiblico #versiculo #cristãobrasileiro #igreja #gospel #fé #palavradedeus #conhecimentobiblico",
  "#versiculododia #quizbiblico #biblia #jesuscristo #cristã #devocional #fé #gospelbrasil #palavradedeus #estudobiblico",
];

const sql = neon(process.env.DATABASE_URL);
const perguntas = await sql`
  select enunciado, alternativas, correta, explicacao, versiculo
    from perguntas where ativa order by id
`;

const linhas = [];
perguntas.forEach((p, i) => {
  const n = String(i + 1).padStart(3, "0");
  const resposta = String(p.alternativas[p.correta]);
  linhas.push(
    `=============== ${n} — ${resposta} ===============`,
    ``,
    `${p.enunciado}`,
    ``,
    `Responde nos comentários antes de ver o final 👇`,
    ``,
    `${p.explicacao}`,
    `📖 ${p.versiculo}`,
    ``,
    `Tem mais ${perguntas.length - 1} perguntas como essa no Semeia, de graça e sem cadastro. Link na bio.`,
    ``,
    TAGS[i % TAGS.length],
    ``,
    ``,
  );
});

writeFileSync("reels/LEGENDAS.txt", linhas.join("\n"));
console.log(`reels/LEGENDAS.txt — ${perguntas.length} legendas`);
