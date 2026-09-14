import { sql } from "@/lib/db";
import { usuarioAtual } from "@/lib/sessao";

export const runtime = "edge";

/** Guarda a inscricao de push que o navegador acabou de gerar. */
export async function POST(req: Request) {
  const uid = await usuarioAtual();
  if (!uid) return Response.json({ erro: "Sem perfil." }, { status: 401 });

  const { endpoint, keys, horarios } = await req.json();
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return Response.json({ erro: "Inscricao incompleta." }, { status: 400 });
  }

  await sql`
    insert into inscricoes_push (usuario_id, endpoint, p256dh, auth)
    values (${uid}::uuid, ${endpoint}, ${keys.p256dh}, ${keys.auth})
    on conflict (endpoint) do update set usuario_id = excluded.usuario_id
  `;

  if (Array.isArray(horarios) && horarios.length) {
    await sql`
      update preferencias set horarios = ${horarios}, ativo = true
       where usuario_id = ${uid}::uuid
    `;
  }

  return Response.json({ ok: true });
}

/** Desligar as mensagens. */
export async function DELETE(req: Request) {
  const uid = await usuarioAtual();
  if (!uid) return Response.json({ erro: "Sem perfil." }, { status: 401 });

  const { endpoint } = await req.json().catch(() => ({ endpoint: null }));
  if (endpoint) {
    await sql`delete from inscricoes_push where endpoint = ${endpoint}`;
  } else {
    await sql`delete from inscricoes_push where usuario_id = ${uid}::uuid`;
  }
  return Response.json({ ok: true });
}
