/**
 * Desenha os quadros biblicos do quebra-cabeca deslizante.
 *
 * Por que e desenhado por codigo: nao da para baixar arte da internet daqui
 * (o servidor de arquivos do Wikimedia recusa), e arte de terceiros ainda
 * traria licenca para administrar. Aqui tudo e original e nosso.
 *
 * Por que e chapado, sem sombra nem textura: a imagem vai ser cortada em 16
 * pecas e embaralhada. Quem joga precisa bater o olho numa peca e saber onde
 * ela encaixa. Pintura detalhada vira dezesseis quadrados parecidos; forma
 * grande e cor solida, nao.
 *
 * Rodar:  node scripts/quadros.mjs [nome-do-quadro]
 *         node scripts/quadros.mjs            (todos)
 */
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { LISTA } from "./quadros-lista.mjs";

const L = 720;
const SAIDA = "public/quadros";

/* ------------------------------------------------------------------ */
/* Peças de cenário reaproveitadas por todos os quadros                */
/* ------------------------------------------------------------------ */

/** Céu em degradê. Cada quadro escolhe a hora do dia. */
function ceu(id, alto, baixo) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="${alto}"/><stop offset="100%" stop-color="${baixo}"/>
  </linearGradient>`;
}

/** Sol ou lua, com um halo suave. */
function astro(x, y, r, cor, halo) {
  return `<circle cx="${x}" cy="${y}" r="${r * 2.1}" fill="${halo}" opacity="0.35"/>
          <circle cx="${x}" cy="${y}" r="${r * 1.5}" fill="${halo}" opacity="0.45"/>
          <circle cx="${x}" cy="${y}" r="${r}" fill="${cor}"/>`;
}

/**
 * Pássaro: dois arcos. Simples de propósito — a esta escala, asa detalhada
 * vira borrão, e o traço limpo continua legível dentro de uma peça.
 */
function passaro(x, y, t, cor = "#3B2F17") {
  return `<path d="M ${x - t} ${y} q ${t / 2} ${-t * 0.7} ${t} 0 q ${t / 2} ${-t * 0.7} ${t} 0"
           fill="none" stroke="${cor}" stroke-width="${Math.max(2, t * 0.22)}"
           stroke-linecap="round" opacity="0.75"/>`;
}

function passaros(lista) {
  return lista.map(([x, y, t]) => passaro(x, y, t)).join("");
}

/** Nuvem de círculos sobrepostos. */
function nuvem(x, y, e, cor = "#FFFFFF", op = 0.75) {
  return `<g opacity="${op}" fill="${cor}">
    <ellipse cx="${x}" cy="${y}" rx="${e}" ry="${e * 0.52}"/>
    <ellipse cx="${x - e * 0.6}" cy="${y + e * 0.16}" rx="${e * 0.62}" ry="${e * 0.4}"/>
    <ellipse cx="${x + e * 0.66}" cy="${y + e * 0.18}" rx="${e * 0.56}" ry="${e * 0.36}"/>
  </g>`;
}

/** Morro: uma elipse bem larga cortada pela base da tela. */
function morro(cx, cy, rx, ry, cor) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${cor}"/>`;
}

/** Árvore de copa arredondada. */
function arvore(x, base, alt, copa, corCopa = "#4C7A45", corTronco = "#6B4A2B") {
  const t = alt * 0.12;
  return `<rect x="${x - t / 2}" y="${base - alt * 0.55}" width="${t}" height="${alt * 0.55}"
            fill="${corTronco}" rx="${t * 0.3}"/>
          <circle cx="${x}" cy="${base - alt * 0.62}" r="${copa}" fill="${corCopa}"/>
          <circle cx="${x - copa * 0.62}" cy="${base - alt * 0.45}" r="${copa * 0.66}" fill="${corCopa}"/>
          <circle cx="${x + copa * 0.62}" cy="${base - alt * 0.45}" r="${copa * 0.66}" fill="${corCopa}"/>`;
}

