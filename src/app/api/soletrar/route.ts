import { sql } from "@/lib/db";
import { usuarioAtual } from "@/lib/sessao";
import { montarLetras, normalizar } from "@/lib/soletrar";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * GET sem parâmetro  -> o mapa: quantos níveis existem e quais já foram feitos.
 * GET ?nivel=N       -> o nível: pergunta, tamanho da palavra e as letras.
 *
 * Em nenhum dos dois a resposta certa sai daqui. O navegador recebe o
 * TAMANHO e um teclado de letras embaralhadas — montar a palavra é o jogo.
 * A conferência é no POST.
 */
export async function GET(req: Request) {
  const uid = await usuarioAtual();
  const nivel = Number(new URL(req.url).searchParams.get("nivel"));

  try {
    if (Number.isInteger(nivel) && nivel > 0) {
      const [e] = await sql`
        select e.nivel,
               p.enunciado,
               p.alternativas->>p.correta as resposta
          from soletrar e
          join perguntas p on p.id = e.pergunta_id
         where e.nivel = ${nivel} and e.ativa
      `;
      if (!e) {
        return Response.json({ erro: "Nivel nao encontrado." }, { status: 404 });
      }

      const resolvido = uid
        ? (
            await sql`
              select 1 from soletrar_resolvidos
               where usuario_id = ${uid}::uuid and nivel = ${nivel}
            `
          ).length > 0
        : false;

      // Repare no que NÃO vai na resposta: `resposta`.
      return Response.json(
        {
          nivel: e.nivel,
          enunciado: e.enunciado,
          tamanho: normalizar(e.resposta).length,
          letras: montarLetras(e.resposta, e.nivel),
          resolvido,
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const [t] = await sql`select count(*)::int as total from soletrar where ativa`;
    const feitos = uid
      ? await sql`select nivel from soletrar_resolvidos where usuario_id = ${uid}::uuid`
      : [];

    return Response.json(
      { total: t?.total ?? 0, resolvidos: feitos.map((f) => Number(f.nivel)) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ erro: "Nao foi possivel carregar agora." }, { status: 503 });
  }
}

/** Confere a palavra montada. Recebe apenas { nivel, palavra }. */
export async function POST(req: Request) {
  const uid = await usuarioAtual();
  if (!uid) {
    return Response.json(
      { erro: "Escolha um nome antes de jogar." },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const nivel = Number(body.nivel);
  const palavra = normalizar(String(body.palavra ?? ""));

  if (!Number.isInteger(nivel) || nivel < 1 || !palavra) {
    return Response.json({ erro: "Dados invalidos." }, { status: 400 });
  }

  try {
    const [e] = await sql`
      select p.alternativas->>p.correta as resposta, p.versiculo, p.explicacao
        from soletrar e
        join perguntas p on p.id = e.pergunta_id
       where e.nivel = ${nivel} and e.ativa
    `;
    if (!e) return Response.json({ erro: "Nivel nao encontrado." }, { status: 404 });

    const certo = palavra === normalizar(e.resposta);

    if (!certo) {
      // Errar não guarda nada e não custa nada: dá para tentar de novo.
      // O Soletrar não tem a regra de tentativa única do quiz.
      return Response.json({ certo: false }, { headers: { "Cache-Control": "no-store" } });
    }

    // `on conflict do nothing`: refazer um nível não duplica o progresso.
    await sql`
      insert into soletrar_resolvidos (usuario_id, nivel)
      values (${uid}::uuid, ${nivel})
      on conflict do nothing
    `;

    // A explicação só vem DEPOIS de acertar — é a recompensa, não a dica.
    return Response.json(
      {
        certo: true,
        resposta: e.resposta,
        explicacao: e.explicacao,
        versiculo: e.versiculo,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ erro: "Nao foi possivel conferir agora." }, { status: 503 });
  }
}
