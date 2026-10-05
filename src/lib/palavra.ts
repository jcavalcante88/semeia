import { sql } from "./db";

/**
 * A palavra do bloco de 12 horas — a MESMA que a tela inicial mostra e a
 * MESMA que a notificação manda.
 *
 * Por que existe este arquivo: a home fazia esta consulta e a rota de disparo
 * fazia `order by random()` entre os versículos ainda não enviados. As duas
 * quase nunca coincidiam, então chegava uma notificação com um versículo, a
 * pessoa abria o app e encontrava outro. A notificação é um convite para
 * entrar; entrar e achar coisa diferente quebra o convite.
 *
 * Agora a conta mora num lugar só. Duas cópias da mesma regra em arquivos
 * diferentes é exatamente como as duas se separaram.
 *
 * COMO FUNCIONA: a posição vem do relógio, num bloco de 12 horas que vira à
 * meia-noite e ao meio-dia de Brasília. Os disparos são às 7h e às 19h, então
 * cada um cai bem no meio do seu bloco — a pessoa que abre o app depois de
 * receber encontra o mesmo versículo, de manhã e de noite.
 *
 * A fila anda um por vez e só dá a volta depois de passar pelos 87. A conta
 * de fuso é do Postgres (regra 3): ele resolve o horário de verão sozinho.
 *
 * ISTO MUDA A GARANTIA DE "NUNCA REPETE" da rota de disparo. Antes, `envios`
 * com chave `(usuario_id, mensagem_id)` garantia que ninguém receberia o mesmo
 * versículo duas vezes na vida. Agora o rodízio dá a volta: com 87 versículos
 * e 2 por dia, um versículo volta depois de 43 dias e meio. É o mesmo ciclo
 * que a tela inicial já tinha — e é o preço de a notificação e a tela
 * dizerem a mesma coisa.
 */
export async function palavraDoBloco() {
  const [linha] = await sql`
    with ativas as (
      select id, texto, referencia, versao,
             row_number() over (order by id) - 1 as pos,
             count(*) over () as total
        from mensagens
       where ativa
    )
    select id, texto, referencia, versao
      from ativas
     where pos = (
       floor(
         extract(epoch from (now() at time zone 'America/Sao_Paulo')) / 43200
       )::bigint % total
     )
  `;
  return (linha ?? null) as {
    id: number;
    texto: string;
    referencia: string;
    versao: string;
  } | null;
}
