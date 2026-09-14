"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Voltar from "../Voltar";

type Pedido = {
  id: number;
  texto: string;
  criado_em: string;
  apelido: string | null;
  oracoes: number;
  ja_orei: boolean;
  meu: boolean;
};

const LIMITE = 400;

function quando(data: string): string {
  const minutos = Math.round((Date.now() - new Date(data).getTime()) / 60000);
  if (minutos < 1) return "agora";
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.round(minutos / 60);
  if (horas < 24) return `há ${horas}h`;
  const dias = Math.round(horas / 24);
  return dias === 1 ? "ontem" : `há ${dias} dias`;
}

export default function Oracao() {
  const [pedidos, setPedidos] = useState<Pedido[] | null>(null);
  const [erroLista, setErroLista] = useState(false);
  const [temPerfil, setTemPerfil] = useState<boolean | null>(null);

  const [texto, setTexto] = useState("");
  const [anonimo, setAnonimo] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [recado, setRecado] = useState("");

  const carregar = useCallback(async () => {
    setErroLista(false);
    try {
      const r = await fetch("/api/oracao");
      if (!r.ok) throw new Error(String(r.status));
      const d = await r.json();
      setPedidos(Array.isArray(d.pedidos) ? d.pedidos : []);
    } catch {
      setPedidos(null);
      setErroLista(true);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/usuario");
        const d = r.ok ? await r.json() : null;
        setTemPerfil(Boolean(d?.usuario));
      } catch {
        setTemPerfil(false);
      }
    })();
    carregar();
  }, [carregar]);

  async function publicar() {
    setEnviando(true);
    setErro("");
    setRecado("");
    try {
      const r = await fetch("/api/oracao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto, anonimo }),
      });
      const d = await r.json().catch(() => null);
      if (!r.ok) {
        setErro(d?.erro ?? "Não deu para publicar agora.");
        return;
      }
      setTexto("");
      setRecado("Seu pedido foi publicado. Que Deus console você.");
      await carregar();
    } catch {
      setErro("Não deu para publicar. Verifique sua conexão.");
    } finally {
      setEnviando(false);
    }
  }

  async function orar(id: number) {
    // Marca na tela antes da resposta: o gesto tem que parecer imediato.
    setPedidos((atual) =>
      atual?.map((p) =>
        p.id === id ? { ...p, ja_orei: true, oracoes: p.oracoes + 1 } : p,
      ) ?? null,
    );
    try {
      const r = await fetch("/api/oracao/orei", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pedidoId: id }),
      });
      const d = await r.json().catch(() => null);
      if (!r.ok) throw new Error();
      // Ajusta pelo numero real do servidor, caso a conta local tenha errado.
      setPedidos((atual) =>
        atual?.map((p) => (p.id === id ? { ...p, oracoes: d.oracoes } : p)) ?? null,
      );
    } catch {
      // Desfaz a marcacao otimista se o servidor recusou.
      setPedidos((atual) =>
        atual?.map((p) =>
          p.id === id ? { ...p, ja_orei: false, oracoes: Math.max(0, p.oracoes - 1) } : p,
        ) ?? null,
      );
      setErro("Não deu para registrar sua oração agora.");
    }
  }

  async function apagar(id: number) {
    try {
      const r = await fetch("/api/oracao", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pedidoId: id }),
      });
      if (!r.ok) throw new Error();
      setPedidos((atual) => atual?.filter((p) => p.id !== id) ?? null);
    } catch {
      setErro("Não deu para apagar agora.");
    }
  }

  return (
    <main>
      <Voltar />
      <h1>Pedidos de oração</h1>
      <p className="referencia">Ninguém precisa passar por isso sozinho</p>

      {temPerfil === false ? (
        <p style={{ marginTop: "1.5rem" }}>
          Para publicar um pedido ou orar por alguém, escolha um nome primeiro.{" "}
          <Link href="/quiz">Leva menos de um minuto.</Link>
        </p>
      ) : (
        <div className="caixa-pedido">
          <label htmlFor="pedido" className="referencia">
            Pelo que você quer que orem?
          </label>
          <textarea
            id="pedido"
            value={texto}
            onChange={(e) => setTexto(e.target.value.slice(0, LIMITE))}
            placeholder="Escreva com suas palavras. Ninguém vai julgar."
            rows={3}
          />
          <div className="pedido-rodape">
            <label className="pedido-anonimo">
              <input
                type="checkbox"
                checked={anonimo}
                onChange={(e) => setAnonimo(e.target.checked)}
              />
              <span>Publicar sem meu nome</span>
            </label>
            <span className="referencia">
              {texto.length}/{LIMITE}
            </span>
          </div>

          {erro && <p style={{ color: "var(--barro)" }}>{erro}</p>}
          {recado && <p style={{ color: "var(--tinta-suave)" }}>{recado}</p>}

          <button
            className="botao"
            onClick={publicar}
            disabled={enviando || texto.trim().length < 5}
          >
            {enviando ? "Publicando…" : "Publicar pedido"}
          </button>
        </div>
      )}

      {erroLista ? (
        <p style={{ marginTop: "2rem" }}>
          Os pedidos não carregaram agora.{" "}
          <button className="voltar voltar-discreto" onClick={carregar}>
            Tentar de novo
          </button>
        </p>
      ) : pedidos === null ? (
        <p style={{ marginTop: "2rem" }}>Carregando…</p>
      ) : pedidos.length === 0 ? (
        <p style={{ marginTop: "2rem" }}>
          Ainda não há pedidos. Se você está passando por algo, pode ser o
          primeiro — e alguém vai orar.
        </p>
      ) : (
        <ul className="pedidos">
          {pedidos.map((p) => (
            <li key={p.id}>
              <p className="pedido-texto">{p.texto}</p>
              <p className="pedido-quem">
                {p.apelido ?? "Alguém"} · {quando(p.criado_em)}
              </p>
              <div className="pedido-acoes">
                <button
                  className={`orei${p.ja_orei ? " orei-feito" : ""}`}
                  onClick={() => orar(p.id)}
                  disabled={p.ja_orei || temPerfil === false}
                >
                  {p.ja_orei ? "Você orou" : "Orei por você"}
                  {p.oracoes > 0 && <span className="orei-conta">{p.oracoes}</span>}
                </button>
                {p.meu && (
                  <button className="voltar voltar-discreto" onClick={() => apagar(p.id)}>
                    Apagar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <footer className="rodape">
        Os pedidos são escritos por outras pessoas e aparecem sem revisão. Não
        publique telefone, endereço ou dados de terceiros. Você pode apagar o
        seu pedido quando quiser.
      </footer>
    </main>
  );
}
