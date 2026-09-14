"use client";

import { useState } from "react";

export type Evento = {
  id: number;
  titulo: string;
  artista: string | null;
  quando: string;
  local: string;
  cidade: string;
  uf: string | null;
  link: string | null;
  video: string | null;
};

/** Pega o ID do vídeo tanto de youtube.com/watch?v= quanto de youtu.be/. */
function idDoYoutube(url: string): string | null {
  const m =
    url.match(/[?&]v=([A-Za-z0-9_-]{11})/) ??
    url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/) ??
    url.match(/\/embed\/([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function quando(iso: string) {
  const d = new Date(iso);
  const data = new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    timeZone: "America/Sao_Paulo",
  }).format(d);
  const hora = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(d);
  return { data, hora };
}

/**
 * Vídeo do evento, com clique para tocar.
 *
 * Mostra só a miniatura até alguém clicar. Um <iframe> do YouTube carregado
 * de cara puxa alguns megabytes e vários rastreadores em TODA visita à
 * página inicial — inclusive de quem nunca vai assistir. Assim o custo só
 * existe para quem quis ver.
 */
function Video({ url, titulo }: { url: string; titulo: string }) {
  const [tocando, setTocando] = useState(false);
  const id = idDoYoutube(url);
  if (!id) return null;

  if (tocando) {
    return (
      <div className="evento-video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={titulo}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      className="evento-video evento-video-capa"
      onClick={() => setTocando(true)}
      aria-label={`Assistir ao vídeo de ${titulo}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        decoding="async"
      />
      <span className="evento-play" aria-hidden="true">
        ▶
      </span>
    </button>
  );
}

export default function Shows({ eventos }: { eventos: Evento[] }) {
  if (!eventos.length) return null;

  return (
    <>
      <h2>Shows e eventos</h2>
      <p>Onde vai ter louvor perto de você, com dia, hora e endereço.</p>

      <ul className="eventos">
        {eventos.map((e) => {
          const { data, hora } = quando(e.quando);
          return (
            <li key={e.id}>
              {e.video && <Video url={e.video} titulo={e.titulo} />}

              <div className="evento-corpo">
                <p className="evento-quando">
                  {data} · {hora}
                </p>
                <p className="evento-titulo">{e.titulo}</p>
                {e.artista && <p className="evento-artista">{e.artista}</p>}
                <p className="evento-local">
                  {e.local} — {e.cidade}
                  {e.uf && `/${e.uf}`}
                </p>

                <div className="evento-acoes">
                  {/* Abre o mapa do celular com o endereço já preenchido:
                      endereço em texto não leva ninguém a lugar nenhum. */}
                  <a
                    className="voltar"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${e.local}, ${e.cidade}${e.uf ? ` - ${e.uf}` : ""}`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Como chegar
                  </a>
                  {e.link && (
                    <a
                      className="voltar voltar-discreto"
                      href={e.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Mais informações
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
