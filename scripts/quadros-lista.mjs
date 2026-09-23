/**
 * A lista unica dos quadros do quebra-cabeca.
 *
 * Existe separada porque agora ha dois tipos de quadro:
 *
 *  - `origem: "desenho"`  -> a cena e desenhada por scripts/quadros.mjs
 *  - `origem: "imagem"`   -> a cena vem de um arquivo que o Jerry mandou,
 *                            recortado por scripts/importar-quadro.mjs
 *
 * Os dois caminhos gravam o PNG em `public/quadros/{nome}.png` e leem o texto
 * daqui. Uma lista so, para o desenho e o significado nao poderem discordar.
 *
 * IMAGEM DE TERCEIRO NAO ENTRA AQUI. Se o arquivo tem marca d'agua, e de
 * banco de imagens, ou e foto de producao com atores, fica de fora — o app e
 * publico e publicar e redistribuir. Ja recusei tres por isso.
 */
export const LISTA = [
  {
    nome: "davi-e-golias",
    origem: "desenho",
    titulo: "Davi e Golias",
    versiculo: "1 Samuel 17:45",
    significado:
      "Um pastor adolescente enfrentou o guerreiro que assustava um exército inteiro. Ele recusou a armadura do rei e foi com o que sabia usar: uma funda e cinco pedras do ribeiro.",
  },
  {
    nome: "arca-de-noe",
    origem: "desenho",
    titulo: "A arca de Noé",
    versiculo: "Gênesis 8:11",
    significado:
      "Depois do dilúvio, a pomba voltou com uma folha de oliveira no bico: a água estava baixando. O arco-íris veio em seguida, como promessa de que não haveria outro.",
  },
  {
    nome: "cavaleiro-do-apocalipse",
    origem: "desenho",
    titulo: "O cavaleiro do Apocalipse",
    versiculo: "Apocalipse 6:2",
    significado:
      "João viu quatro cavaleiros saírem quando o livro foi aberto. O primeiro vinha num cavalo branco, com um arco e uma coroa — a visão anuncia que a história tem dono e tem fim.",
  },
  {
    nome: "rio-da-vida",
    origem: "imagem",
    titulo: "O rio da vida",
    versiculo: "Apocalipse 22:1",
    significado:
      "João viu um rio de água viva saindo do trono, e nas duas margens a árvore da vida. É a última cena da Bíblia: um jardim de novo, como no começo, mas sem nada que machuque.",
  },
  {
    nome: "volta-nas-nuvens",
    origem: "imagem",
    titulo: "A volta nas nuvens",
    versiculo: "Apocalipse 1:7",
    significado:
      "Eis que vem com as nuvens, e todo olho o verá. A promessa que fecha a Bíblia não é de fuga do mundo, e sim de alguém voltando para ele.",
  },
];
