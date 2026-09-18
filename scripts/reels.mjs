/**
 * Gera um Reels de 15 segundos por pergunta do banco.
 *
 * Por que isto existe: gravação de tela do app é o formato mais fraco no
 * Instagram — ninguém compartilha propaganda de aplicativo. Mas as pessoas
 * compartilham um versículo que as tocou. Então em vez de anunciar o Semeia,
 * publicamos o conteúdo que está DENTRO dele, uma pergunta por vídeo.
 *
 * Cada vídeo tem quatro cenas, e o texto é grande o bastante para ser lido
 * SEM SOM — que é como a maioria assiste.
 *
 * Rodar:  node scripts/reels.mjs [quantos]
 */
import sharp from "sharp";
import { neon } from "@neondatabase/serverless";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";

for (const l of readFileSync(".env.local", "utf8").split("\n")) {
  const m = l.match(/^([A-Z_]+)="(.*)"$/);
  if (m) process.env[m[1]] = m[2];
}

const L = 1080;
const A = 1920;
const SAIDA = "reels";
const TMP = "reels/.tmp";

const OURO_CLARO = "#F0CB63";
const OURO = "#C28F1E";
const OURO_ESCURO = "#7A5410";
const BRANCO = "#FFFDF8";
const VERDE = "#2E5C39";

/** Escapa o que quebraria o XML do SVG. */
const esc = (t) =>
  String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Quebra o texto em linhas.
 *
 * A largura é estimada pelo número de caracteres porque medir fonte de
 * verdade exigiria uma biblioteca — e para texto centralizado em caixa
 * larga a estimativa erra pouco.
 */
