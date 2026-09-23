import { sql } from "@/lib/db";
import { usuarioAtual } from "@/lib/sessao";
import type { PerguntaPublica } from "@/lib/tipos";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * Quantas perguntas entram numa rodada.
 *
 * Ninguem precisa terminar: cada resposta e gravada na hora, entao sair no
 * meio nao perde nada. Uma rodada maior e so um estoque maior antes de
 * precisar voltar a tela inicial.
 */
const POR_RODADA = 50;

/**
 * Sorteia ate 50 perguntas que a pessoa ainda nao respondeu.
 *
 * O `order by random()` e o que faz a rodada variar: mesmo com o mesmo
 * conjunto no banco, duas rodadas nunca vem na mesma ordem, e a pessoa
 * nunca reve uma pergunta que ja respondeu.
 *
 * REGRA DE OURO: o select abaixo NAO tem `correta` nem `explicacao`.
 * Se um dia voce adicionar esses campos aqui, o ranking inteiro
 * vira ficcao - basta abrir o DevTools para gabaritar.
 */
export async function GET() {
  const uid = await usuarioAtual();

  try {
    const linhas = await sql`
      select p.id, p.enunciado, p.alternativas, p.nivel
        from perguntas p
       where p.ativa
         and (
           ${uid}::uuid is null
           or not exists (
             select 1 from respostas r
              where r.pergunta_id = p.id
                and r.usuario_id = ${uid}::uuid
           )
         )
       order by
         /*
          * Quem ja viu a pergunta no desafio do dia vai encontra-la por
          * ultimo aqui — mas ela CONTINUA na fila. Excluir seria tirar
          * pontos de quem joga o desafio, e o desafio nao pode custar nada.
          *
          * false vem antes de true no Postgres, entao o que a pessoa ainda
          * nao viu sobe. Com 300 perguntas e 50 por rodada, na pratica a
          * repetida so aparece quando o resto ja acabou.
          */
         exists (
           select 1 from desafio_respostas d
            where d.pergunta_id = p.id
              and d.usuario_id = ${uid}::uuid
         ),
         random()
       limit ${POR_RODADA}
    `;

    return Response.json(linhas as PerguntaPublica[], {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    // Uma rota que promete JSON tem que falhar em JSON: devolvendo a pagina de
    // erro em HTML, o `r.json()` do cliente estoura antes de ver o status.
    return Response.json(
      { erro: "Nao foi possivel carregar as perguntas." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
