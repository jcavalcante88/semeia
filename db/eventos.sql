-- Shows e eventos gospel. Rode uma vez, depois do schema.sql.

create table if not exists eventos (
  id        bigserial primary key,
  titulo    text not null,
  artista   text,
  -- timestamptz: guarda o instante exato. A exibicao converte para o fuso de
  -- Sao Paulo na hora de mostrar, como no ranking semanal.
  quando    timestamptz not null,
  local     text not null,
  cidade    text not null,
  uf        char(2),
  -- Link para ingresso, evento no Instagram, o que fizer sentido.
  link      text,
  -- URL do YouTube. Se existir, a tela mostra um botao de play. Se nao,
  -- o evento aparece igual, so sem video — nenhum show fica de fora por
  -- nao ter filmagem.
  video     text,
  ativo     boolean not null default true,
  criado_em timestamptz not null default now()
);

-- A consulta e sempre "os proximos", entao o indice acompanha isso.
create index if not exists eventos_quando_idx on eventos (quando);

-- ---------------------------------------------------------------
-- Exemplos. APAGUE e ponha os seus:
--   delete from eventos;
--
-- Para adicionar um show novo, copie o modelo abaixo. A data vai no
-- formato ANO-MES-DIA HORA:MINUTO, no fuso de Sao Paulo.
-- ---------------------------------------------------------------
insert into eventos (titulo, artista, quando, local, cidade, uf, link, video) values
  ('Noite de Louvor',
   'Ministério Semeia',
   timestamp '2026-10-04 19:30' at time zone 'America/Sao_Paulo',
   'Igreja Batista Central', 'Diadema', 'SP',
   null, null),

  ('Culto de Celebração',
   null,
   timestamp '2026-10-18 18:00' at time zone 'America/Sao_Paulo',
   'Praça da Moça', 'Diadema', 'SP',
   null, null);
