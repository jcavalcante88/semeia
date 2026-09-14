import { ImageResponse } from "next/og";

export const runtime = "edge";

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

  const OURO_CLARO = "#F3D06A";
  const OURO = "#C28F1E";
  const OURO_ESCURO = "#8A5F12";
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
          background: `linear-gradient(160deg, ${OURO_CLARO} 0%, ${OURO} 52%, ${OURO_ESCURO} 100%)`,
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
            background:
              "radial-gradient(circle, rgba(255,247,220,0.42) 0%, rgba(255,247,220,0.16) 42%, rgba(255,247,220,0) 68%)",
            display: "flex",
          }}
        />

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
          no quiz bíblico
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 90,
            padding: "26px 60px",
            borderRadius: 100,
            background: BRANCO,
            color: OURO_ESCURO,
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
