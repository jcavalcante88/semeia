import { sql } from "@/lib/db";
import { linkDoCapitulo, capituloDe } from "@/lib/biblia";
import Link from "next/link";
import Sequencia from "./Sequencia";
import CompartilharPlacar from "./CompartilharPlacar";

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
    const [linha] = await sql`
      select texto, referencia, versao from mensagens where ativa
       order by random() limit 1
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

        {/* Um versículo solto deixa a pessoa sem o contexto. Quem se interessou
            merece um caminho para o capítulo inteiro, sem ter que ir ao Google. */}
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
      </section>

      <Sequencia />

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
