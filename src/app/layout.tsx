import "./globals.css";
import type { Metadata, Viewport } from "next";
import { LateralEsquerda, LateralDireita, BarraInferior } from "./Navegacao";

export const metadata: Metadata = {
  title: "Semeia",
  description: "Versiculos ao longo do dia e um quiz para conhecer a Biblia.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Voce conhece a Biblia?",
    description: "25 perguntas. Responda e veja onde você está no ranking da semana.",
    type: "website",
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
