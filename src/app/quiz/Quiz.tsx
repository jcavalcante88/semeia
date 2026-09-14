"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { PerguntaPublica, Perfil, Resultado } from "@/lib/tipos";
import { ehResultado } from "@/lib/tipos";
import AtivarMensagens from "./AtivarMensagens";
import Voltar from "../Voltar";

/** Segundos para responder cada pergunta. */
const SEGUNDOS = 25;

export default function Quiz() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [perguntas, setPerguntas] = useState<PerguntaPublica[] | null>(null);
  const [erroPerguntas, setErroPerguntas] = useState(false);
  const [indice, setIndice] = useState(0);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [erroResposta, setErroResposta] = useState("");
  const [enviandoResposta, setEnviandoResposta] = useState(false);
  const [placar, setPlacar] = useState({ acertos: 0, pontos: 0 });
  const [restante, setRestante] = useState(SEGUNDOS);
  const [pulou, setPulou] = useState(false);

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const r = await fetch("/api/usuario");
        if (!r.ok) throw new Error(String(r.status));
        const d = await r.json();
        if (ativo) setPerfil(d.usuario ?? null);
      } catch {
        // Sem perfil confirmado cai na tela de nome. Pedir o nome de novo
        // e melhor do que travar a pessoa num "Carregando..." eterno.
        if (ativo) setPerfil(null);
      } finally {
        if (ativo) setCarregando(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, []);

  const buscarPerguntas = useCallback(async () => {
    setErroPerguntas(false);
    try {
      const r = await fetch("/api/quiz/perguntas");
      if (!r.ok) throw new Error(String(r.status));
      const d = await r.json();
      if (!Array.isArray(d)) throw new Error("resposta inesperada");
      setPerguntas(d as PerguntaPublica[]);
    } catch {
      // Sem isto, uma falha de rede deixava a lista vazia e a tela anunciava
      // "Por hoje acabou" para quem nunca tinha jogado.
      setPerguntas(null);
      setErroPerguntas(true);
    }
  }, []);

  useEffect(() => {
    if (!perfil) return;
    buscarPerguntas();
  }, [perfil, buscarPerguntas]);

  async function responder(i: number) {
    if (resultado || enviandoResposta || pulou || !perguntas) return;
    setEscolha(i);
    setErroResposta("");
    setEnviandoResposta(true);
    try {
      const r = await fetch("/api/quiz/responder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ perguntaId: perguntas[indice].id, escolha: i }),
      });
      const d = await r.json().catch(() => null);
      // Nunca mostrar "Nao era essa" quando quem falhou foi o servidor.
      if (!r.ok || !ehResultado(d)) throw new Error("resposta invalida");

      setResultado(d);
      if (d.acertou) {
        setPlacar((p) => ({
          acertos: p.acertos + 1,
          pontos: p.pontos + d.pontos,
        }));
      }
    } catch {
      setEscolha(null);
      setErroResposta("Não consegui registrar sua resposta agora. Tente de novo.");
    } finally {
      setEnviandoResposta(false);
    }
  }

  function proxima() {
    setEscolha(null);
    setResultado(null);
    setErroResposta("");
    setPulou(false);
    setRestante(SEGUNDOS);
    setIndice((i) => i + 1);
  }

  /**
   * Relogio por pergunta (SEGUNDOS, no topo do arquivo).
   *
   * Ele so corre enquanto a pessoa ainda nao respondeu. Depois da resposta
   * ele para: a explicacao e o versiculo sao o motivo do app existir, e
   * ninguem vai ler isso com o relogio correndo atras.
   *
   * Quando o tempo acaba, a pergunta e PULADA, nao errada. Gravar como erro
   * queimaria a pergunta para sempre (regra da tentativa unica) so porque a
   * pessoa leu devagar — e o app nao reprova ninguem.
   */
  useEffect(() => {
    if (!perguntas || resultado || pulou || enviandoResposta) return;
    if (indice >= perguntas.length) return;

    if (restante <= 0) {
      setPulou(true);
      return;
    }
    const id = setTimeout(() => setRestante((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [restante, perguntas, resultado, pulou, enviandoResposta, indice]);

  // Depois de avisar que pulou, segue sozinho para a proxima.
  useEffect(() => {
    if (!pulou) return;
    const id = setTimeout(proxima, 1400);
    return () => clearTimeout(id);
  }, [pulou]);

  if (carregando) return <p>Carregando…</p>;
  if (!perfil) return <Cadastro aoEntrar={setPerfil} />;

  if (erroPerguntas) {
    return (
      <main>
        <Voltar />
        <h1>Não deu para carregar as perguntas</h1>
        <p>
          Pode ter sido a conexão. Suas respostas anteriores continuam guardadas.
        </p>
        <button className="botao" onClick={buscarPerguntas}>
          Tentar de novo
        </button>
        <p style={{ marginTop: "1.5rem" }}>
          <Link href="/">Voltar ao início</Link>
        </p>
      </main>
    );
  }

  if (perguntas === null) return <p>Carregando…</p>;

  if (perguntas.length === 0) {
    return (
      <main>
        <Voltar />
        <h1>Por hoje acabou</h1>
        <p>
          Você já respondeu todas as perguntas disponíveis. Perguntas novas
          entram toda semana — ative as mensagens para saber quando chegarem.
        </p>
        <AtivarMensagens />
        <p style={{ marginTop: "1.5rem" }}>
          <Link href="/ranking">Ver o ranking</Link>
        </p>
      </main>
    );
  }

  if (indice >= perguntas.length) {
    return (
      <Fim
        acertos={placar.acertos}
        total={perguntas.length}
        pontos={placar.pontos}
        apelido={perfil.apelido}
      />
    );
  }

  const p = perguntas[indice];

  return (
    <main>
      {/* Saida a esquerda, progresso a direita. Cada resposta ja foi gravada
          no banco, entao sair no meio nao perde nada do que foi respondido. */}
      <nav className="voltar-barra">
        <Link href="/" className="voltar voltar-discreto">
          <span aria-hidden="true">←</span> Sair do quiz
        </Link>
        <span className="referencia">
          {indice + 1} de {perguntas.length}
        </span>
      </nav>

      {/* Duas barras: em cima o tempo desta pergunta, embaixo, fina, o quanto
          falta da rodada inteira. */}
      <div
        className={`progresso progresso-tempo${restante <= 2 && !resultado ? " apertado" : ""}`}
        role="timer"
        aria-label={`${restante} segundos para responder`}
      >
        <div
          className="progresso-barra"
          style={{ width: `${(restante / SEGUNDOS) * 100}%` }}
        />
      </div>

      <div
        className="progresso progresso-rodada"
        role="progressbar"
        aria-valuenow={indice + 1}
        aria-valuemin={1}
        aria-valuemax={perguntas.length}
        aria-label="Progresso da rodada"
      >
        <div
          className="progresso-barra"
          style={{ width: `${((indice + 1) / perguntas.length) * 100}%` }}
        />
      </div>

      <h1 style={{ fontSize: "var(--t-h2)", margin: "1.1rem 0 1.5rem" }}>{p.enunciado}</h1>

      {p.alternativas.map((alt, i) => {
        let classe = "alternativa";
        if (resultado) {
          if (i === resultado.correta) classe += " certa";
          else if (i === escolha) classe += " errada";
        }
        return (
          <button
            key={i}
            className={classe}
            disabled={!!resultado || enviandoResposta || pulou}
            onClick={() => responder(i)}
          >
            {alt}
          </button>
        );
      })}

      {pulou && (
        <p className="explicacao" style={{ marginTop: "1rem" }}>
          O tempo acabou nesta. Ela volta numa próxima rodada — nada foi
          perdido.
        </p>
      )}

      {erroResposta && (
        <p
          className="referencia"
          style={{ color: "var(--barro)", marginTop: "0.75rem" }}
        >
          {erroResposta}
        </p>
      )}

      {resultado && (
        <>
          <div className="explicacao">
            <p>
              <strong>
                {resultado.acertou ? "Isso mesmo." : "Não era essa."}
              </strong>{" "}
              {resultado.explicacao}
            </p>
            <p className="referencia">{resultado.versiculo}</p>
            {resultado.jaRespondida && (
              <p className="referencia">
                Você já tinha respondido esta pergunta, então ela não pontua de novo.
              </p>
            )}
          </div>
          <button className="botao" onClick={proxima}>
            {indice + 1 === perguntas.length ? "Ver meu resultado" : "Próxima pergunta"}
          </button>
        </>
      )}
    </main>
  );
}

/* ---------------------------------------------------------------- */

function Cadastro({ aoEntrar }: { aoEntrar: (u: Perfil) => void }) {
  const [apelido, setApelido] = useState("");
  // Regra 4 (LGPD): conviccao religiosa e dado sensivel. A caixa comeca
  // desmarcada, porque caixa pre-marcada nao e consentimento.
  const [noRanking, setNoRanking] = useState(false);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar() {
    setEnviando(true);
    setErro("");
    try {
      const fuso = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const r = await fetch("/api/usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apelido, noRanking, fuso }),
      });
      const d = await r.json().catch(() => null);
      if (!r.ok || !d?.usuario) {
        setErro(d?.erro ?? "Não deu para entrar agora. Tente de novo.");
        return;
      }
      aoEntrar(d.usuario as Perfil);
    } catch {
      setErro("Não deu para entrar agora. Verifique sua conexão e tente de novo.");
    } finally {
      // No original isto vinha depois do await: uma falha de rede deixava o
      // botao desabilitado para sempre, sem saida a nao ser recarregar.
      setEnviando(false);
    }
  }

  return (
    <main>
      <Voltar>Cancelar</Voltar>
      <h1>Como você quer aparecer?</h1>
      <p>
        Sem cadastro, sem e-mail, sem senha. Só um nome — pode ser o primeiro
        nome ou qualquer coisa.
      </p>

      <input
        type="text"
        value={apelido}
        onChange={(e) => setApelido(e.target.value)}
        placeholder="Seu nome"
        maxLength={24}
      />

      <label style={{ display: "flex", gap: "0.6rem", margin: "1rem 0", lineHeight: 1.4 }}>
        <input
          type="checkbox"
          checked={noRanking}
          onChange={(e) => setNoRanking(e.target.checked)}
        />
        <span>
          Quero aparecer no ranking público com este nome. Sem marcar, você
          joga normalmente e ninguém vê sua pontuação.
        </span>
      </label>

      {erro && <p style={{ color: "var(--barro)" }}>{erro}</p>}

      <button
        className="botao"
        onClick={entrar}
        disabled={enviando || apelido.trim().length < 2}
      >
        {enviando ? "Entrando…" : "Começar"}
      </button>
    </main>
  );
}

function Fim({
  acertos,
  total,
  pontos,
  apelido,
}: {
  acertos: number;
  total: number;
  pontos: number;
  apelido: string;
}) {
  const [recado, setRecado] = useState("");
  const texto = `Acertei ${acertos} de ${total} no quiz bíblico do Semeia. Tenta bater: `;

  async function compartilhar() {
    const url = window.location.origin + "/quiz";
    try {
      if (navigator.share) {
        await navigator.share({ title: "Semeia", text: texto, url });
        return;
      }
      await navigator.clipboard.writeText(texto + url);
      setRecado("Link copiado.");
    } catch (e) {
      // Fechar a folha de compartilhamento dispara AbortError. Isso e a pessoa
      // desistindo, nao um erro: nao mostra recado nenhum.
      if (e instanceof DOMException && e.name === "AbortError") return;
      setRecado(`Não deu para compartilhar. O link é ${url}`);
    }
  }

  return (
    <main>
      <Voltar />
      <h1>
        {acertos} de {total}, {apelido}
      </h1>
      <p className="referencia">+{pontos} pontos nesta rodada</p>

      <p style={{ marginTop: "1.5rem" }}>
        Agora manda para alguém. É assim que a maioria das pessoas chega aqui —
        alguém enviou.
      </p>

      <button className="botao" onClick={compartilhar}>
        Desafiar alguém
      </button>
      {recado && (
        <p className="referencia" style={{ marginTop: "0.75rem" }}>
          {recado}
        </p>
      )}

      <AtivarMensagens />

      <p style={{ marginTop: "1.5rem" }}>
        <Link href="/ranking" className="botao botao-vazado">
          Ver o ranking
        </Link>
      </p>
    </main>
  );
}
