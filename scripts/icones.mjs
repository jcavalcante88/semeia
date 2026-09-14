/**
 * Gera a arte do Semeia a partir de `arte/pomba.png`.
 *
 * Origem: icone "peace pigeon" do Icons8 (id kYqbEzjS6EBh). A licenca
 * gratuita exige link de volta para o Icons8 — o credito esta no rodape da
 * lateral direita e na pagina de ajustes. Trocando a arte, tire o credito.
 *
 * A pomba ja olha para a direita e ja e branca com o ramo verde, entao aqui
 * nao ha espelhamento nem recoloracao: so recorte e composicao.
 *
 * `arte/pomba-flaticon-antiga.png` e a arte anterior, guardada caso voce
 * queira voltar. Ela nao e usada por este script.
 *
 * Rodar:  node scripts/icones.mjs
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const POMBA = "arte/pomba.png";
// Fundo do icone: o ouro do tema. A pomba e branca, entao o ouro escuro
// garante contraste — ouro claro deixaria a pomba sumir.
const FUNDO = "#B8860F";

/** Pomba sobre quadrado pinho, dentro da area segura do icone maskable. */
async function iconeApp(lado) {
  const interno = Math.round(lado * 0.68);
  return sharp({
    create: { width: lado, height: lado, channels: 4, background: FUNDO },
  })
    .composite([
      {
        input: await sharp(POMBA).resize(interno, interno, { fit: "contain" }).toBuffer(),
        gravity: "center",
      },
    ])
    .png()
    .toBuffer();
}

/**
 * O badge do Android usa so o canal alfa: qualquer cor vira branco. Por isso
 * a pomba vai achatada em branco puro, senao o ramo verde some e o bico
 * vermelho vira mancha.
 */
async function badge(lado) {
  const { data, info } = await sharp(POMBA)
    .resize(lado, lado, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const branco = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    branco[i] = 255;
    branco[i + 1] = 255;
    branco[i + 2] = 255;
    branco[i + 3] = data[i + 3];
  }
  return sharp(branco, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

/**
 * Cartao de compartilhamento (Open Graph), 1200x630.
 *
 * E o que aparece no WhatsApp, Instagram, Facebook e na previa do link em
 * qualquer lugar. Fundo dourado, pomba a esquerda, nome e frase a direita.
 *
 * O texto e desenhado como SVG porque o arquivo e gerado aqui, na minha
 * maquina, e vira PNG versionado — nao depende de fonte instalada no
 * servidor da Vercel.
 */
async function cartaoCompartilhamento() {
  const L = 1200;
  const A = 630;

  const texto = `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${A}">
    <defs>
      <linearGradient id="ouro" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#E8B43A"/>
        <stop offset="55%" stop-color="#C28F1E"/>
        <stop offset="100%" stop-color="#9A6B10"/>
      </linearGradient>
    </defs>
    <rect width="${L}" height="${A}" fill="url(#ouro)"/>
    <!-- clarao de luz atras da pomba, lembrando o sol da cidade dourada -->
    <circle cx="330" cy="315" r="250" fill="#FFF6DC" opacity="0.22"/>
    <text x="600" y="300" font-family="Georgia, serif" font-size="104"
          font-weight="bold" fill="#FFFDF8">Semeia</text>
    <text x="604" y="368" font-family="Georgia, serif" font-size="35"
          fill="#FFF4D8">Um versículo por dia e um quiz</text>
    <text x="604" y="416" font-family="Georgia, serif" font-size="35"
          fill="#FFF4D8">para conhecer a Bíblia</text>
    <text x="604" y="486" font-family="Georgia, serif" font-size="25"
          fill="#FFEFC4" opacity="0.85">Sem cadastro. Sem senha.</text>
  </svg>`;

  return sharp(Buffer.from(texto))
    .composite([
      {
        input: await sharp(POMBA).resize(420, 420, { fit: "contain" }).toBuffer(),
        top: 105,
        left: 120,
      },
    ])
    .png()
    .toBuffer();
}

const saidas = [
  // usada no cabecalho das laterais, dentro do selo pinho (2x para retina)
  ["public/pomba.png", await sharp(POMBA).resize(160, 160, { fit: "contain" }).png().toBuffer()],
  ["public/icone-192.png", await iconeApp(192)],
  ["public/icone-512.png", await iconeApp(512)],
  ["public/badge.png", await badge(96)],

  // Convencoes de arquivo do App Router: o Next monta as tags <link> e as
  // meta de Open Graph sozinho a partir destes nomes, dentro de src/app.
  ["src/app/icon.png", await iconeApp(256)], // favicon da aba e da Vercel
  ["src/app/apple-icon.png", await iconeApp(180)], // tela de inicio do iPhone
  ["src/app/opengraph-image.png", await cartaoCompartilhamento()], // WhatsApp
  ["src/app/twitter-image.png", await cartaoCompartilhamento()],
];

for (const [caminho, buffer] of saidas) {
  writeFileSync(caminho, buffer);
  console.log(`${caminho}  ${buffer.length} bytes`);
}