function quebrar(texto, porLinha) {
  const palavras = String(texto).split(/\s+/);
  const linhas = [];
  let atual = "";
  for (const p of palavras) {
    if ((atual + " " + p).trim().length > porLinha && atual) {
      linhas.push(atual.trim());
      atual = p;
    } else {
      atual = (atual + " " + p).trim();
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
}

/** Bloco de texto centralizado verticalmente em torno de `meio`. */
function blocoTexto(linhas, { meio, tamanho, cor, peso = "bold", familia = "Georgia, serif" }) {
  const alturaLinha = tamanho * 1.28;
  const topo = meio - ((linhas.length - 1) * alturaLinha) / 2;
  return linhas
    .map(
      (linha, i) =>
        `<text x="${L / 2}" y="${topo + i * alturaLinha}" text-anchor="middle"
           font-family="${familia}" font-size="${tamanho}" font-weight="${peso}"
           fill="${cor}">${esc(linha)}</text>`,
    )
    .join("");
}

const fundo = `
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="${OURO_CLARO}"/>
      <stop offset="55%" stop-color="${OURO}"/>
      <stop offset="100%" stop-color="${OURO_ESCURO}"/>
    </linearGradient>
    <radialGradient id="luz" cx="50%" cy="30%" r="55%">
      <stop offset="0%" stop-color="#FFF7DC" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#FFF7DC" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${L}" height="${A}" fill="url(#g)"/>
  <rect width="${L}" height="${A}" fill="url(#luz)"/>`;

async function cena(svgInterno, pomba) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${A}">
    ${fundo}${svgInterno}</svg>`;
  const base = sharp(Buffer.from(svg));
  if (!pomba) return base.png().toBuffer();
  return base
    .composite([
      {
        input: await sharp("arte/pomba.png").resize(pomba.tam, pomba.tam).toBuffer(),
        top: pomba.y,
        left: Math.round((L - pomba.tam) / 2),
      },
    ])
    .png()
    .toBuffer();
}

/** Rodapé com a marca, presente em todas as cenas. */
const marca = `
  <text x="${L / 2}" y="${A - 540}" text-anchor="middle" font-family="Georgia, serif"
        font-size="46" font-weight="bold" fill="${BRANCO}" opacity="0.95">Semeia</text>
  <text x="${L / 2}" y="${A - 485}" text-anchor="middle" font-family="Georgia, serif"
        font-size="32" fill="${BRANCO}" opacity="0.7">quiz bíblico · link na bio</text>`;

async function gerarReel(p, indice) {
  const resposta = String(p.alternativas[p.correta]);
  const cenas = [];

  // Texto longo encolhe a letra em vez de vazar para fora da tela. Sem isto,
  // uma explicacao de 300 caracteres passaria por cima do versiculo e da marca.
  const tamExp = p.explicacao.length > 220 ? 52 : p.explicacao.length > 150 ? 58 : 66;
  const porLinhaExp = p.explicacao.length > 220 ? 32 : p.explicacao.length > 150 ? 29 : 26;
  const tamPerg = p.enunciado.length > 90 ? 68 : p.enunciado.length > 60 ? 80 : 92;
  const porLinhaPerg = p.enunciado.length > 90 ? 26 : p.enunciado.length > 60 ? 23 : 20;

  // 1. Gancho — 1,5s. O primeiro segundo decide se a pessoa fica.
  cenas.push({
    dur: 1.5,
    img: await cena(
      blocoTexto(["VOCÊ SABE?"], { meio: 1180, tamanho: 118, cor: BRANCO }) + marca,
      { tam: 470, y: 560 },
    ),
  });

  // 2. A pergunta — 5s, tempo de ler e pensar.
  cenas.push({
    dur: 5,
    img: await cena(
      blocoTexto(quebrar(p.enunciado, porLinhaPerg), { meio: 830, tamanho: tamPerg, cor: BRANCO }) +
        blocoTexto(["· · ·"], { meio: 1200, tamanho: 90, cor: BRANCO }) +
        marca,
      null,
    ),
  });

  // 3. A resposta — 3s, grande, sozinha na tela.
  //
  // A resposta tanto pode ser uma palavra ("Gênesis") quanto uma frase inteira
  // ("Um camelo passar pelo fundo de uma agulha"). Com tamanho fixo a frase
  // passava por cima da pomba e do proprio rotulo "A resposta e", entao a
  // letra encolhe conforme o texto cresce.
  const tamResp =
    resposta.length > 34 ? 84 : resposta.length > 20 ? 104 : resposta.length > 13 ? 120 : 140;
  const porLinhaResp = resposta.length > 34 ? 18 : resposta.length > 20 ? 16 : 14;
  const linhasResp = quebrar(resposta, porLinhaResp);
  const alturaLinhaResp = tamResp * 1.28;

  // A primeira linha sempre na mesma altura: o bloco cresce para baixo, e o
  // rotulo acima dele nunca e alcancado.
  const meioResp = 780 + ((linhasResp.length - 1) * alturaLinhaResp) / 2;
  const ultimaResp = 780 + (linhasResp.length - 1) * alturaLinhaResp;

  // A pomba so entra se couber inteira entre o texto e a marca (y 1380).
  // Resposta de quatro linhas simplesmente nao tem espaco, e tudo bem.
  const folga = 1340 - (ultimaResp + 60);
  const pombaResp = folga >= 200 ? { tam: Math.min(280, Math.round(folga)), y: Math.round(ultimaResp + 60) } : null;

  cenas.push({
    dur: 3,
    img: await cena(
      `<text x="${L / 2}" y="655" text-anchor="middle" font-family="Georgia, serif"
         font-size="52" fill="${BRANCO}" opacity="0.8">A resposta é</text>` +
        blocoTexto(linhasResp, { meio: meioResp, tamanho: tamResp, cor: BRANCO }) +
        marca,
      pombaResp,
    ),
  });

  // 4. A explicação e o versículo — 5,5s. É o que faz alguém compartilhar.
  cenas.push({
    dur: 5.5,
    img: await cena(
      blocoTexto(quebrar(p.explicacao, porLinhaExp), { meio: 820, tamanho: tamExp, cor: BRANCO }) +
        `<text x="${L / 2}" y="1250" text-anchor="middle" font-family="Georgia, serif"
           font-size="54" font-weight="bold" fill="${BRANCO}" opacity="0.92"
           letter-spacing="3">${esc(p.versiculo)}</text>` +
        marca,
      null,
    ),
  });

  mkdirSync(TMP, { recursive: true });
  const lista = [];
  cenas.forEach((c, i) => {
    const arq = `${TMP}/c${i}.png`;
    writeFileSync(arq, c.img);
    lista.push(`file 'c${i}.png'`, `duration ${c.dur}`);
  });
  // O concat demuxer ignora a duração do último item: repete o arquivo.
  lista.push(`file 'c${cenas.length - 1}.png'`);
  writeFileSync(`${TMP}/lista.txt`, lista.join("\n"));

  const nome = `${SAIDA}/${String(indice).padStart(3, "0")}-${resposta
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9]/g, "")
    .toLowerCase()}.mp4`;

  execFileSync(
    "ffmpeg",
    ["-v", "error", "-f", "concat", "-i", `${TMP}/lista.txt`,
     "-vf", "fps=30,format=yuv420p", "-c:v", "libx264", "-preset", "veryfast",
     "-crf", "20", "-t", "15", "-movflags", "+faststart", nome, "-y"],
    { stdio: "inherit" },
  );
  return nome;
}

const quantos = Number(process.argv[2]) || 1;
const sql = neon(process.env.DATABASE_URL);
const perguntas = await sql`
  select enunciado, alternativas, correta, explicacao, versiculo
    from perguntas where ativa order by id limit ${quantos}
`;

mkdirSync(SAIDA, { recursive: true });
for (const [i, p] of perguntas.entries()) {
  console.log(await gerarReel(p, i + 1));
}
rmSync(TMP, { recursive: true, force: true });
