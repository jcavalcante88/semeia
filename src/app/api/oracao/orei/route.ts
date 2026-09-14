import { sql } from "@/lib/db";
import { usuarioAtual } from "@/lib/sessao";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * Registra "orei por voce".
 *
 * A chave primaria (usuario_id, pedido_id) e a trava: clicar de novo nao
 * infla o contador. Mesma ideia da regra de uma tentativa por pergunta —
 * a garantia mora no banco, nao no JavaScript.
 */
export async function POST(req: Request) {
  const uid = await usuarioAtual();
  if (!uid) {
    return Response.json(
      { erro: "Escolha um nome antes de orar por alguém." },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const pedidoId = Number(body.pedidoId);
  if (!Number.isInteger(pedidoId)) {
    return Response.json({ erro: "Dados invalidos." }, { status: 400 });
  }

  try {
    await sql`
      insert into oracoes (usuario_id, pedido_id)
      values (${uid}::uuid, ${pedidoId})
      on conflict do nothing
    `;

    const [c] = await sql`
      select count(*)::int as total from oracoes where pedido_id = ${pedidoId}
    `;
    return Response.json(
      { ok: true, oracoes: c?.total ?? 0 },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ erro: "Nao foi possivel registrar agora." }, { status: 503 });
  }
}
