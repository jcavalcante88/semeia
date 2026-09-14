import { sql } from "@/lib/db";
import { usuarioAtual } from "@/lib/sessao";
import type { LinhaRanking } from "@/lib/tipos";

export const runtime = "edge";
// Esta rota le cookie para marcar `euMesmo`, entao a resposta e por pessoa e
// NAO pode ser cacheada — o `revalidate = 60` que estava aqui era ignorado pelo
// Next e, se valesse, mostraria a linha destacada de um visitante para outro.
// A pagina /ranking nao usa esta rota (consulta o banco direto); ela existe
// para quando o ranking precisar ser lido de fora.
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const periodo =
    new URL(req.url).searchParams.get("periodo") === "geral" ? "geral" : "semana";
  const uid = await usuarioAtual();

  const linhas =
    periodo === "geral"
      ? await sql`select * from ranking_geral order by pontos desc, acertos desc limit 50`
      : await sql`select * from ranking_semana order by pontos desc, acertos desc limit 50`;

  const ranking: LinhaRanking[] = linhas.map((l: any, i: number) => ({
    posicao: i + 1,
    apelido: l.apelido,
    acertos: Number(l.acertos),
    total: Number(l.total),
    pontos: Number(l.pontos),
    euMesmo: l.id === uid,
  }));

  return Response.json({ periodo, ranking });
}
