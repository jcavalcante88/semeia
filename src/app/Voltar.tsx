import Link from "next/link";

/**
 * Link de saida no topo da tela. Usado em todas as paginas internas para
 * que ninguem fique preso: quem entrou por um link do WhatsApp pode nao
 * ter a seta do navegador a mao, e quem esta no app instalado nao tem
 * barra de endereco nenhuma.
 */
export default function Voltar({
  para = "/",
  children = "Início",
}: {
  para?: string;
  children?: React.ReactNode;
}) {
  return (
    <nav className="voltar-barra">
      <Link href={para} className="voltar">
        <span aria-hidden="true">←</span> {children}
      </Link>
    </nav>
  );
}
