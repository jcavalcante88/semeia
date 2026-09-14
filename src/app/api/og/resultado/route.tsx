import { ImageResponse } from "next/og";
import { sql } from "@/lib/db";

export const runtime = "edge";

/**
 * O metal do card vem de quantas perguntas a pessoa já acertou em relação ao
 * banco inteiro — não do aproveitamento da rodada.
 *
 * A diferença importa: acertar 10 de 10 não é o mesmo que conhecer a Bíblia.
 * Assim o card vira progressão: começa bronze, vira prata, vira ouro conforme
 * a pessoa aprende de verdade. E o ouro passa a significar alguma coisa.
 */
const NIVEIS = {
  bronze: {
    nome: "Bronze",
    claro: "#A0602F",
    medio: "#7C4622",
    escuro: "#4F2E14",
    brilho: "rgba(255, 228, 200, 0.30)",
  },
  prata: {
    nome: "Prata",
    claro: "#7D8794",
    medio: "#5C6672",
    escuro: "#3A424C",
    brilho: "rgba(238, 244, 250, 0.32)",
  },
  ouro: {
    nome: "Ouro",
    claro: "#A87A17",
    medio: "#8A6212",
    escuro: "#573E0B",
    brilho: "rgba(255, 246, 214, 0.34)",
  },
} as const;

/** Faixas em fração do banco de perguntas, para acompanharem o crescimento dele. */
function nivelPor(acertos: number, banco: number) {
  if (banco <= 0) return NIVEIS.bronze;
  const fatia = acertos / banco;
  if (fatia >= 0.6) return NIVEIS.ouro;
  if (fatia >= 0.3) return NIVEIS.prata;
  return NIVEIS.bronze;
}

/**
 * Card de resultado para o story do Instagram e para o WhatsApp.
 *
 * `next/og` ja vem dentro do Next — nao ha pacote novo, e o desenho e feito
 * com JSX comum, convertido em PNG no servidor.
 *
 * Formato 1080x1920 porque o destino principal e o story. Ele tambem serve
 * de imagem de link: o WhatsApp aceita vertical, so mostra recortado.
 *
 * Uso: /api/og/resultado?a=18&t=25&n=Isabela
 */
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);

  // Tudo que vem da URL e de estranho: limita, arredonda e corta.
  const total = Math.min(Math.max(Number(searchParams.get("t")) || 0, 0), 999);
  const acertos = Math.min(Math.max(Number(searchParams.get("a")) || 0, 0), total);
  const nome = (searchParams.get("n") ?? "").slice(0, 24).trim();

  // Quantas perguntas existem hoje. Se o banco não responder, o card ainda
  // sai — só cai no bronze, que é o padrão seguro.
  let banco = 0;
  try {
    const [r] = await sql`select count(*)::int as n from perguntas where ativa`;
    banco = Number(r?.n) || 0;
  } catch {
    banco = 0;
  }

  const nivel = nivelPor(acertos, banco);
  const BRANCO = "#FFFDF8";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(160deg, ${nivel.claro} 0%, ${nivel.medio} 52%, ${nivel.escuro} 100%)`,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Clarao de luz atras da pomba. Circulo solido virava um disco de
            borda dura por cima do texto; o degrade radial some no meio do
            caminho e vira luz de verdade. */}
        <div
          style={{
            position: "absolute",
            top: 260,
            width: 1080,
            height: 1080,
            background: `radial-gradient(circle, ${nivel.brilho} 0%, rgba(255,255,255,0.10) 42%, rgba(255,255,255,0) 68%)`,
            display: "flex",
          }}
        />

        {/* Selo do nível, no alto. É o que dá sentido à cor do card: sem ele,
            quem recebe não sabe que existe prata e ouro depois. */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 120,
            padding: "18px 52px",
            borderRadius: 100,
            border: `3px solid ${BRANCO}`,
            color: BRANCO,
            fontSize: 42,
            fontWeight: 700,
            letterSpacing: 6,
          }}
        >
          {nivel.nome.toUpperCase()}
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${origin}/pomba.png`} width={320} height={320} alt="" />

        <div
          style={{
            display: "flex",
            fontSize: 52,
            color: BRANCO,
            opacity: 0.92,
            marginTop: 30,
            letterSpacing: 2,
          }}
        >
          {nome ? `${nome} acertou` : "Acertei"}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginTop: 10,
          }}
        >
          <span style={{ fontSize: 300, fontWeight: 700, color: BRANCO, lineHeight: 1 }}>
            {acertos}
          </span>
          <span style={{ fontSize: 110, color: BRANCO, opacity: 0.8 }}>/{total}</span>
        </div>

        <div style={{ display: "flex", fontSize: 54, color: BRANCO, opacity: 0.9 }}>
          No Quiz Bíblico
        </div>

        {banco > 0 && (
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 34,
              color: BRANCO,
              opacity: 0.8,
            }}
          >
            {acertos} das {banco} perguntas da Bíblia
          </div>
        )}

        <div
          style={{
            display: "flex",
            marginTop: 90,
            padding: "26px 60px",
            borderRadius: 100,
            background: BRANCO,
            color: nivel.escuro,
            fontSize: 52,
            fontWeight: 700,
          }}
        >
          Semeia
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 36,
            color: BRANCO,
            opacity: 0.85,
          }}
        >
          Tenta bater o meu placar
        </div>
      </div>
    ),
    { width: 1080, height: 1920 },
  );
}
