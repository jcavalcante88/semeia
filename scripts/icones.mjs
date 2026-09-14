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

const saidas = [
  // usada no cabecalho das laterais, dentro do selo pinho (2x para retina)
  ["public/pomba.png", await sharp(POMBA).resize(160, 160, { fit: "contain" }).png().toBuffer()],
  ["public/icone-192.png", await iconeApp(192)],
  ["public/icone-512.png", await iconeApp(512)],
  ["public/badge.png", await badge(96)],
];

for (const [caminho, buffer] of saidas) {
  writeFileSync(caminho, buffer);
  console.log(`${caminho}  ${buffer.length} bytes`);
}
