import Link from "next/link";
import { sql } from "@/lib/db";

/**
 * O mural de oração na tela inicial.
 *
 * Por que isto existe: em dez dias o mural recebeu UM pedido. Não foi falta
 * de interesse — esse pedido recebeu três orações, ou seja, quem chegou lá
 * usou. O problema era o caminho: a home linkava para o quiz, o desafio, as
 * notícias, o ranking e o apoiar, e **não linkava para a oração**. A única
 * porta era um ícone na barra de baixo, entre outros oito.
 *
 * Mostra o pedido mais recente de verdade, nunca um inventado. Mural que
 * parece vazio continua vazio, porque ninguém quer ser o primeiro — e a
 * saída honesta para isso é mostrar que ele não está vazio, não fingir.
 *
 * É um componente de servidor: a consulta acontece no render, sem `fetch` no
 * navegador e sem piscar na tela.
 */
type Pedido = {
  texto: string;
  /** null quando a pessoa pediu de forma anonima, que e o padrao do mural. */
  apelido: string | null;
  oracoes: number;
};

export default async function MuralNaHome() {
  let pedido: Pedido | null = null;
  let total = 0;

  try {
    const [linha] = await sql`
      select p.texto,
             -- O padrão do mural é anônimo, e aqui ele vale igual: o nome só
             -- aparece se a pessoa marcou que queria aparecer (regra 4).
             case when p.anonimo then null else u.apelido end as apelido,
             (select count(*) from oracoes o where o.pedido_id = p.id)::int as oracoes
        from pedidos_oracao p
        join usuarios u on u.id = p.usuario_id
       where p.ativo
       order by p.criado_em desc
       limit 1
    `;
    if (linha) pedido = linha as Pedido;

    const [c] = await sql`select count(*)::int as n from pedidos_oracao where ativo`;
    total = Number(c?.n ?? 0);
  } catch {
    // Sem banco, o bloco simplesmente não aparece — a home não pode cair por
    // causa de um cartão secundário.
    return null;
  }

  /* Mural vazio: o convite é para escrever, não para ler. */
  if (!pedido) {
    return (
      <Link href="/oracao" className="mural-home">
        <span className="mural-rotulo">Pedidos de oração</span>
        <span className="mural-texto">
          Ainda não há nenhum pedido. Se você está passando por algo, pode ser
          o primeiro — e alguém vai orar.
        </span>
        <span className="mural-acao">Escrever um pedido →</span>
      </Link>
    );
  }

  /* Pedido comprido cortado no fim, com reticências, para o cartão não virar
     um texto longo na home. O pedido inteiro está a um toque. */
  const trecho = pedido.texto.length > 150 ? pedido.texto.slice(0, 150).trimEnd() + "…" : pedido.texto;

  return (
    <Link href="/oracao" className="mural-home">
      <span className="mural-rotulo">
        {total === 1 ? "Um pedido de oração" : `${total} pedidos de oração`}
      </span>

      <span className="mural-pedido">“{trecho}”</span>

      <span className="mural-quem">
        {pedido.apelido ?? "Alguém"}
        {pedido.oracoes > 0 && (
          <>
            {" · "}
            {/* O número é o sinal de vida do mural: diz que alguém do outro
                lado leu e parou. Sem ele, o cartão é só um texto triste. */}
            <strong>
              {pedido.oracoes === 1
                ? "1 pessoa já orou"
                : `${pedido.oracoes} pessoas já oraram`}
            </strong>
          </>
        )}
      </span>

      <span className="mural-acao">Orar por alguém →</span>
    </Link>
  );
}
