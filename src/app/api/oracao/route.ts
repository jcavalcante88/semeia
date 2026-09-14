import { sql } from "@/lib/db";
import { usuarioAtual } from "@/lib/sessao";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/** Quantas horas uma pessoa espera entre um pedido e o proximo. */
const INTERVALO_HORAS = 6;

/** Lista os pedidos recentes, com a contagem de oracoes. */
export async function GET() {
  const uid = await usuarioAtual();

  try {
    const linhas = await sql`
      select p.id,
             p.texto,
             p.criado_em,
             case when p.anonimo then null else u.apelido end as apelido,
             (select count(*) from oracoes o where o.pedido_id = p.id)::int as oracoes,
             exists (
               select 1 from oracoes o
                where o.pedido_id = p.id and o.usuario_id = ${uid}::uuid
             ) as ja_orei,
             (p.usuario_id = ${uid}::uuid) as meu
        from pedidos_oracao p
        join usuarios u on u.id = p.usuario_id
       where p.ativo
       order by p.criado_em desc
       limit 50
    `;
    return Response.json(
      { pedidos: linhas },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ erro: "Nao foi possivel carregar os pedidos." }, { status: 503 });
  }
}

/** Publica um pedido. */
export async function POST(req: Request) {
  const uid = await usuarioAtual();
  if (!uid) {
    return Response.json(
      { erro: "Escolha um nome antes de publicar um pedido." },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const texto = String(body.texto ?? "").trim();
  const anonimo = body.anonimo === false ? false : true;

  if (texto.length < 5 || texto.length > 400) {
    return Response.json(
      { erro: "Escreva entre 5 e 400 caracteres." },
      { status: 400 },
    );
  }

  try {
    // Limite de frequencia no banco, nao no navegador: e a unica trava que
    // nao se contorna abrindo o DevTools.
    const [recente] = await sql`
      select criado_em from pedidos_oracao
       where usuario_id = ${uid}::uuid
         and criado_em > now() - (${INTERVALO_HORAS} || ' hours')::interval
       order by criado_em desc
       limit 1
    `;
    if (recente) {
      return Response.json(
        {
          erro: `Você já publicou um pedido há pouco. Pode publicar outro daqui a ${INTERVALO_HORAS} horas.`,
        },
        { status: 429 },
      );
    }

    const [novo] = await sql`
      insert into pedidos_oracao (usuario_id, texto, anonimo)
      values (${uid}::uuid, ${texto}, ${anonimo})
      returning id
    `;
    return Response.json({ ok: true, id: novo.id }, { status: 201 });
  } catch {
    return Response.json({ erro: "Nao foi possivel publicar agora." }, { status: 503 });
  }
}

/** Apaga um pedido — so o proprio autor. */
export async function DELETE(req: Request) {
  const uid = await usuarioAtual();
  if (!uid) return Response.json({ erro: "Sem perfil." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const pedidoId = Number(body.pedidoId);
  if (!Number.isInteger(pedidoId)) {
    return Response.json({ erro: "Dados invalidos." }, { status: 400 });
  }

  try {
    // O `usuario_id = uid` no where e o que impede alguem apagar pedido alheio
    // mandando um id qualquer.
    const apagados = await sql`
      delete from pedidos_oracao
       where id = ${pedidoId} and usuario_id = ${uid}::uuid
      returning id
    `;
    if (!apagados.length) {
      return Response.json({ erro: "Pedido nao encontrado." }, { status: 404 });
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ erro: "Nao foi possivel apagar agora." }, { status: 503 });
  }
}
