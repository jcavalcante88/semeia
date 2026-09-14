import { sql } from "@/lib/db";
import { usuarioAtual } from "@/lib/sessao";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * As perguntas que a pessoa errou, com a explicação e o versículo.
 *
 * Aqui `correta` e `explicacao` PODEM sair do servidor, e isso não viola a
 * regra de ouro: o filtro é `acertou = false` pelo usuário do cookie, ou
 * seja, só volta pergunta que aquela pessoa já respondeu e já perdeu. Pela
 * trava de tentativa única, ela nunca mais pontua com essas — não há nada
 * a ganhar sabendo o gabarito delas.
 */
export async function GET() {
  const uid = await usuarioAtual();
  if (!uid) return Response.json({ erros: [] });

  try {
    const linhas = await sql`
      select p.id,
             p.enunciado,
             p.alternativas,
             p.correta,
             p.explicacao,
             p.versiculo,
             p.nivel,
             r.respondida_em
        from respostas r
        join perguntas p on p.id = r.pergunta_id
       where r.usuario_id = ${uid}::uuid
         and r.acertou = false
       order by r.respondida_em desc
       limit 50
    `;
    return Response.json(
      { erros: linhas },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ erro: "Nao foi possivel carregar agora." }, { status: 503 });
  }
}
