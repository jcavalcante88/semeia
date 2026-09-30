import { sql } from "@/lib/db";
import Carrossel, { type Cartao } from "./Carrossel";

/** Quantos cartões o carrossel mostra. */
const QUANTOS = 15;

/**
 * Monta os destaques da tela inicial: shows que ainda vão acontecer, e
 * depois as notícias mais recentes.
 *
 * Os shows vêm primeiro de propósito — notícia envelhece devagar, show tem
 * data e passa. E vêm em número limitado: o carrossel não pode virar só
 * agenda, senão quem entra para ler alguma coisa não encontra nada.
 *
 * É componente de servidor: a consulta acontece no render, sem `fetch` no
 * navegador e sem o carrossel piscar vazio antes de carregar.
 */
export default async function DestaquesNaHome() {
  const cartoes: Cartao[] = [];

  try {
    /*
     * Shows que ainda vão acontecer. A tabela nasce vazia e só recebe evento
     * de verdade, escrito à mão — nenhum feed RSS traz agenda, e show
     * inventado aparece na tela com data e endereço, com gente podendo sair
     * de casa por causa dele.
     *
     * Sem evento nenhum, o carrossel mostra só notícia. Ele não quebra.
     */
    const eventos = await sql`
      select id, titulo, artista, local, cidade, uf, link,
             -- O Postgres faz a conta de fuso (regra 3), e já devolve pronto
             -- para a tela: "sábado, 4 de outubro, 19h30".
             to_char(quando at time zone 'America/Sao_Paulo', 'DD/MM') as dia,
             to_char(quando at time zone 'America/Sao_Paulo', 'HH24"h"MI') as hora
        from eventos
       where ativo
         and quando >= now()
       order by quando
       limit 5
    `;

    for (const e of eventos) {
      cartoes.push({
        tipo: "evento",
        id: String(e.id),
        titulo: e.titulo,
        artista: e.artista,
        quando: `${e.dia} às ${String(e.hora).replace(/h00$/, "h")}`,
        onde: [e.local, e.cidade, e.uf].filter(Boolean).join(" · "),
        link: e.link,
      });
    }

    const noticias = await sql`
      select id, titulo, resumo, imagem, fonte, link
        from noticias
       where ativa
       order by coalesce(publicado_em, coletado_em) desc
       limit ${QUANTOS}
    `;

    for (const n of noticias) {
      if (cartoes.length >= QUANTOS) break;
      cartoes.push({
        tipo: "noticia",
        id: String(n.id),
        titulo: n.titulo,
        resumo: n.resumo,
        imagem: n.imagem,
        fonte: n.fonte,
        link: n.link,
      });
    }
  } catch {
    // Sem banco, o carrossel não aparece. A porta de entrada do app não pode
    // cair por causa de um bloco de destaques.
    return null;
  }

  return <Carrossel cartoes={cartoes} />;
}
