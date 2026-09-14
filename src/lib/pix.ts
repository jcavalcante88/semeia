/**
 * Gera o código Pix "copia e cola" (BR Code), sem dependência nenhuma.
 *
 * O formato é o EMV QR do Banco Central: uma sequência de campos
 * `ID + tamanho + valor`, com um CRC16 no fim. São ~60 linhas — não vale
 * instalar biblioteca de pagamento nem de QR code para isto.
 *
 * O valor fica de fora de propósito (campo 54 ausente): assim quem doa
 * digita quanto quiser, de R$ 2 a R$ 200.
 */

/** Monta um campo no formato `ID + tamanho em 2 dígitos + valor`. */
function campo(id: string, valor: string): string {
  return id + String(valor.length).padStart(2, "0") + valor;
}

/**
 * CRC16-CCITT-FALSE: polinômio 0x1021, valor inicial 0xFFFF.
 * É o que o Banco Central exige no campo 63.
 */
export function crc16(texto: string): string {
  let crc = 0xffff;
  for (let i = 0; i < texto.length; i++) {
    crc ^= texto.charCodeAt(i) << 8;
    for (let b = 0; b < 8; b++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Tira acento e o que o padrão não aceita, e corta no limite.
 *
 * O BR Code é ASCII: "JERRY CAMARGO DAS DORES" passa, "SÃO PAULO" não —
 * o acento vira byte inválido e alguns bancos recusam o código inteiro.
 */
function limpar(texto: string, limite: number): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .trim()
    .toUpperCase()
    .slice(0, limite);
}

export function gerarPix({
  chave,
  nome,
  cidade,
}: {
  chave: string;
  nome: string;
  cidade: string;
}): string {
  const conta =
    campo("00", "br.gov.bcb.pix") + // identificador do arranjo, fixo
    campo("01", chave);

  const corpo =
    campo("00", "01") + // versão do payload
    campo("26", conta) + // dados da conta Pix
    campo("52", "0000") + // categoria do recebedor: não informada
    campo("53", "986") + // moeda: real (ISO 4217)
    // campo 54 (valor) ausente de propósito: quem doa escolhe quanto
    campo("58", "BR") +
    campo("59", limpar(nome, 25)) +
    campo("60", limpar(cidade, 15)) +
    campo("62", campo("05", "***")); // sem identificador de transação

  // O CRC é calculado sobre tudo, já incluindo o "6304" do próprio campo.
  const semCrc = corpo + "6304";
  return semCrc + crc16(semCrc);
}
