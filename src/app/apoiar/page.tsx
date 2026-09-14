import { gerarPix } from "@/lib/pix";
import Apoiar from "./Apoiar";

/**
 * Dados do recebedor.
 *
 * Ficam no código, e não em variável de ambiente, porque não são segredo:
 * o nome, a cidade e a chave aparecem para quem doa — é assim que a pessoa
 * confere para quem está mandando antes de confirmar.
 *
 * A chave é o celular, e chave de celular no padrão Pix precisa do +55.
 * Sem ele, os 11 dígitos seriam lidos como CPF e o banco recusaria.
 */
const CHAVE = "+5511998817076";
const NOME = "Jerry Camargo das Dores";
const CIDADE = "São Paulo";

export const metadata = {
  title: "Apoiar | Semeia",
  description: "Ajude a manter o Semeia no ar com um Pix de qualquer valor.",
};

export default function PaginaApoiar() {
  const codigo = gerarPix({ chave: CHAVE, nome: NOME, cidade: CIDADE });
  return <Apoiar codigo={codigo} chave={CHAVE} nome={NOME} />;
}