/** Palmeira, para os quadros do deserto e do Egito. */
function palmeira(x, base, alt, cor = "#3F6B3A") {
  const folhas = [-70, -35, 0, 35, 70]
    .map((a) => {
      const r = (a * Math.PI) / 180;
      const fx = x + Math.sin(r) * alt * 0.42;
      const fy = base - alt - Math.cos(r) * alt * 0.2;
      return `<path d="M ${x} ${base - alt} Q ${(x + fx) / 2} ${fy - alt * 0.16} ${fx} ${fy}"
               fill="none" stroke="${cor}" stroke-width="${alt * 0.075}" stroke-linecap="round"/>`;
    })
    .join("");
  return `<path d="M ${x} ${base} Q ${x - alt * 0.07} ${base - alt / 2} ${x} ${base - alt}"
           fill="none" stroke="#6B4A2B" stroke-width="${alt * 0.075}" stroke-linecap="round"/>${folhas}`;
}

/** Casa de vila: caixa, telhado e uma janela acesa. */
function casa(x, base, larg, cor = "#E8D6B0", telhado = "#9C4A3C") {
  const h = larg * 0.85;
  return `<rect x="${x - larg / 2}" y="${base - h}" width="${larg}" height="${h}" fill="${cor}"/>
          <path d="M ${x - larg * 0.62} ${base - h} L ${x} ${base - h - larg * 0.5} L ${x + larg * 0.62} ${base - h} Z" fill="${telhado}"/>
          <rect x="${x - larg * 0.16}" y="${base - h * 0.62}" width="${larg * 0.32}" height="${h * 0.34}" fill="#C28F1E"/>`;
}

/** Perna ou pata: trapezio com o casco/pe mais escuro na ponta. */
function perna(x, topo, comp, larg, cor, curva = 0, pe = "#3B2F17") {
  return `<path d="M ${x - larg / 2} ${topo} L ${x + larg / 2} ${topo}
             L ${x + larg / 2 + curva} ${topo + comp} L ${x - larg / 2 + curva} ${topo + comp} Z" fill="${cor}"/>
          <rect x="${x - larg * 0.66 + curva}" y="${topo + comp - larg * 0.26}"
             width="${larg * 1.32}" height="${larg * 0.5}" rx="${larg * 0.14}" fill="${pe}"/>`;
}

/**
 * Figura humana.
 *
 * Desenhada em pecas separadas — pernas, tunica, manto, bracos, cabeca — e
 * nao num contorno unico. A primeira versao usava um `path` so, com curvas,
 * e virava um borrao sem pernas: a 180 pixels por peca do quebra-cabeca,
 * silhueta fechada nao se le. Peca separada tem borda, e borda se enxerga.
 *
 * `bracos` recebe [anguloEsquerdo, anguloDireito] em graus, medidos a partir
 * do corpo para baixo — assim Davi levanta a funda e Golias segura a lanca.
 */
function pessoa(x, base, alt, tunica, manto, opts = {}) {
  const { pele = "#C99B6E", cabelo = "#4A3524", bracos = [25, 25], barba = false } = opts;
  const larg = alt * 0.3;
  const ombro = base - alt * 0.7;
  const quadril = base - alt * 0.36;
  const rCabeca = alt * 0.105;
  const cCabeca = ombro - rCabeca * 0.92;

  const braco = (lado, ang) => {
    const r = ((90 - ang) * Math.PI) / 180;
    const ox = x + lado * larg * 0.46;
    const oy = ombro + alt * 0.03;
    const fx = ox + lado * Math.cos(r) * alt * 0.3;
    const fy = oy + Math.sin(r) * alt * 0.3;
    return `<line x1="${ox}" y1="${oy}" x2="${fx}" y2="${fy}" stroke="${manto}"
              stroke-width="${alt * 0.085}" stroke-linecap="round"/>
            <circle cx="${fx}" cy="${fy}" r="${alt * 0.045}" fill="${pele}"/>`;
  };

  return `
    ${perna(x - larg * 0.2, quadril, base - quadril, larg * 0.26, tunica)}
    ${perna(x + larg * 0.2, quadril, base - quadril, larg * 0.26, tunica)}
    <path d="M ${x - larg / 2} ${ombro} L ${x + larg / 2} ${ombro}
             L ${x + larg * 0.6} ${quadril + alt * 0.05} L ${x - larg * 0.6} ${quadril + alt * 0.05} Z"
          fill="${tunica}"/>
    ${braco(-1, bracos[0])}${braco(1, bracos[1])}
    <path d="M ${x - larg * 0.54} ${ombro - alt * 0.02} L ${x + larg * 0.54} ${ombro - alt * 0.02}
             L ${x + larg * 0.44} ${quadril - alt * 0.02} L ${x - larg * 0.44} ${quadril - alt * 0.02} Z"
          fill="${manto}"/>
    <rect x="${x - larg * 0.09}" y="${cCabeca}" width="${larg * 0.18}" height="${rCabeca}" fill="${pele}"/>
    <circle cx="${x}" cy="${cCabeca}" r="${rCabeca}" fill="${pele}"/>
    <path d="M ${x - rCabeca} ${cCabeca - rCabeca * 0.12} a ${rCabeca} ${rCabeca} 0 0 1 ${rCabeca * 2} 0
             l 0 ${rCabeca * 0.2} l ${-rCabeca * 2} 0 Z" fill="${cabelo}"/>
    ${barba ? `<path d="M ${x - rCabeca * 0.72} ${cCabeca + rCabeca * 0.3}
             q ${rCabeca * 0.72} ${rCabeca * 1.5} ${rCabeca * 1.44} 0 Z" fill="${cabelo}"/>` : ""}`;
}

