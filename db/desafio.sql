-- Desafio do dia: 5 perguntas iguais para todo mundo, trocando a meia-noite.
-- Rode uma vez, depois do schema.sql e dos seeds de perguntas.
--
-- POR QUE TABELA PROPRIA, e nao `respostas`:
-- o quiz tem `unique (usuario_id, pergunta_id)` — uma tentativa por pergunta,
-- para sempre. Gravando o desafio la, responder no desafio QUEIMARIA a
-- pergunta no quiz e mudaria o comportamento dele sem uma linha de codigo
-- mudar. O desafio corre por fora: nao entra no ranking e nao gasta tentativa.

create table if not exists desafio_respostas (
  usuario_id    uuid not null references usuarios(id) on delete cascade,
  -- A data no fuso de Sao Paulo, calculada pelo servidor. Nunca pelo relogio
  -- do navegador: bastaria adiantar o celular para jogar o desafio de amanha.
  dia           date not null,
  pergunta_id   int  not null references perguntas(id) on delete cascade,
  acertou       boolean not null,
  respondida_em timestamptz not null default now(),

  -- A trava: uma tentativa por pergunta por dia, no banco e nao no JavaScript
  -- (regra 2). Sem isto, bastava recarregar a pagina para tentar de novo.
  primary key (usuario_id, dia, pergunta_id)
);

-- Para a media do dia, que aparece na tela de resultado.
create index if not exists desafio_respostas_dia_idx
  on desafio_respostas (dia);

-- Para a sequencia de dias seguidos de cada pessoa.
create index if not exists desafio_respostas_usuario_dia_idx
  on desafio_respostas (usuario_id, dia);

/*
  As 5 perguntas de hoje, iguais para todo mundo.

  `md5(id)` cria um embaralhamento FIXO do banco — sempre o mesmo, mas com a
  dificuldade misturada, coisa que ordenar por id nao daria. A data desliza
  uma janela de 5 sobre esse embaralhamento: cada dia pega as proximas cinco e
  o banco inteiro leva 60 dias para dar a volta.

  A view NAO tem `correta` nem `explicacao`, de proposito (regra 1). Quem
  precisa do gabarito — so o POST, depois que a pessoa escolheu — junta com
  `perguntas` no servidor. Assim nao existe caminho em que a view vaze.

  O 5 aqui tem que bater com POR_DIA em src/app/api/desafio/route.ts.
*/
create or replace view desafio_de_hoje as
with base as (
  select id, enunciado, alternativas, nivel,
         row_number() over (order by md5(id::text || 'semeia-desafio')) - 1 as pos,
         count(*) over () as total
    from perguntas
   where ativa
),
dia as (
  select ((now() at time zone 'America/Sao_Paulo')::date - date '2026-01-01')::int as n
)
select b.id,
       b.enunciado,
       b.alternativas,
       b.nivel,
       ((b.pos - d.n * 5) % b.total + b.total) % b.total as ordem
  from base b, dia d
 where ((b.pos - d.n * 5) % b.total + b.total) % b.total < 5;
