export type Nivel = "facil" | "medio" | "dificil";

/** O que o navegador PODE ver. Repare: nao existe campo `correta` aqui. */
export type PerguntaPublica = {
  id: number;
  enunciado: string;
  alternativas: string[];
  nivel: Nivel;
};

/** O que so existe no servidor. */
export type PerguntaCompleta = PerguntaPublica & {
  correta: number;
  explicacao: string;
  versiculo: string;
};

export type Resultado = {
  acertou: boolean;
  correta: number;
  explicacao: string;
  versiculo: string;
  pontos: number;
  jaRespondida: boolean;
};

export type LinhaRanking = {
  posicao: number;
  apelido: string;
  acertos: number;
  total: number;
  pontos: number;
  euMesmo: boolean;
};

export type Perfil = {
  id: string;
  apelido: string;
  no_ranking: boolean;
};

/** Confere, em tempo de execução, se o corpo devolvido é mesmo um Resultado. */
export function ehResultado(valor: unknown): valor is Resultado {
  const r = valor as Resultado;
  return (
    !!r &&
    typeof r === "object" &&
    typeof r.acertou === "boolean" &&
    typeof r.correta === "number" &&
    typeof r.explicacao === "string"
  );
}
