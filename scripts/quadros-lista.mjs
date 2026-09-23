/**
 * A lista unica dos quadros do quebra-cabeca.
 *
 * Todo quadro vem de uma imagem que o Jerry mandou, recortada por
 * `scripts/importar-quadro.mjs` para `public/quadros/{nome}.png`. O texto
 * mora aqui e o desenho ali — uma lista so, para nao poderem discordar.
 *
 * Ate setembro de 2026 havia tambem quadros DESENHADOS em SVG, feitos porque
 * daqui nao da para baixar arte nenhuma (o servidor do Wikimedia recusa toda
 * requisicao). Eram provisorios e sairam assim que chegaram imagens de
 * verdade: perdiam feio na comparacao.
 *
 * IMAGEM DE TERCEIRO NAO ENTRA. Se o arquivo tem marca d'agua de quem vende,
 * e de banco de imagens, ou e foto de producao com atores, fica de fora — o
 * app e publico e publicar e redistribuir. Ja recusei tres por isso. Marca do
 * proprio gerador de IA na imagem que o Jerry gerou e outra coisa: a imagem e
 * dele.
 */
export const LISTA = [
  {
    nome: "jesus-e-os-discipulos",
    origem: "imagem",
    titulo: "Jesus e os discípulos",
    versiculo: "Marcos 10:32",
    significado:
      "Eles andaram juntos por três anos, a pé, de vila em vila. O ensino de Jesus não aconteceu numa sala de aula: aconteceu na estrada, conversando enquanto caminhavam.",
  },
  {
    nome: "a-pomba",
    origem: "imagem",
    titulo: "A pomba",
    versiculo: "Mateus 3:16",
    significado:
      "Quando Jesus foi batizado, o Espírito desceu sobre ele como uma pomba. É a mesma ave que voltou à arca com a folha de oliveira — na Bíblia, pomba é sinal de que a paz chegou.",
  },
  {
    nome: "o-caminho-estreito",
    origem: "imagem",
    titulo: "O caminho estreito",
    versiculo: "Mateus 7:14",
    significado:
      "Jesus falou de dois caminhos: um largo e fácil, outro estreito e apertado. Não disse que o estreito é ruim — disse que é o que leva à vida, e que poucos o encontram.",
  },
  {
    nome: "a-ceia",
    origem: "imagem",
    titulo: "A ceia",
    versiculo: "Lucas 22:19",
    significado:
      "Na última noite, Jesus partiu o pão e disse: fazei isto em memória de mim. Estavam todos ali, inclusive quem ia negá-lo e quem ia entregá-lo.",
  },
  {
    nome: "pescadores-de-homens",
    origem: "imagem",
    titulo: "Pescadores de homens",
    versiculo: "Mateus 4:19",
    significado:
      "Pedro e André estavam trabalhando quando Jesus passou e disse: vinde após mim, e eu vos farei pescadores de homens. Largaram as redes ali mesmo.",
  },
  {
    nome: "as-portas-de-jerusalem",
    origem: "imagem",
    titulo: "As portas de Jerusalém",
    versiculo: "Salmos 122:2",
    significado:
      "Jerusalém era o destino das grandes viagens: três vezes por ano o povo subia para as festas. Chegar às portas, depois de dias de estrada, era o fim de uma caminhada esperada o ano inteiro.",
  },
];
