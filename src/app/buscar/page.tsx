import Link from "next/link";
import { sql } from "@/lib/db";
import Voltar from "../Voltar";
import MapaSatelite from "../MapaSatelite";
import { linkDoCapitulo, capituloDe } from "@/lib/biblia";

export const dynamic = "force-dynamic";

export const metadata = { title: "Buscar | Semeia" };

type Passagem = {
  referencia: string;
  titulo: string;
  resumo: string;
  significado: string;
  pessoas: { nome: string; quem: string }[];
  lugares: string[];
  palavras: { palavra: string; significado: string }[];
};

type Versiculo = {
  texto: string;
  referencia: string;
  versao: string;
};

type Lugar = {
  nome: string;
  atual: string | null;
  lat: number;
  lon: number;
  zoom: number;
  descricao: string;
  incerto: boolean;
};

/** Tira acento e baixa a caixa, para "Jericó" achar "jerico". */
function semAcento(t: string) {
  return t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export default async function PaginaBuscar({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const termo = (q ?? "").trim().slice(0, 80);

  if (!termo) {
    return (
      <main>
        <Voltar />
        <h1>Buscar</h1>
        <p>Escreva uma passagem, uma parábola ou um lugar na barra da tela inicial.</p>
      </main>
    );
  }

  const alvo = semAcento(termo);
  const curinga = `%${alvo}%`;
  const curingaCru = `%${termo}%`;

  /*
   * "Joao 3" e "Salmos 23:1" sao referencia, nao palavra solta. Reconhecendo
   * isso, a busca oferece o capitulo inteiro para ler mesmo quando nao existe
   * passagem escrita para ele — e o caso mais comum de quem digita assim.
   */
  const capituloBuscado = linkDoCapitulo(termo) ? capituloDe(termo) : null;
  const linkBuscado = linkDoCapitulo(termo);

  let passagens: Passagem[] = [];
  let versiculos: Versiculo[] = [];
  let lugares: Lugar[] = [];
  let perguntas: { enunciado: string; explicacao: string; versiculo: string }[] = [];

  try {
    /*
     * A coluna `busca` já é escrita sem acento e em minúsculas, então o termo
     * normalizado bate nela direto. Para título e referência, que têm acento,
     * a comparação é com o termo como veio digitado.
     */
    passagens = (await sql`
      select referencia, titulo, resumo, significado, pessoas, lugares, palavras
        from passagens
       where ativa
         and (busca ilike ${curinga} or titulo ilike ${curingaCru} or referencia ilike ${curingaCru})
       order by length(titulo)
       limit 4
    `) as Passagem[];

    /*
     * Os 87 versiculos do app. Era o buraco maior da busca: procurar
     * "Salmos 23" ou "coracao" nao achava NADA, sendo que o versiculo estava
     * no banco desde o primeiro dia. A coluna `busca` ja vem sem acento.
     */
    versiculos = (await sql`
      select texto, referencia, versao
        from mensagens
       where ativa
         and (busca ilike ${curinga} or referencia ilike ${curingaCru})
       order by length(referencia)
       limit 8
    `) as Versiculo[];

    lugares = (await sql`
      select nome, atual, lat, lon, zoom, descricao, incerto
        from lugares
       where ativo and (busca ilike ${curinga} or nome ilike ${curingaCru})
       limit 3
    `) as Lugar[];

    /*
     * A rede que segura quem procura fora da lista curada: as 300 perguntas do
     * quiz já têm explicação e versículo escritos. É conteúdo real, não
     * inventado — e cobre muito mais assunto do que as 15 passagens.
     *
     * O gabarito sai aqui, e isso NÃO fere a regra 1: a regra protege
     * `/api/quiz/perguntas`, que alimenta a rodada valendo ponto. Aqui é
     * material de estudo, fora do quiz, e quem busca já sabe o que procura.
     */
    perguntas = (await sql`
      select enunciado, explicacao, versiculo
        from perguntas
       where ativa
         and (enunciado ilike ${curingaCru} or explicacao ilike ${curingaCru} or versiculo ilike ${curingaCru})
       limit 6
    `) as typeof perguntas;
  } catch {
    return (
      <main>
        <Voltar />
        <h1>Buscar</h1>
        <p style={{ color: "var(--escarlata)" }}>Não deu para buscar agora. Tente de novo.</p>
      </main>
    );
  }

  /* Os lugares de todas as passagens encontradas, sem repetir. */
  const nomesDasPassagens = [...new Set(passagens.flatMap((p) => p.lugares))];
  const mapas =
    nomesDasPassagens.length > 0
      ? ((await sql`
          select nome, atual, lat, lon, zoom, descricao, incerto
            from lugares where ativo and nome = any(${nomesDasPassagens})
        `) as Lugar[])
      : [];
  const todosOsLugares = [...mapas, ...lugares.filter((l) => !mapas.some((m) => m.nome === l.nome))];

  const achouAlgo =
    passagens.length + versiculos.length + todosOsLugares.length + perguntas.length > 0;

  return (
    <main>
      <Voltar />
      <h1>{termo}</h1>

      {/* Quem digitou uma referencia quer o capitulo. Vem antes de tudo
          porque e a resposta mais direta a pergunta que a pessoa fez. */}
      {capituloBuscado && linkBuscado && (
        <a
          className="palavra-continuar"
          href={linkBuscado}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: "1rem" }}
        >
          Ler {capituloBuscado} na Bíblia
          <span aria-hidden="true">→</span>
        </a>
      )}

      {!achouAlgo && (
        <>
          <p style={{ marginTop: "1rem" }}>
            Não encontrei nada sobre isso ainda.
          </p>
          <p className="referencia">
            A busca procura em cinco lugares: as passagens explicadas (15 hoje,
            escritas uma a uma), os 87 versículos do app, os 42 lugares do
            atlas, as 300 perguntas do quiz e os capítulos da Bíblia. Tente um
            nome de lugar, uma parábola, ou uma referência como “João 3”.
          </p>
        </>
      )}

      {passagens.map((p) => (
        <article key={p.referencia} className="passagem">
          <p className="passagem-ref">{p.referencia}</p>
          <h2 className="passagem-titulo">{p.titulo}</h2>

          <h3 className="passagem-secao">O que acontece</h3>
          <p>{p.resumo}</p>

          <h3 className="passagem-secao">O que significa</h3>
          <p>{p.significado}</p>

          {p.pessoas.length > 0 && (
            <>
              <h3 className="passagem-secao">Quem aparece</h3>
              <ul className="passagem-lista">
                {p.pessoas.map((x) => (
                  <li key={x.nome}>
                    <strong>{x.nome}</strong> — {x.quem}
                  </li>
                ))}
              </ul>
            </>
          )}

          {p.palavras.length > 0 && (
            <>
              <h3 className="passagem-secao">Palavras difíceis</h3>
              <ul className="passagem-lista">
                {p.palavras.map((x) => (
                  <li key={x.palavra}>
                    <strong>{x.palavra}</strong> — {x.significado}
                  </li>
                ))}
              </ul>
            </>
          )}

          {linkDoCapitulo(p.referencia) && (
            <a
              className="palavra-continuar"
              href={linkDoCapitulo(p.referencia)!}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ler {capituloDe(p.referencia)} na Bíblia
              <span aria-hidden="true">→</span>
            </a>
          )}
        </article>
      ))}

      {versiculos.length > 0 && (
        <>
          <h2 className="passagem-secao-grande">Versículos</h2>
          {versiculos.map((v) => (
            <blockquote key={v.referencia} className="busca-versiculo">
              <p className="busca-versiculo-texto">{v.texto}</p>
              <footer>
                <cite className="referencia">
                  {v.referencia} · {v.versao}
                </cite>
                {linkDoCapitulo(v.referencia) && (
                  <a
                    href={linkDoCapitulo(v.referencia)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="busca-versiculo-link"
                  >
                    Ler {capituloDe(v.referencia)}
                    <span aria-hidden="true"> →</span>
                  </a>
                )}
              </footer>
            </blockquote>
          ))}
        </>
      )}

      {todosOsLugares.length > 0 && (
        <>
          <h2 className="passagem-secao-grande">Onde fica</h2>
          {todosOsLugares.map((l) => (
            <div key={l.nome} className="lugar">
              <MapaSatelite
                nome={l.atual ? `${l.nome} (hoje ${l.atual})` : l.nome}
                lat={l.lat}
                lon={l.lon}
                zoom={l.zoom}
                incerto={l.incerto}
              />
              <p className="lugar-texto">{l.descricao}</p>
            </div>
          ))}
        </>
      )}

      {perguntas.length > 0 && (
        <>
          <h2 className="passagem-secao-grande">Também sobre isso</h2>
          {perguntas.map((x) => (
            <div key={x.enunciado} className="explicacao">
              <p>
                <strong>{x.enunciado}</strong>
              </p>
              <p>{x.explicacao}</p>
              <p className="referencia">{x.versiculo}</p>
            </div>
          ))}
        </>
      )}

      <footer className="rodape">
        As passagens explicadas são escritas à mão, uma a uma — o app não
        inventa texto bíblico. A busca cobre passagens, versículos, lugares,
        capítulos e as 300 perguntas d<Link href="/quiz">o quiz</Link>.
      </footer>
    </main>
  );
}
