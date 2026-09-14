import "./globals.css";
import type { Metadata, Viewport } from "next";
import {
  LateralEsquerda,
  LateralDireita,
  BarraInferior,
  CabecalhoMovel,
} from "./Navegacao";

/**
 * `metadataBase` e obrigatorio para o cartao de compartilhamento funcionar:
 * WhatsApp, Facebook e Instagram exigem URL ABSOLUTA na og:image. Sem isto o
 * Next gera um caminho relativo e a previa do link vem sem imagem.
 */
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://semeia-biblia.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Semeia",
  description: "Versículos ao longo do dia e um quiz para conhecer a Bíblia.",
  manifest: "/manifest.json",
  applicationName: "Semeia",
  openGraph: {
    title: "Você conhece a Bíblia?",
    description:
      "25 perguntas com a resposta explicada na hora. Sem cadastro, sem senha.",
    url: SITE,
    siteName: "Semeia",
    locale: "pt_BR",
    type: "website",
    // A imagem vem de src/app/opengraph-image.png, pela convencao do
    // App Router — o Next monta a meta tag sozinho, com as dimensoes certas.
  },
  twitter: {
    card: "summary_large_image",
    title: "Você conhece a Bíblia?",
    description:
      "25 perguntas com a resposta explicada na hora. Sem cadastro, sem senha.",
  },
};

export const viewport: Viewport = {
  themeColor: "#B8860F",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Ceu decorativo. aria-hidden para nao virar ruido no leitor de tela. */}
        <div className="ceu" aria-hidden="true">
          <span className="nuvem nuvem-1" />
          <span className="nuvem nuvem-2" />
          <span className="nuvem nuvem-3" />
          <span className="nuvem nuvem-4" />
        </div>
        <CabecalhoMovel />

        <div className="app">
          <LateralEsquerda />
          <div className="folha">{children}</div>
          <LateralDireita />
        </div>

        <BarraInferior />
      </body>
    </html>
  );
}
