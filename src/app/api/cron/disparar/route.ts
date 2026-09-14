import { sql } from "@/lib/db";
import webpush from "web-push";

export const runtime = "nodejs"; // web-push precisa de Node, nao roda no edge
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * As chaves VAPID sao lidas so na hora do disparo, nunca no topo do modulo.
 * No topo, `next build` importa este arquivo para coletar as rotas, executa a
 * validacao e quebra o build inteiro com "Vapid public key should be 65 bytes"
 * sempre que as variaveis ainda nao estiverem configuradas no ambiente.
 */
function configurarVapid() {
  const { VAPID_SUBJECT, NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;
  if (!VAPID_SUBJECT || !NEXT_PUBLIC_VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    throw new Error("Chaves VAPID ausentes no ambiente.");
  }
  webpush.setVapidDetails(
    VAPID_SUBJECT,
    NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY,
  );
}

export async function POST(req: Request) {
  const esperado = `Bearer ${process.env.CRON_SECRET}`;
  if (req.headers.get("authorization") !== esperado) {
    return new Response("Nao autorizado", { status: 401 });
  }

  try {
    configurarVapid();
  } catch (e: any) {
    return Response.json({ erro: e.message }, { status: 500 });
  }

  // Quem escolheu receber neste horario, no fuso de cada um.
  // O Postgres resolve o horario de verao sozinho - nao faca essa conta em JS.
  //
  // A janela cobre a hora atual E a anterior porque o GitHub Actions atrasa o
  // agendamento quando esta congestionado. Com igualdade exata em 'HH24:00',
  // um atraso que cruzasse a virada da hora fazia o envio ser pulado em
  // silencio. O `not exists` logo abaixo e o que impede a janela de dobrar o
  // envio: quem ja recebeu algo na ultima hora e meia fica de fora.
  const devidos = await sql`
    select distinct u.id, u.apelido
      from usuarios u
      join preferencias p on p.usuario_id = u.id
      join inscricoes_push i on i.usuario_id = u.id
     where p.ativo
       and (
         to_char(now() at time zone u.fuso_horario, 'HH24:00') = any (p.horarios)
         or to_char(
              (now() - interval '1 hour') at time zone u.fuso_horario, 'HH24:00'
            ) = any (p.horarios)
       )
       and not exists (
         select 1 from envios e
          where e.usuario_id = u.id
            and e.enviado_em > now() - interval '90 minutes'
       )
  `;

  let enviadas = 0;
  let removidas = 0;

  for (const usuario of devidos) {
    // Um versiculo que essa pessoa ainda nao recebeu.
    const [msg] = await sql`
      select m.id, m.texto, m.referencia, m.versao
        from mensagens m
       where m.ativa
         and not exists (
           select 1 from envios e
            where e.usuario_id = ${usuario.id}::uuid and e.mensagem_id = m.id
         )
       order by random()
       limit 1
    `;
    if (!msg) continue; // acabaram as mensagens ineditas para essa pessoa

    const carga = JSON.stringify({
      titulo: msg.referencia,
      corpo: msg.texto,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/?v=${msg.id}`,
    });

    const inscricoes = await sql`
      select endpoint, p256dh, auth from inscricoes_push
       where usuario_id = ${usuario.id}::uuid
    `;

    let entregues = 0;

    for (const ins of inscricoes) {
      try {
        await webpush.sendNotification(
          {
            endpoint: ins.endpoint,
            keys: { p256dh: ins.p256dh, auth: ins.auth },
          },
          carga,
        );
        enviadas++;
        entregues++;
      } catch (e: any) {
        // 404/410 = a pessoa desinstalou ou limpou o navegador.
        // Apagar evita ficar tentando para sempre.
        if (e?.statusCode === 404 || e?.statusCode === 410) {
          await sql`delete from inscricoes_push where endpoint = ${ins.endpoint}`;
          removidas++;
        }
      }
    }

    // So marca como enviado se alguma notificacao saiu de verdade. Gravando
    // antes, uma falha do servico de push queimava o versiculo: ele contava
    // como entregue e a pessoa nunca mais o receberia.
    if (entregues > 0) {
      await sql`
        insert into envios (usuario_id, mensagem_id)
        values (${usuario.id}::uuid, ${msg.id})
        on conflict do nothing
      `;
    }
  }

  return Response.json({ pessoas: devidos.length, enviadas, removidas });
}
