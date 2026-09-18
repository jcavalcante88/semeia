/**
 * Config do Next.
 *
 * So existe por causa do redirecionamento abaixo. Se um dia precisar de mais
 * coisa, e aqui que entra.
 */

/** @type {import("next").NextConfig} */
const config = {
  async redirects() {
    return [
      // O jogo se chamava "Enigma" ate setembro de 2026. Quem salvou o link
      // antigo, ou abriu pelo historico do navegador, cai no lugar certo em
      // vez de ver uma pagina 404. Permanente: o nome nao vai voltar.
      { source: "/enigma", destination: "/soletrar", permanent: true },
    ];
  },
};

export default config;
