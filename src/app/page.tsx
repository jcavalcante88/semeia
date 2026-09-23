import { sql } from "@/lib/db";
import { linkDoCapitulo, capituloDe } from "@/lib/biblia";
import Link from "next/link";
import Sequencia from "./Sequencia";
import CompartilharPlacar from "./CompartilharPlacar";
import CompartilharVersiculo from "./CompartilharVersiculo";
import MuralNaHome from "./MuralNaHome";

export const revalidate = 300;

// Se o banco nao responder, a porta de entrada do app nao pode virar um 500.
// Este versiculo de reserva tambem e o que aparece no build, antes de existir
// DATABASE_URL — sem ele, `npm run build` quebra numa maquina sem .env.local.
const RESERVA = {
  texto: "O Senhor é o meu pastor; nada me faltará.",
  referencia: "Salmos 23:1",
  versao: "Almeida 1911",
};

export default async function Inicio() {
  // Lido do banco, e nao escrito na mao: numero cravado no texto vira mentira
  // na primeira vez que voce acrescentar perguntas.
  let TOTAL_PERGUNTAS = 100;
  try {
    const [c] = await sql`select count(*)::int as n from perguntas where ativa`;
    if (c?.n) TOTAL_PERGUNTAS = Number(c.n);
  } catch {}

  let versiculo = RESERVA;
  try {
    // Rodizio, nao sorteio.
    //
    // Isto era `order by random() limit 1` com revalidate de 5 minutos: a
    // "palavra de hoje" trocava a cada 5 minutos, e como sorteio nao tem
    // memoria, o mesmo versiculo voltava duas e tres vezes seguidas.
    //
    // Agora a posicao vem do relogio: um bloco de 12 horas, virando a
    // meia-noite e ao meio-dia de Brasilia. Dentro do bloco o versiculo e
    // sempre o mesmo, e a fila anda um por vez ate dar a volta no banco
    // inteiro — nenhum se repete antes de todos terem aparecido.
    //
    // A conta de fuso e do Postgres de proposito (regra 3): ele resolve o
    // horario de verao sozinho.
    const [linha] = await sql`
      with ativas as (
        select texto, referencia, versao,
               row_number() over (order by id) - 1 as pos,
               count(*) over () as total
          from mensagens
         where ativa
      )
      select texto, referencia, versao
        from ativas
       where pos = (
         floor(
           extract(epoch from (now() at time zone 'America/Sao_Paulo')) / 43200
         )::bigint % total
       )
    `;
    if (linha) versiculo = linha as typeof RESERVA;
  } catch {
    // segue com o versiculo de reserva
  }


  const capitulo = linkDoCapitulo(versiculo.referencia);

  return (
    <main>
      <section className="palavra">
        <p className="palavra-rotulo">A palavra de hoje</p>
        <p className="versiculo">{versiculo.texto}</p>
        <p className="referencia">
          {versiculo.referencia} &nbsp;·&nbsp; {versiculo.versao}
        </p>

        {/* As duas coisas que alguém quer fazer com um versículo que o tocou:
            ler o resto e mandar para uma pessoa. Juntas, e no mesmo peso. */}
        <div className="palavra-acoes">
          {/* Um versículo solto deixa a pessoa sem o contexto. Quem se
              interessou merece um caminho para o capítulo inteiro, sem ter
              que ir ao Google. */}
          {capitulo && (
            <a
              className="palavra-continuar"
              href={capitulo}
              target="_blank"
              rel="noopener noreferrer"
            >
              Continuar lendo {capituloDe(versiculo.referencia)}
              <span aria-hidden="true">→</span>
            </a>
          )}

          <CompartilharVersiculo
            texto={versiculo.texto}
            referencia={versiculo.referencia}
            versao={versiculo.versao}
          />
        </div>
      </section>

      <Sequencia />

      {/* O desafio vem ANTES do quiz de propósito. O quiz é a porta de entrada
          de quem chega; o desafio é o motivo de voltar amanhã, e é curto o
          bastante para caber num dia corrido. Quem abre o app por hábito quer
          achar isto primeiro. */}
      <Link href="/desafio" className="chamada-desafio">
        <span className="chamada-desafio-rotulo">Desafio de hoje</span>
        <span className="chamada-desafio-titulo">Cinco perguntas, um minuto</span>
        <span className="chamada-desafio-texto">
          As mesmas cinco para todo mundo, até a meia-noite. Amanhã são outras.
        </span>
      </Link>

      {/* Cartão dourado, e não um parágrafo seguido de botão: o quiz é a porta
          de entrada do app e precisa parecer uma. */}
      <section className="chamada-quiz">
        <p className="chamada-selo">{TOTAL_PERGUNTAS} perguntas</p>
        <h2 className="chamada-titulo">Você conhece a Bíblia?</h2>
        <p className="chamada-texto">
          A resposta explicada na hora, com o versículo que responde a pergunta.
          Não precisa saber nada antes — e não tem cadastro.
        </p>
        <Link href="/quiz" className="botao chamada-botao">
          Começar agora
        </Link>
      </section>

      {/* O mural vinha ficando invisivel: a home linkava para quiz, desafio,
          noticias, ranking e apoiar, e nao para a oracao. Em dez dias entrou
          UM pedido — e ele recebeu tres oracoes, ou seja, quem chegava usava.
          Faltava o caminho, nao o interesse. */}
      <MuralNaHome />

      <h2>Receba um versículo por dia</h2>
      <p>
        Depois do quiz você pode escolher os horários em que quer receber uma
        mensagem no celular. São três por dia, no máximo, e dá para desligar a
        qualquer momento.
      </p>

      <h2>Mundo gospel</h2>
      <p>
        O que está acontecendo no mundo cristão, reunido de portais de notícia
        e atualizado duas vezes por dia.
      </p>

      <Link href="/noticias" className="botao botao-vazado">
        Ver as notícias
      </Link>

      <CompartilharPlacar />

      <h2>Ranking da semana</h2>
      <p>
        Quem mais pontuou desde segunda-feira. A lista zera toda semana, então
        quem chegou hoje ainda alcança quem começou no mês passado.
      </p>

      <Link href="/ranking" className="botao">
        Ver o ranking da semana
      </Link>

      <footer className="rodape">
        Texto bíblico: Almeida 1911, domínio público.
        <br />
        Gratuito e sem anúncio. <Link href="/apoiar">Apoiar o Semeia</Link>.
      </footer>
    </main>
  );
}
