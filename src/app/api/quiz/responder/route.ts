import { sql } from "@/lib/db";
import { PONTOS } from "@/lib/pontos";
import { usuarioAtual } from "@/lib/sessao";
import type { Resultado } from "@/lib/tipos";

export const runtime = "edge";

/**
 * Corrige a resposta NO SERVIDOR e grava a pontuacao.
 * Recebe apenas { perguntaId, escolha } - nada mais e confiavel.
 */
export async function POST(req: Request) {
  const uid = await usuarioAtual();
  if (!uid) {
    return Response.json(
      { erro: "Escolha um apelido antes de comecar." },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const perguntaId = Number(body.perguntaId);
  const escolha = Number(body.escolha);

  if (!Number.isInteger(perguntaId) || !Number.isInteger(escolha)) {
    return Response.json({ erro: "Dados invalidos." }, { status: 400 });
  }

  try {
    const [p] = await sql`
      select correta, explicacao, versiculo, nivel
        from perguntas
       where id = ${perguntaId} and ativa
    `;
    if (!p) {
      return Response.json({ erro: "Pergunta nao encontrada." }, { status: 404 });
    }

    const acertou = Number(p.correta) === escolha;
    const pontos = acertou ? PONTOS[p.nivel] : 0;

    // O `on conflict do nothing` e a trava: na segunda tentativa
    // da mesma pergunta nenhuma linha volta, e ninguem ganha ponto.
    const gravadas = await sql`
      insert into respostas (usuario_id, pergunta_id, acertou, pontos)
      values (${uid}::uuid, ${perguntaId}, ${acertou}, ${pontos})
      on conflict (usuario_id, pergunta_id) do nothing
      returning id
    `;
    const jaRespondida = gravadas.length === 0;

    const resultado: Resultado = {
      acertou,
      correta: Number(p.correta),
      explicacao: p.explicacao,
      versiculo: p.versiculo,
      pontos: jaRespondida ? 0 : pontos,
      jaRespondida,
    };

    return Response.json(resultado, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      { erro: "Nao foi possivel registrar a resposta." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
