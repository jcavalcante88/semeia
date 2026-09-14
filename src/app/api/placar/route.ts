import { sql } from "@/lib/db";
import { usuarioAtual } from "@/lib/sessao";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * O placar geral da pessoa: quanto ela acertou desde que começou.
 *
 * Existe para o card de compartilhamento poder ser gerado a qualquer
 * momento, e não só no fim de uma rodada de 25 perguntas.
 */
export async function GET() {
  const uid = await usuarioAtual();
  if (!uid) return Response.json({ acertos: 0, total: 0, pontos: 0 });

  try {
    const [r] = await sql`
      select count(*) filter (where acertou)::int as acertos,
             count(*)::int                        as total,
             coalesce(sum(pontos), 0)::int        as pontos
        from respostas
       where usuario_id = ${uid}::uuid
    `;
    return Response.json(
      {
        acertos: r?.acertos ?? 0,
        total: r?.total ?? 0,
        pontos: r?.pontos ?? 0,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ acertos: 0, total: 0, pontos: 0 });
  }
}
