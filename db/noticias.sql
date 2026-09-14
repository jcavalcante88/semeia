-- Mundo gospel: noticias coletadas dos feeds RSS uma vez por dia.
-- Rode uma vez, depois do schema.sql.

create table if not exists noticias (
  id           bigserial primary key,
  titulo       text not null,
  resumo       text,
  -- o link e a chave de deduplicacao: a mesma materia nunca entra duas vezes,
  -- mesmo que a coleta rode varias vezes no mesmo dia
  link         text not null unique,
  fonte        text not null,
  publicado_em timestamptz,
  coletado_em  timestamptz not null default now(),
  ativa        boolean not null default true
);

create index if not exists noticias_publicado_idx
  on noticias (publicado_em desc nulls last);

-- Quais feeds consultar. Fica no banco, e nao no codigo, para voce
-- ligar e desligar uma fonte sem precisar de deploy.
create table if not exists fontes_noticias (
  id       serial primary key,
  nome     text not null,
  url      text not null unique,
  ativa    boolean not null default true
);

insert into fontes_noticias (nome, url) values
  ('Guiame',     'https://guiame.com.br/rss'),
  ('Gospelmais', 'https://gospelmais.com/noticias/feed')
on conflict (url) do nothing;

-- Imagem de capa da materia, vinda do proprio feed.
alter table noticias add column if not exists imagem text;
