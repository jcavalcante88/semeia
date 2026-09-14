import { sql } from "@/lib/db";
import { unstable_cache } from "next/cache";
import Voltar from "../Voltar";

// Como as noticias mudam uma vez por dia, 15 minutos de cache sobra e
// mantem o Neon quase parado.
const buscarNoticias = unstable_cache(
  async () =>
    await sql`
      select titulo, resumo, link, fonte, imagem, publicado_em
        from noticias
       where ativa
       order by publicado_em desc nulls last, coletado_em desc
       limit 30
    `,
  ["noticias"],
  { revalidate: 900, tags: ["noticias"] },
);

function quando(data: string | null): string {
  if (!data) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(data));
}

export const metadata = {
  title: "Mundo gospel | Semeia",
  description: "Notícias do mundo cristão, atualizadas todo dia.",
};

export default async function Noticias() {
  let linhas: Record<string, any>[] = [];
  let erro = false;
  try {
    linhas = await buscarNoticias();
  } catch {
    erro = true;
  }

  return (
    <main>
      <Voltar />
      <h1>Mundo gospel</h1>
      <p className="referencia">Atualizado uma vez por dia</p>

      {erro ? (
        <p style={{ marginTop: "1.5rem" }}>
          As notícias não carregaram agora. Tente recarregar daqui a pouco.
        </p>
      ) : linhas.length === 0 ? (
        <p style={{ marginTop: "1.5rem" }}>
          Ainda não há notícias por aqui. A primeira coleta acontece na próxima
          atualização do dia.
        </p>
      ) : (
        <>
          {/* As tres primeiras vao grandes, com a imagem do feed. O resto
              segue em lista, para a pagina nao virar um rolo infinito. */}
          <ul className="noticias noticias-destaque">
            {linhas.slice(0, 3).map((n) => (
              <li key={n.link}>
                <a href={n.link} target="_blank" rel="noopener noreferrer nofollow">
                  {n.imagem && (
                    <span className="noticia-capa">
                      {/* <img> simples, e nao next/image: a otimizacao de
                          imagem da Vercel e cobrada por uso no plano Hobby,
                          e aqui o arquivo ja vem pronto do portal. */}
                      <img
                        src={n.imagem}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                      />
                    </span>
                  )}
                  <span className="noticia-corpo">
                    <span className="noticia-titulo">{n.titulo}</span>
                    {n.resumo && <span className="noticia-resumo">{n.resumo}</span>}
                    <span className="noticia-fonte">
                      {n.fonte}
                      {n.publicado_em && ` · ${quando(n.publicado_em)}`}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {linhas.length > 3 && (
            <>
              <h2>Mais notícias</h2>
              <ul className="noticias">
                {linhas.slice(3).map((n) => (
                  <li key={n.link}>
                    <a href={n.link} target="_blank" rel="noopener noreferrer nofollow">
                      <span className="noticia-corpo">
                        <span className="noticia-titulo">{n.titulo}</span>
                        {n.resumo && <span className="noticia-resumo">{n.resumo}</span>}
                        <span className="noticia-fonte">
                          {n.fonte}
                          {n.publicado_em && ` · ${quando(n.publicado_em)}`}
                        </span>
                      </span>
                      {n.imagem && (
                        <span className="noticia-miniatura">
                          <img
                            src={n.imagem}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                          />
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}

      <footer className="rodape">
        As notícias acima são produzidas pelos portais citados, não pelo Semeia.
        Mostramos o título e um trecho curto — o texto completo abre no site de
        origem, que é de quem escreveu.
      </footer>
    </main>
  );
}
