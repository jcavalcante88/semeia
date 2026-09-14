import { sql } from "@/lib/db";
import { COOKIE, usuarioAtual } from "@/lib/sessao";
import { cookies } from "next/headers";

export const runtime = "edge";

/** Quem sou eu? Usado pela tela inicial. */
export async function GET() {
  const uid = await usuarioAtual();
  if (!uid) return Response.json({ usuario: null });

  try {
    const [u] = await sql`
      select id, apelido, no_ranking from usuarios where id = ${uid}::uuid
    `;
    return Response.json({ usuario: u ?? null });
  } catch {
    return Response.json({ erro: "Banco indisponivel." }, { status: 503 });
  }
}

/** Cria o perfil (ou atualiza apelido e participacao no ranking). */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const apelido = String(body.apelido ?? "").trim();
  const noRanking = Boolean(body.noRanking);
  const fuso = String(body.fuso ?? "America/Sao_Paulo");

  if (apelido.length < 2 || apelido.length > 24) {
    return Response.json(
      { erro: "Escolha um apelido de 2 a 24 letras." },
      { status: 400 },
    );
  }

  const jar = await cookies();
  const uid = jar.get(COOKIE)?.value;

  let novo: Record<string, any>;
  try {
    if (uid) {
      const [u] = await sql`
        update usuarios
           set apelido = ${apelido}, no_ranking = ${noRanking}
         where id = ${uid}::uuid
        returning id, apelido, no_ranking
      `;
      if (u) return Response.json({ usuario: u });
    }

    [novo] = await sql`
      insert into usuarios (apelido, no_ranking, fuso_horario)
      values (${apelido}, ${noRanking}, ${fuso})
      returning id, apelido, no_ranking
    `;
    await sql`insert into preferencias (usuario_id) values (${novo.id}::uuid)`;
  } catch {
    return Response.json(
      { erro: "Nao foi possivel criar seu perfil agora. Tente de novo." },
      { status: 503 },
    );
  }

  jar.set(COOKIE, novo.id, {
    httpOnly: true,
    // Em http://localhost o navegador descarta cookie `secure`, e o quiz
    // perdia a identidade a cada recarga rodando `npm run dev`.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return Response.json({ usuario: novo });
}
