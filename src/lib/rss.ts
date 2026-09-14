/**
 * Leitor de RSS 2.0 sem dependencia externa.
 *
 * Os feeds gospel brasileiros sao WordPress ou parecidos: RSS 2.0 simples,
 * com CDATA no titulo e na descricao. Nao vale instalar um parser de XML
 * inteiro para isso — e nao quebra a regra de nao instalar pacote novo.
 *
 * Se um dia algum feed virar Atom ou JSON Feed, este arquivo e o unico
 * lugar a mexer.
 */

export type ItemRss = {
  titulo: string;
  link: string;
  resumo: string;
  imagem: string | null;
  publicadoEm: Date | null;
};

/**
 * Tira CDATA, tags HTML e normaliza espacos.
 *
 * A ordem importa. O Guiame nao usa CDATA: ele escapa o HTML como
 * `&lt;a href=...&gt;`. Removendo as tags antes de decodificar, nada e
 * removido — e a decodificacao recria as tags no resultado final.
 * Por isso decodifica, remove, e decodifica de novo (o segundo passe
 * cobre entidades que estavam duplamente escapadas, tipo `&amp;lt;`).
 */
function limpar(bruto: string): string {
  const semCdata = bruto.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  const semEntidades = decodificar(semCdata);
  const semTags = semEntidades
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ");
  return decodificar(semTags).replace(/\s+/g, " ").trim();
}

const ENTIDADES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  laquo: "«",
  raquo: "»",
  // aspas tipograficas: aparecem em praticamente toda manchete com citacao
  ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’",
  bdquo: "„", sbquo: "‚",
  bull: "•", middot: "·", deg: "°", copy: "©", reg: "®", trade: "™",
  aacute: "á", eacute: "é", iacute: "í", oacute: "ó", uacute: "ú",
  atilde: "ã", otilde: "õ", ccedil: "ç",
  acirc: "â", ecirc: "ê", ocirc: "ô", agrave: "à",
};

function decodificar(texto: string): string {
  return texto
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (todo, nome) => ENTIDADES[nome.toLowerCase()] ?? todo);
}

/** Pega o conteudo da primeira ocorrencia de uma tag dentro do bloco. */
function campo(bloco: string, tag: string): string {
  const m = bloco.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? m[1] : "";
}

/**
 * Procura a imagem da materia, nesta ordem:
 *  1. <enclosure type="image/..."> — o jeito oficial do RSS (Guiame usa)
 *  2. <media:content> / <media:thumbnail> — extensao Media RSS
 *  3. o primeiro <img src> dentro da descricao (Gospelmais so tem isso)
 *
 * O feed do Guiame escapa o HTML, entao a busca no passo 3 aceita tanto
 * `<img src="...">` quanto `&lt;img src=&quot;...&quot;&gt;`.
 */
function acharImagem(bloco: string): string | null {
  const enc = bloco.match(/<enclosure[^>]*\burl=["']([^"']+)["'][^>]*>/i);
  if (enc && /image\/|\.(jpe?g|png|webp|gif)/i.test(enc[0])) return enc[1];

  const media = bloco.match(/<media:(?:content|thumbnail)[^>]*\burl=["']([^"']+)["']/i);
  if (media) return media[1];

  const desc = decodificar(bloco.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1"));
  const img = desc.match(/<img[^>]*\bsrc=["']([^"']+)["']/i);
  if (img) return img[1];

  return null;
}

export function lerRss(xml: string): ItemRss[] {
  const blocos = xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi) ?? [];

  return blocos
    .map((bloco): ItemRss | null => {
      const titulo = limpar(campo(bloco, "title"));

      // Alguns feeds poem o link so no <guid isPermaLink="true">.
      let link = limpar(campo(bloco, "link"));
      if (!link) {
        const guid = campo(bloco, "guid");
        if (/^https?:\/\//i.test(limpar(guid))) link = limpar(guid);
      }

      if (!titulo || !/^https?:\/\//i.test(link)) return null;

      // O Guiame publica os links em http://. Como o Semeia roda em https,
      // sair para http gera aviso de conexao insegura no navegador.
      link = link.replace(/^http:\/\//i, "https://");

      const resumo = limpar(campo(bloco, "description")).slice(0, 400);
      const data = campo(bloco, "pubDate") || campo(bloco, "dc:date");
      const quando = data ? new Date(limpar(data)) : null;

      const imagem = acharImagem(bloco);

      return {
        titulo: titulo.slice(0, 300),
        link,
        resumo,
        // mesma regra do link: nada de http:// numa pagina https
        imagem: imagem ? imagem.replace(/^http:\/\//i, "https://").slice(0, 500) : null,
        publicadoEm: quando && !isNaN(quando.getTime()) ? quando : null,
      };
    })
    .filter((x): x is ItemRss => x !== null);
}
