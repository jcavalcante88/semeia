import Diagnostico from "./Diagnostico";

export const metadata = {
  title: "Diagnóstico | Semeia",
  // Fora do menu e fora do Google: é uma página de conserto, não do app.
  robots: { index: false, follow: false },
};

export default function PaginaDiagnostico() {
  return <Diagnostico />;
}
