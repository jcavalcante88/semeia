import { sql } from "@/lib/db";
import { lerRss } from "@/lib/rss";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Quantos itens mais recentes guardar por feed em cada coleta. */
const POR_FONTE = 20;

/**
 * Coleta as noticias dos feeds cadastrados em `fontes_noticias`.
 *
 * Guarda apenas titulo, resumo curto e link de volta para a fonte — que e a
 * forma legal de agregar RSS. Copiar a materia inteira seria violacao de
 * direito autoral, entao o texto completo fica sempre no site de origem.
 *
 * Roda uma vez por dia pelo GitHub Actions, com o mesmo CRON_SECRET das
 * mensagens. Um feed fora do ar nao derruba os outros.
 */
export async function POST(req: Request) {
  const esperado = `Bearer ${process.env.CRON_SECRET}`;
  if (req.headers.get("authorization") !== esperado) {
    return new Response("Nao autorizado", { status: 401 });
  }

  let fontes: Record<string, any>[];
  try {
    fontes = await sql`select nome, url from fontes_noticias where ativa`;
  } catch {
    return Response.json({ erro: "Banco indisponivel." }, { status: 503 });
  }

  const relatorio: Record<string, string> = {};
  let novas = 0;

  for (const fonte of fontes) {
    try {
      const resposta = await fetch(fonte.url, {
        headers: { "User-Agent": "Semeia/1.0 (+https://github.com)" },
        signal: AbortSignal.timeout(15000),
        cache: "no-store",
      });
      if (!resposta.ok) {
        relatorio[fonte.nome] = `HTTP ${resposta.status}`;
        continue;
      }

      const itens = lerRss(await resposta.text()).slice(0, POR_FONTE);
      let gravadas = 0;

      for (const item of itens) {
        // `on conflict (link)` e a trava contra repetir a mesma materia.
        const linhas = await sql`
          insert into noticias (titulo, resumo, link, fonte, imagem, publicado_em)
          values (
            ${item.titulo}, ${item.resumo}, ${item.link}, ${fonte.nome},
            ${item.imagem},
            ${item.publicadoEm ? item.publicadoEm.toISOString() : null}
          )
          on conflict (link) do update
            -- so preenche a imagem de materias antigas que entraram sem ela
            set imagem = coalesce(noticias.imagem, excluded.imagem)
          returning id, (xmax = 0) as inserida
        `;
        // Com `do update` toda linha volta um id, inclusive a que ja existia.
        // `xmax = 0` e o jeito do Postgres de dizer "esta foi inserida agora".
        if (linhas[0]?.inserida) gravadas++;
      }

      novas += gravadas;
      relatorio[fonte.nome] = `${itens.length} lidas, ${gravadas} novas`;
    } catch (e: any) {
      // Feed fora do ar, XML quebrado ou dominio trocado: registra e segue.
      relatorio[fonte.nome] = `falhou: ${e?.message ?? "erro"}`;
    }
  }

  return Response.json({ novas, fontes: relatorio });
}