/**
 * Cavalo de perfil, virado para a direita.
 *
 * Quatro pernas visiveis, pescoco, cabeca, crina e cauda. A versao anterior
 * era uma elipse com um focinho colado e parecia uma foca.
 */
function cavalo(x, base, alt, cor, crina = "#E4E0D4") {
  const dorso = base - alt * 0.58;
  const rx = alt * 0.44;
  const ry = alt * 0.23;
  const larg = alt * 0.1;
  const comp = base - (dorso + ry * 0.4);
  return `
    ${perna(x - rx * 0.6, dorso + ry * 0.3, comp, larg, cor, -alt * 0.05)}
    ${perna(x + rx * 0.52, dorso + ry * 0.3, comp, larg, cor, alt * 0.04)}
    <ellipse cx="${x}" cy="${dorso}" rx="${rx}" ry="${ry}" fill="${cor}"/>
    ${perna(x - rx * 0.34, dorso + ry * 0.45, comp * 0.96, larg, cor, alt * 0.05)}
    ${perna(x + rx * 0.72, dorso + ry * 0.3, comp, larg, cor, -alt * 0.03)}
    <path d="M ${x + rx * 0.72} ${dorso - ry * 0.7} L ${x + rx * 1.18} ${dorso - alt * 0.56}
             L ${x + rx * 1.44} ${dorso - alt * 0.52} L ${x + rx * 1.06} ${dorso - ry * 0.2} Z" fill="${cor}"/>
    <path d="M ${x + rx * 1.14} ${dorso - alt * 0.6} L ${x + rx * 1.62} ${dorso - alt * 0.6}
             L ${x + rx * 1.66} ${dorso - alt * 0.44} L ${x + rx * 1.12} ${dorso - alt * 0.46} Z" fill="${cor}"/>
    <path d="M ${x + rx * 1.2} ${dorso - alt * 0.62} l ${alt * 0.02} ${-alt * 0.07} l ${alt * 0.05} ${alt * 0.06} Z" fill="${cor}"/>
    <circle cx="${x + rx * 1.3}" cy="${dorso - alt * 0.55}" r="${alt * 0.018}" fill="#3B2F17"/>
    <path d="M ${x + rx * 0.78} ${dorso - ry * 0.75} q ${alt * 0.1} ${-alt * 0.22} ${alt * 0.24} ${-alt * 0.26}
             l ${alt * 0.03} ${alt * 0.07} q ${-alt * 0.13} ${alt * 0.06} ${-alt * 0.18} ${alt * 0.22} Z" fill="${crina}"/>
    <path d="M ${x - rx * 0.96} ${dorso - ry * 0.5} q ${-alt * 0.16} ${alt * 0.16} ${-alt * 0.1} ${alt * 0.42}
             l ${alt * 0.08} ${alt * 0.01} q ${-alt * 0.01} ${-alt * 0.2} ${alt * 0.08} ${-alt * 0.34} Z" fill="${crina}"/>`;
}

/* ------------------------------------------------------------------ */
/* Os quadros                                                          */
/* ------------------------------------------------------------------ */

