-- Schema do Semeia (Neon / Postgres 16)
-- Cole inteiro no SQL Editor do Neon e rode uma vez.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------
-- Pessoas
-- ---------------------------------------------------------------
create table usuarios (
  id           uuid primary key default gen_random_uuid(),
  apelido      text not null check (char_length(apelido) between 2 and 24),
  fuso_horario text not null default 'America/Sao_Paulo',
  no_ranking   boolean not null default false,   -- opt-in explicito (LGPD)
  criado_em    timestamptz not null default now()
);

create table preferencias (
  usuario_id uuid primary key references usuarios(id) on delete cascade,
  horarios   text[] not null default '{07:00,12:00,20:00}',
  ativo      boolean not null default true
);

create table inscricoes_push (
  id         bigserial primary key,
  usuario_id uuid not null references usuarios(id) on delete cascade,
  endpoint   text not null unique,
  p256dh     text not null,
  auth       text not null,
  criado_em  timestamptz not null default now()
);
create index on inscricoes_push (usuario_id);

-- ---------------------------------------------------------------
-- Mensagens diarias
-- ---------------------------------------------------------------
create table mensagens (
  id         serial primary key,
  texto      text not null,
  referencia text not null,
  tema       text,
  versao     text not null default 'Almeida 1911',
  ativa      boolean not null default true
);

-- Impede repetir o mesmo versiculo para a mesma pessoa
create table envios (
  usuario_id  uuid not null references usuarios(id) on delete cascade,
  mensagem_id int  not null references mensagens(id) on delete cascade,
  enviado_em  timestamptz not null default now(),
  primary key (usuario_id, mensagem_id)
);

-- ---------------------------------------------------------------
-- Quiz
-- ---------------------------------------------------------------
create table perguntas (
  id           serial primary key,
  enunciado    text not null,
  alternativas jsonb not null,          -- ["a","b","c","d"]
  correta      smallint not null,       -- indice dentro de alternativas (0..3)
  explicacao   text not null,
  versiculo    text not null,
  nivel        text not null default 'facil' check (nivel in ('facil','medio','dificil')),
  ativa        boolean not null default true
);

create table respostas (
  id            bigserial primary key,
  usuario_id    uuid not null references usuarios(id) on delete cascade,
  pergunta_id   int  not null references perguntas(id) on delete cascade,
  acertou       boolean not null,
  pontos        int not null default 0,
  respondida_em timestamptz not null default now(),
  -- trava anti-fraude: uma tentativa por pergunta, para sempre
  unique (usuario_id, pergunta_id)
);
create index on respostas (usuario_id);
create index on respostas (respondida_em desc);

-- ---------------------------------------------------------------
-- Ranking
-- ---------------------------------------------------------------
create view ranking_semana as
  select u.id,
         u.apelido,
         count(*) filter (where r.acertou) as acertos,
         count(*)                          as total,
         sum(r.pontos)::int                as pontos
    from respostas r
    join usuarios  u on u.id = r.usuario_id
   where u.no_ranking
     and r.respondida_em >= date_trunc('week', now() at time zone 'America/Sao_Paulo')
                            at time zone 'America/Sao_Paulo'
   group by u.id, u.apelido;

create view ranking_geral as
  select u.id,
         u.apelido,
         count(*) filter (where r.acertou) as acertos,
         count(*)                          as total,
         sum(r.pontos)::int                as pontos
    from respostas r
    join usuarios  u on u.id = r.usuario_id
   where u.no_ranking
   group by u.id, u.apelido;
