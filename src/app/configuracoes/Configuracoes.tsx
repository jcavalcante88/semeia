"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Perfil } from "@/lib/tipos";
import Voltar from "../Voltar";
import AtivarMensagens from "../quiz/AtivarMensagens";

export default function Configuracoes() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [apelido, setApelido] = useState("");
  const [noRanking, setNoRanking] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [recado, setRecado] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const r = await fetch("/api/usuario");
        if (!r.ok) throw new Error(String(r.status));
        const d = await r.json();
        if (!ativo) return;
        if (d.usuario) {
          setPerfil(d.usuario);
          setApelido(d.usuario.apelido);
          setNoRanking(Boolean(d.usuario.no_ranking));
        }
      } catch {
        if (ativo) setErro("Não consegui carregar seus dados agora.");
      } finally {
        if (ativo) setCarregando(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, []);

  async function salvar() {
    setSalvando(true);
    setRecado("");
    setErro("");
    try {
      const r = await fetch("/api/usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apelido, noRanking }),
      });
      const d = await r.json().catch(() => null);
      if (!r.ok || !d?.usuario) {
        setErro(d?.erro ?? "Não deu para salvar agora. Tente de novo.");
        return;
      }
      setPerfil(d.usuario);
      setRecado("Pronto, salvo.");
    } catch {
      setErro("Não deu para salvar. Verifique sua conexão.");
    } finally {
      setSalvando(false);
    }
  }

  async function desligarMensagens() {
    setRecado("");
    setErro("");
    try {
      const reg = await navigator.serviceWorker?.getRegistration();
      const inscricao = await reg?.pushManager.getSubscription();
      await fetch("/api/push/inscrever", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: inscricao?.endpoint ?? null }),
      });
      await inscricao?.unsubscribe();
      setRecado("As mensagens foram desligadas.");
    } catch {
      setErro("Não deu para desligar agora. Tente de novo.");
    }
  }

  if (carregando) return <main><p>Carregando…</p></main>;

  if (!perfil) {
    return (
      <main>
        <Voltar />
        <h1>Ajustes</h1>
        <p>
          Você ainda não escolheu um nome. Comece pelo quiz — leva menos de
          um minuto e não pede cadastro.
        </p>
        <Link href="/quiz" className="botao">
          Ir para o quiz
        </Link>
      </main>
    );
  }

  const mudou = apelido !== perfil.apelido || noRanking !== Boolean(perfil.no_ranking);

  return (
    <main>
      <Voltar />
      <h1>Ajustes</h1>

      <h2>Seu nome</h2>
      <p>É o nome que aparece no ranking. Ninguém vê seu e-mail — você nem deu um.</p>
      <input
        type="text"
        value={apelido}
        onChange={(e) => setApelido(e.target.value)}
        maxLength={24}
        aria-label="Seu nome"
      />

      <h2>Ranking público</h2>
      <label style={{ display: "flex", gap: "0.6rem", margin: "0.75rem 0", lineHeight: 1.45 }}>
        <input
          type="checkbox"
          checked={noRanking}
          onChange={(e) => setNoRanking(e.target.checked)}
        />
        <span>
          Quero aparecer no ranking público. Desmarcando, você some da lista na
          hora e continua jogando normalmente.
        </span>
      </label>

      {erro && <p style={{ color: "var(--barro)" }}>{erro}</p>}
      {recado && <p style={{ color: "var(--tinta-suave)" }}>{recado}</p>}

      <button
        className="botao"
        onClick={salvar}
        disabled={salvando || !mudou || apelido.trim().length < 2}
      >
        {salvando ? "Salvando…" : mudou ? "Salvar" : "Tudo salvo"}
      </button>

      <h2>Mensagens diárias</h2>
      <AtivarMensagens />
      <p style={{ marginTop: "1rem" }}>
        <button className="botao botao-vazado" onClick={desligarMensagens}>
          Desligar as mensagens
        </button>
      </p>

      <footer className="rodape">
        Sua identidade fica num cookie do próprio navegador. Não há conta, senha
        nem e-mail guardado em lugar nenhum.
        <br />
        Texto bíblico: Almeida 1911, domínio público. Pomba por{" "}
        <a
          href="https://icons8.com.br/icon/kYqbEzjS6EBh/peace-pigeon"
          target="_blank"
          rel="noopener noreferrer"
        >
          Icons8
        </a>
        .
      </footer>
    </main>
  );
}