const QUADROS = {
  "davi-e-golias": {
    svg: () => `
      <defs>${ceu("c", "#F3CE74", "#FCF3DC")}</defs>
      <rect width="${L}" height="${L}" fill="url(#c)"/>
      ${astro(596, 118, 42, "#FFF6D0", "#FFE178")}
      ${nuvem(150, 104, 56)}${nuvem(404, 66, 38)}
      ${passaros([[236, 146, 17], [292, 178, 12], [650, 214, 14]])}
      ${morro(110, 452, 310, 122, "#CBB47F")}
      ${morro(612, 462, 290, 112, "#BCA36D")}
      <rect y="494" width="${L}" height="${L - 494}" fill="#A99062"/>
      <rect y="494" width="${L}" height="14" fill="#8E7749"/>
      ${arvore(76, 516, 140, 44, "#587F49")}
      ${palmeira(684, 508, 126)}
      ${casa(210, 470, 58)}${casa(282, 472, 44)}
      <!-- Golias: alto, armadura de bronze, lanca e escudo -->
      ${pessoa(516, 652, 300, "#8A5F12", "#B8860F", { bracos: [10, 60], barba: true, cabelo: "#3B2F17" })}
      <path d="M 486 448 l 60 0 l 0 -28 l -60 0 Z" fill="#EFC14E"/>
      <circle cx="516" cy="440" r="36" fill="#B8860F"/>
      <path d="M 480 440 a 36 36 0 0 1 72 0 l 0 8 l -72 0 Z" fill="#8A5F12"/>
      <path d="M 516 404 l 0 -34" stroke="#9C4A3C" stroke-width="8" stroke-linecap="round"/>
      <rect x="622" y="392" width="11" height="264" fill="#6B4A2B" rx="5"/>
      <path d="M 627 392 L 610 344 L 646 344 Z" fill="#8F8F8F"/>
      <ellipse cx="432" cy="556" rx="40" ry="52" fill="#9C4A3C"/>
      <ellipse cx="432" cy="556" rx="26" ry="34" fill="#C28F1E" opacity="0.7"/>
      <!-- Davi: pequeno, tunica clara, funda girando acima da cabeca -->
      ${pessoa(196, 652, 168, "#FFFDF8", "#C28F1E", { bracos: [150, 30] })}
      <path d="M 166 490 q 44 -56 104 -30" fill="none" stroke="#6B4A2B" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="272" cy="462" r="9" fill="#5F5F5F"/>
      <ellipse cx="360" cy="690" rx="230" ry="22" fill="#8E7749" opacity="0.45"/>`,
  },

  "arca-de-noe": {
    svg: () => `
      <defs>${ceu("c", "#8CC0E4", "#E8F4FB")}</defs>
      <rect width="${L}" height="${L}" fill="url(#c)"/>
      ${astro(150, 120, 40, "#FFF6D0", "#FFE79A")}
      <!-- Arco-iris -->
      <g fill="none" stroke-width="16" opacity="0.85">
        <path d="M 120 470 a 240 240 0 0 1 480 0" stroke="#C0392B"/>
        <path d="M 148 470 a 212 212 0 0 1 424 0" stroke="#E67E22"/>
        <path d="M 176 470 a 184 184 0 0 1 368 0" stroke="#EFC14E"/>
        <path d="M 204 470 a 156 156 0 0 1 312 0" stroke="#4C7A45"/>
        <path d="M 232 470 a 128 128 0 0 1 256 0" stroke="#3A6EA5"/>
      </g>
      ${nuvem(580, 130, 52)}${nuvem(300, 96, 38)}
      <rect y="470" width="${L}" height="${L - 470}" fill="#4E8FB8"/>
      <path d="M 0 500 q 90 -18 180 0 t 180 0 t 180 0 t 180 0 v 30 H 0 Z" fill="#6BA8CC" opacity="0.7"/>
      <path d="M 0 560 q 90 -18 180 0 t 180 0 t 180 0 t 180 0 v 40 H 0 Z" fill="#3E7CA3" opacity="0.6"/>
      <!-- Arca -->
      <g>
        <path d="M 210 590 L 250 486 L 510 486 L 550 590 Z" fill="#8B5E34"/>
        <rect x="250" y="486" width="260" height="14" fill="#6B4A2B"/>
        <rect x="286" y="404" width="188" height="84" fill="#A9743F"/>
        <path d="M 270 404 L 380 356 L 490 404 Z" fill="#6B4A2B"/>
        <rect x="318" y="430" width="34" height="40" fill="#3B2F17"/>
        <rect x="408" y="430" width="34" height="40" fill="#3B2F17"/>
      </g>
      <!-- Pomba com o ramo -->
      <g transform="translate(560 300)">
        <ellipse cx="0" cy="0" rx="34" ry="20" fill="#FFFFFF"/>
        <circle cx="28" cy="-12" r="13" fill="#FFFFFF"/>
        <path d="M -8 -6 q 22 -30 44 -6 q -22 12 -44 6 Z" fill="#F0EFEA"/>
        <path d="M -34 2 l -26 12 l 26 6 Z" fill="#FFFFFF"/>
        <circle cx="33" cy="-15" r="2.6" fill="#3B2F17"/>
        <path d="M 40 -10 l 12 4 l -12 4 Z" fill="#C28F1E"/>
        <path d="M 52 -6 q 16 -12 30 -2" fill="none" stroke="#4C7A45" stroke-width="4"/>
        <ellipse cx="86" cy="-12" rx="11" ry="6" fill="#4C7A45" transform="rotate(-25 86 -12)"/>
        <ellipse cx="74" cy="0" rx="10" ry="5" fill="#5A8F50" transform="rotate(20 74 0)"/>
      </g>
      ${passaros([[120, 220, 14], [170, 250, 11]])}`,
  },

  "cavaleiro-do-apocalipse": {
    svg: () => `
      <defs>${ceu("c", "#463C6B", "#E4924F")}</defs>
      <rect width="${L}" height="${L}" fill="url(#c)"/>
      ${astro(534, 214, 58, "#FFDF94", "#F0A65A")}
      ${nuvem(186, 142, 62, "#6C5C90", 0.7)}${nuvem(528, 90, 44, "#7C6CA0", 0.6)}
      ${passaros([[130, 224, 18], [192, 258, 13], [628, 296, 15]])}
      ${morro(80, 520, 320, 118, "#5C4A62")}
      ${morro(650, 536, 300, 108, "#6E5871")}
      <rect y="560" width="${L}" height="${L - 560}" fill="#8A6A55"/>
      <rect y="560" width="${L}" height="12" fill="#6E5240"/>
      ${arvore(70, 586, 150, 48, "#3C5744", "#463123")}
      ${arvore(672, 594, 112, 36, "#3C5744", "#463123")}
      ${cavalo(330, 640, 250, "#FFFDF8")}
      <!-- Cavaleiro sentado sobre o dorso, com coroa e arco -->
      ${pessoa(322, 512, 190, "#C28F1E", "#8A5F12", { bracos: [30, 120], barba: true })}
      <path d="M 300 386 l 7 -26 l 9 15 l 6 -21 l 6 21 l 9 -15 l 7 26 Z" fill="#EFC14E"/>
      <path d="M 392 376 q 46 52 4 106" fill="none" stroke="#6B4A2B" stroke-width="7" stroke-linecap="round"/>
      <path d="M 392 376 L 396 482" stroke="#FFFDF8" stroke-width="2.5"/>
      <ellipse cx="360" cy="666" rx="226" ry="22" fill="#6E5240" opacity="0.45"/>`,
  },
};

/* ------------------------------------------------------------------ */

async function desenhar(nome) {
  const q = QUADROS[nome];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${L}"
    viewBox="0 0 ${L} ${L}">${q.svg()}</svg>`;
  mkdirSync(SAIDA, { recursive: true });
  const arq = `${SAIDA}/${nome}.png`;
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(arq);
  return arq;
}

const pedido = process.argv[2];
const nomes = pedido ? [pedido] : Object.keys(QUADROS);
for (const n of nomes) console.log(await desenhar(n));

// O JSON cobre a lista INTEIRA, desenhos e imagens. Antes ele saia so dos
// quadros desenhados e os importados nao apareciam no jogo.
writeFileSync(
  "src/lib/quadros.json",
  JSON.stringify(
    LISTA.map(({ nome, titulo, versiculo, significado }) => ({ nome, titulo, versiculo, significado })),
    null,
    2,
  ) + String.fromCharCode(10),
);
console.log("src/lib/quadros.json");

export { QUADROS };
