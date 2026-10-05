import { sql } from "@/lib/db";
import { linkDoCapitulo, capituloDe } from "@/lib/biblia";
import { palavraDoBloco } from "@/lib/palavra";
import Link from "next/link";
import Sequencia from "./Sequencia";
import CompartilharPlacar from "./CompartilharPlacar";
import CompartilharVersiculo from "./CompartilharVersiculo";
import MuralNaHome from "./MuralNaHome";
import Busca from "./Busca";
import DestaquesNaHome from "./DestaquesNaHome";

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

  // A consulta mora em src/lib/palavra.ts porque a rota de disparo usa a
  // MESMA: e assim que a notificacao e a tela passam a mostrar o mesmo
  // versiculo. Duas copias da regra foi como elas se separaram.
  let versiculo: { texto: string; referencia: string; versao: string } = RESERVA;
  try {
    const linha = await palavraDoBloco();
    if (linha) versiculo = linha;
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

      {/* A busca logo abaixo da palavra, por pedido do Jerry. Fica no caminho
          de quem acabou de ler um versiculo e quer saber mais sobre ele. */}
      <Busca />

      {/* O carrossel vem DEPOIS da palavra, por pedido do Jerry — ele estava
          em cima e voltou para baixo. Faz sentido: a palavra do dia é o
          motivo de o app existir, e quem abre para ler um versículo deve
          encontrar o versículo, não uma notícia. O carrossel é o que tem de
          novo hoje, e isso pode esperar a rolagem de um dedo. */}
      <DestaquesNaHome />

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
        mensagem no celular. São duas por dia — 7h e 19h — e dá para desligar a
        qualquer momento.
      </p>

      <h2>Mundo cristão</h2>
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
