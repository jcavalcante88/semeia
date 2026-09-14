import { sql } from "@/lib/db";
import { usuarioAtual } from "@/lib/sessao";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import Voltar from "../Voltar";

// Esta pagina le cookie (para destacar a propria linha), e ler cookie torna a
// pagina dinamica — um `export const revalidate` aqui seria ignorado e toda
// visita bateria no Neon. O cache tem que ficar em volta da consulta, nao da
// pagina: assim sao 50 linhas por minuto no banco, nao por visitante.
const buscarRanking = unstable_cache(
  async (periodo: "semana" | "geral") =>
    periodo === "geral"
      ? await sql`select * from ranking_geral order by pontos desc, acertos desc limit 50`
      : await sql`select * from ranking_semana order by pontos desc, acertos desc limit 50`,
  ["ranking"],
  { revalidate: 60, tags: ["ranking"] },
);

export default async function Ranking({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string }>;
}) {
  const { periodo: p } = await searchParams;
  const periodo = p === "geral" ? "geral" : "semana";
  const uid = await usuarioAtual();

  let linhas: Record<string, any>[] = [];
  let erro = false;
  try {
    linhas = await buscarRanking(periodo);
  } catch {
    // Banco fora do ar nao pode derrubar a pagina inteira com um 500.
    erro = true;
  }

  return (
    <main>
      <Voltar />
      <h1>Ranking</h1>
      <p className="referencia">
        A semana zera toda segunda-feira, para quem chegou hoje poder alcançar
        quem começou no mês passado.
      </p>

      <nav className="abas" style={{ marginTop: "1.25rem" }}>
        <Link href="/ranking" aria-current={periodo === "semana" ? "page" : undefined}>
          Esta semana
        </Link>
        <Link
          href="/ranking?periodo=geral"
          aria-current={periodo === "geral" ? "page" : undefined}
        >
          Desde o começo
        </Link>
      </nav>

      {erro ? (
        <p>
          O ranking não carregou agora. Tente recarregar daqui a pouco — sua
          pontuação está guardada.
        </p>
      ) : linhas.length === 0 ? (
        <p>
          {periodo === "geral"
            ? "Ninguém pontuou ainda."
            : "Ninguém pontuou ainda nesta semana."}{" "}
          <Link href="/quiz">Seja o primeiro.</Link>
        </p>
      ) : (
        <>
          <Podio linhas={linhas.slice(0, 3)} uid={uid} />

          {linhas.length > 3 && (
            <ol className="rank" start={4}>
              {linhas.slice(3).map((l: any, i: number) => (
                <li key={l.id} className={l.id === uid ? "eu" : undefined}>
                  <span className="posicao">{i + 4}</span>
                  <span className="apelido">
                    {l.apelido}
                    <span className="detalhe">
                      {l.acertos} de {l.total} perguntas
                    </span>
                  </span>
                  <span className="pontos">{l.pontos}</span>
                </li>
              ))}
            </ol>
          )}
        </>
      )}

      <p style={{ marginTop: "2rem" }}>
        <Link href="/quiz" className="botao">
          Responder mais perguntas
        </Link>
      </p>

      <footer className="rodape">
        Só aparece aqui quem marcou a opção de participar. Você pode sair quando
        quiser nas configurações.
      </footer>
    </main>
  );
}

/* ---------------------------------------------------------------- */

const MEDALHAS = ["🥇", "🥈", "🥉"];

/**
 * Os tres primeiros em destaque. O CSS reordena para o 1o lugar ficar no
 * meio e mais alto; no HTML a ordem continua 1, 2, 3, que e o que o leitor
 * de tela anuncia. Com uma ou duas pessoas o grid simplesmente ocupa
 * menos colunas — nao ha caixa vazia.
 */
function Podio({ linhas, uid }: { linhas: Record<string, any>[]; uid: string | null }) {
  return (
    <ol className="podio" aria-label="Três primeiros colocados">
      {linhas.map((l, i) => (
        <li
          key={l.id}
          className={`podio-lugar podio-${i + 1}${l.id === uid ? " eu" : ""}`}
        >
          <span className="podio-medalha" aria-hidden="true">
            {MEDALHAS[i]}
          </span>
          <span className="podio-apelido">{l.apelido}</span>
          <span className="podio-pontos">{l.pontos}</span>
          <span className="podio-detalhe">
            {l.acertos} de {l.total}
          </span>
        </li>
      ))}
    </ol>
  );
}
