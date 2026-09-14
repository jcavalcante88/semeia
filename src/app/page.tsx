import { sql } from "@/lib/db";
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

  return (
    <main>
      <p className="versiculo">{versiculo.texto}</p>
      <p className="referencia">
        {versiculo.referencia} &nbsp;·&nbsp; {versiculo.versao}
      </p>

      <Sequencia />

      <h2>Comece pelo quiz</h2>
      <p>
        Cinquenta perguntas sobre a Bíblia, com a resposta explicada na hora. Não
        precisa saber nada antes: cada erro vem acompanhado do versículo que
        responde a pergunta.
      </p>

      <Link href="/quiz" className="botao">
        Responder o quiz
      </Link>

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
