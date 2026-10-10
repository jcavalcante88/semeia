import { sql } from "@/lib/db";
import { usuarioAtual } from "@/lib/sessao";
import { palavraDoBloco } from "@/lib/palavra";
import webpush from "web-push";

export const runtime = "nodejs"; // web-push precisa de Node, nao roda no edge
export const dynamic = "force-dynamic";

/**
 * Manda a palavra de hoje para os aparelhos de QUEM PEDIU, agora.
 *
 * Existe porque conferir se o push funciona era impossivel sem esperar as
 * 7h ou as 19h — e, quando nao chegava, nao dava para saber onde tinha
 * parado: no servidor, no Google, ou no celular. Em outubro de 2026 o
 * servidor mandava e o Google aceitava com 201; o aviso chegava e o Android
 * o trocava em silencio por causa da `tag` sem `renotify`. Levou uma sessao
 * inteira para descobrir isso, e teria levado um minuto com este botao.
 *
 * O que ele devolve e o DIAGNOSTICO, nao so "ok": quantos aparelhos existem,
 * quantos aceitaram e quantos estavam mortos. Botao que so diz "pronto" nao
 * ajuda ninguem a achar o problema.
 *
 * So manda para si mesmo: a consulta filtra por `usuario_id`, que vem do
 * cookie. Nao ha caminho para mandar notificacao para outra pessoa.
 */
export async function POST() {
  const uid = await usuarioAtual();
  if (!uid) return Response.json({ erro: "Sem perfil." }, { status: 401 });

  const { VAPID_SUBJECT, NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;
  if (!VAPID_SUBJECT || !NEXT_PUBLIC_VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return Response.json({ erro: "Chaves de notificação ausentes no servidor." }, { status: 500 });
  }
  webpush.setVapidDetails(VAPID_SUBJECT, NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

  const inscricoes = await sql`
    select endpoint, p256dh, auth from inscricoes_push where usuario_id = ${uid}::uuid
  `;
  if (inscricoes.length === 0) {
    return Response.json({
      erro: "Este aparelho não está inscrito. Toque em “Ativar as mensagens” primeiro.",
    }, { status: 400 });
  }

  const msg = await palavraDoBloco();
  if (!msg) return Response.json({ erro: "Nenhum versículo ativo." }, { status: 500 });

  const carga = JSON.stringify({
    titulo: msg.referencia,
    corpo: msg.texto,
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/`,
  });

  let aceitos = 0;
  let mortos = 0;

  for (const ins of inscricoes) {
    try {
      await webpush.sendNotification(
        { endpoint: ins.endpoint, keys: { p256dh: ins.p256dh, auth: ins.auth } },
        carga,
        { urgency: "high", TTL: 86400 },
      );
      aceitos++;
    } catch (e: any) {
      // Mesma limpeza da rota de disparo: endereco morto sai do banco, senao
      // ficamos tentando para sempre. O ReinscreverPush cria um novo na
      // proxima abertura do app.
      if (e?.statusCode === 404 || e?.statusCode === 410) {
        await sql`delete from inscricoes_push where endpoint = ${ins.endpoint}`;
        mortos++;
      }
    }
  }

  return Response.json({
    aparelhos: inscricoes.length,
    aceitos,
    mortos,
    referencia: msg.referencia,
  });
}
