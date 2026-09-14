import { sql } from "@/lib/db";
import { usuarioAtual } from "@/lib/sessao";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * Quantos dias seguidos a pessoa respondeu alguma pergunta.
 *
 * A conta e feita no Postgres, no fuso de Sao Paulo — a mesma regra do
 * ranking semanal. Em JavaScript, quem abrisse o app a meia-noite e meia
 * veria o dia errado.
 *
 * O truque e classico: subtrair de cada dia a sua posicao na lista. Dias
 * consecutivos viram todos a mesma data, e agrupar por ela dá os blocos.
 *
 * Nao existe tabela nova: tudo sai de `respostas.respondida_em`.
 */
export async function GET() {
  const uid = await usuarioAtual();
  if (!uid) return Response.json({ sequencia: 0, hoje: false });

  try {
    const [r] = await sql`
      with dias as (
        select distinct (respondida_em at time zone 'America/Sao_Paulo')::date as dia
          from respostas
         where usuario_id = ${uid}::uuid
      ),
      blocos as (
        select dia,
               dia - (row_number() over (order by dia))::int as bloco
          from dias
      ),
      atual as (
        select max(dia) as ultimo, count(*)::int as tamanho
          from blocos
         group by bloco
         order by max(dia) desc
         limit 1
      )
      select tamanho,
             ultimo,
             (now() at time zone 'America/Sao_Paulo')::date as hoje
        from atual
    `;

    if (!r) return Response.json({ sequencia: 0, hoje: false });

    const hoje = String(r.hoje);
    const ultimo = String(r.ultimo);

    // A sequência só vale se o último dia foi hoje ou ontem. Mais velho que
    // isso já está quebrada — e aí simplesmente não mostramos nada, em vez
    // de anunciar que a pessoa perdeu alguma coisa.
    const ontem = new Date(`${hoje}T00:00:00Z`);
    ontem.setUTCDate(ontem.getUTCDate() - 1);
    const viva = ultimo === hoje || ultimo === ontem.toISOString().slice(0, 10);

    return Response.json(
      {
        sequencia: viva ? Number(r.tamanho) : 0,
        hoje: ultimo === hoje,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    // Sequência é enfeite: se falhar, a tela some e o quiz segue igual.
    return Response.json({ sequencia: 0, hoje: false });
  }
}
