import { sql } from "@/lib/db";
import { usuarioAtual } from "@/lib/sessao";
import webpush from "web-push";

// nodejs, e nao edge, porque `web-push` nao roda no edge (regra 7).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Em quantas orações avisar o autor do pedido.
 *
 * Avisar a cada clique viraria spam: um pedido popular acordaria a pessoa
 * trinta vezes numa tarde. Nos marcos, cada aviso é notícia de verdade.
 */
const MARCOS = new Set([1, 3, 10, 25, 50, 100]);

function configurarVapid() {
  const { VAPID_SUBJECT, NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;
  if (!VAPID_SUBJECT || !NEXT_PUBLIC_VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return false;
  webpush.setVapidDetails(VAPID_SUBJECT, NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  return true;
}

/**
 * Avisa o autor de que oraram por ele.
 *
 * Nada aqui pode derrubar o "orei": o gesto da pessoa que orou já foi
 * registrado, e uma falha de notificação é problema de outro. Por isso tudo
 * roda dentro de try/catch e o erro é engolido de propósito.
 */
async function avisarAutor(pedidoId: number, quemOrou: string, total: number) {
  try {
    if (!MARCOS.has(total) || !configurarVapid()) return;

    const [pedido] = await sql`
      select usuario_id, texto from pedidos_oracao where id = ${pedidoId} and ativo
    `;
    if (!pedido) return;

    // Orar pelo próprio pedido não gera aviso para si mesmo.
    if (pedido.usuario_id === quemOrou) return;

    const inscricoes = await sql`
      select endpoint, p256dh, auth from inscricoes_push
       where usuario_id = ${pedido.usuario_id}::uuid
    `;
    if (!inscricoes.length) return;

    const carga = JSON.stringify({
      titulo: total === 1 ? "Alguém orou por você" : `${total} pessoas oraram por você`,
      corpo: String(pedido.texto).slice(0, 120),
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/oracao`,
    });

    for (const ins of inscricoes) {
      try {
        await webpush.sendNotification(
          { endpoint: ins.endpoint, keys: { p256dh: ins.p256dh, auth: ins.auth } },
          carga,
        );
      } catch (e: any) {
        if (e?.statusCode === 404 || e?.statusCode === 410) {
          await sql`delete from inscricoes_push where endpoint = ${ins.endpoint}`;
        }
      }
    }
  } catch {
    // silêncio de propósito: ver acima
  }
}

/**
 * Registra "orei por você".
 *
 * A chave primária (usuario_id, pedido_id) é a trava: clicar de novo não
 * infla o contador. Mesma ideia da regra de uma tentativa por pergunta —
 * a garantia mora no banco, não no JavaScript.
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
    // `xmax = 0` distingue uma inserção nova de um clique repetido: só a
    // primeira vez conta para o marco de notificação.
    const gravadas = await sql`
      insert into oracoes (usuario_id, pedido_id)
      values (${uid}::uuid, ${pedidoId})
      on conflict do nothing
      returning (xmax = 0) as inserida
    `;

    const [c] = await sql`
      select count(*)::int as total from oracoes where pedido_id = ${pedidoId}
    `;
    const total = c?.total ?? 0;

    if (gravadas.length) await avisarAutor(pedidoId, uid, total);

    return Response.json(
      { ok: true, oracoes: total },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ erro: "Nao foi possivel registrar agora." }, { status: 503 });
  }
}
