import { sql } from "@/lib/db";
import { usuarioAtual } from "@/lib/sessao";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * Desafio do dia: 5 perguntas iguais para todo mundo, trocando a meia-noite.
 *
 * Corre POR FORA do quiz, de proposito. Grava em `desafio_respostas`, e nao
 * em `respostas`: o quiz tem `unique (usuario_id, pergunta_id)`, uma tentativa
 * por pergunta para sempre, e gravar aqui queimaria a pergunta la. Tambem nao
 * pontua no ranking — o que puxa a pessoa de volta e a sequencia de dias.
 *
 * Quem escolhe as 5 e a view `desafio_de_hoje` (db/desafio.sql), que faz a
 * conta de data no Postgres, no fuso de Sao Paulo (regra 3). Nunca no relogio
 * do navegador: bastaria adiantar o celular para jogar o desafio de amanha.
 */

/**
 * GET -> as perguntas de hoje, o que a pessoa ja respondeu, a sequencia de
 * dias seguidos e como o resto do pessoal foi hoje.
 *
 * REGRA DE OURO: nao sai `correta` nem `explicacao` daqui — a view nem tem
 * essas colunas. O gabarito so aparece na resposta do POST, depois da escolha.
 */
export async function GET() {
  const uid = await usuarioAtual();

  try {
    const perguntas = await sql`
      select id, enunciado, alternativas, nivel
        from desafio_de_hoje
       order by ordem
    `;

    const [{ dia }] = await sql`
      select to_char((now() at time zone 'America/Sao_Paulo')::date, 'YYYY-MM-DD') as dia
    `;

    // Como o pessoal foi hoje. E o que transforma "joguei" em "quantas voce
    // acertou?" — e so existe porque as 5 sao as mesmas para todo mundo.
    const [placar] = await sql`
      select count(*)::int as participantes,
             coalesce(avg(certas), 0)::float as media
        from (
          select usuario_id, count(*) filter (where acertou)::int as certas
            from desafio_respostas
           where dia = (now() at time zone 'America/Sao_Paulo')::date
           group by usuario_id
        ) t
    `;
    const publico = {
      dia,
      perguntas,
      media: placar.participantes ? Number(placar.media.toFixed(1)) : null,
      participantes: placar.participantes,
    };

    // Sem usuario (quem chegou agora e ainda nao escolheu um nome) recebe so
    // as perguntas: o resto depende de saber quem e.
    if (!uid) {
      return Response.json(
        { ...publico, respondidas: [], sequencia: 0 },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const respondidas = await sql`
      select pergunta_id as "perguntaId", acertou
        from desafio_respostas
       where usuario_id = ${uid}::uuid
         and dia = (now() at time zone 'America/Sao_Paulo')::date
    `;

    /*
     * Sequencia de dias seguidos.
     *
     * O truque e `dia - row_number()`: numa sequencia de datas coladas essa
     * subtracao da sempre o mesmo valor, entao basta contar quantas linhas
     * caem no grupo da data mais recente.
     *
     * Quem jogou ontem e ainda nao jogou hoje mantem a sequencia viva — ela
     * so quebra depois de um dia inteiro em branco. Cobrar no mesmo dia seria
     * o contrario do tom do app.
     */
    const [seq] = await sql`
      with dias as (
        select distinct dia from desafio_respostas where usuario_id = ${uid}::uuid
      ),
      ilhas as (
        select dia, dia - (row_number() over (order by dia))::int as grupo from dias
      )
      select count(*)::int as n
        from ilhas
       where grupo = (select grupo from ilhas order by dia desc limit 1)
         and (select max(dia) from dias)
             >= (now() at time zone 'America/Sao_Paulo')::date - 1
    `;

    return Response.json(
      { ...publico, respondidas, sequencia: seq?.n ?? 0 },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    // Uma rota que promete JSON tem que falhar em JSON: devolvendo HTML, o
    // `r.json()` do cliente estoura antes de ver o status.
    return Response.json(
      { erro: "Nao foi possivel carregar o desafio de hoje." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}

/**
 * POST { perguntaId, escolha } -> confere, grava e devolve a explicacao.
 *
 * A pergunta precisa estar na view de HOJE: sem essa checagem, daria para
 * mandar qualquer id pelo DevTools e colher o gabarito do banco inteiro.
 */
export async function POST(req: Request) {
  const uid = await usuarioAtual();
  if (!uid) {
    return Response.json({ erro: "Escolha um nome antes de jogar." }, { status: 401 });
  }

  let corpo: { perguntaId?: unknown; escolha?: unknown };
  try {
    corpo = await req.json();
  } catch {
    return Response.json({ erro: "Pedido invalido." }, { status: 400 });
  }

  const perguntaId = Number(corpo.perguntaId);
  const escolha = Number(corpo.escolha);
  if (!Number.isInteger(perguntaId) || !Number.isInteger(escolha) || escolha < 0 || escolha > 3) {
    return Response.json({ erro: "Pedido invalido." }, { status: 400 });
  }

  try {
    const [p] = await sql`
      select p.correta, p.explicacao, p.versiculo
        from desafio_de_hoje d
        join perguntas p on p.id = d.id
       where d.id = ${perguntaId}
    `;
    if (!p) {
      return Response.json({ erro: "Essa pergunta nao e do desafio de hoje." }, { status: 400 });
    }

    const certo = escolha === p.correta;

    /*
     * A trava e a chave primaria (usuario_id, dia, pergunta_id), no banco e
     * nao no JavaScript (regra 2). `xmax = 0` separa insercao de conflito: se
     * a linha ja existia, a pessoa esta tentando responder duas vezes e o
     * `returning` volta vazio.
     */
    const [gravou] = await sql`
      insert into desafio_respostas (usuario_id, dia, pergunta_id, acertou)
      values (
        ${uid}::uuid,
        (now() at time zone 'America/Sao_Paulo')::date,
        ${perguntaId},
        ${certo}
      )
      on conflict do nothing
      returning (xmax = 0) as inseriu
    `;
    if (!gravou) {
      return Response.json({ erro: "Voce ja respondeu esta hoje." }, { status: 409 });
    }

    return Response.json({
      certo,
      correta: p.correta,
      explicacao: p.explicacao,
      versiculo: p.versiculo,
    });
  } catch {
    return Response.json({ erro: "Nao foi possivel registrar a resposta." }, { status: 503 });
  }
}
