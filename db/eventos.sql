-- Shows e eventos cristaos, para o carrossel da tela inicial.
-- Rode uma vez, depois do schema.sql.

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
  ativo     boolean not null default true,
  criado_em timestamptz not null default now()
);

-- A consulta e sempre "os proximos", entao o indice acompanha isso.
create index if not exists eventos_quando_idx on eventos (quando);

-- ---------------------------------------------------------------
-- A TABELA NASCE VAZIA, DE PROPOSITO.
--
-- Show inventado nao e enfeite: aparece na tela com data, hora e endereco,
-- e alguem pode sair de casa por causa dele. Nao ha de onde puxar essa
-- informacao automaticamente — nenhum dos feeds RSS traz agenda — entao
-- cada evento entra a mao, e so quando for verdade.
--
-- O carrossel funciona vazio: sem evento nenhum, ele mostra so noticias.
--
-- Para acrescentar um show, descomente o modelo abaixo e troque os dados.
-- A data vai como ANO-MES-DIA HORA:MINUTO, no fuso de Sao Paulo.
-- ---------------------------------------------------------------

-- insert into eventos (titulo, artista, quando, local, cidade, uf, link) values
--   ('Noite de Louvor',
--    'Nome do artista, ou null',
--    timestamp '2026-10-04 19:30' at time zone 'America/Sao_Paulo',
--    'Nome do lugar', 'Diadema', 'SP',
--    'https://link-do-ingresso-ou-do-evento');

-- Para tirar um evento da tela sem apagar o registro:
--   update eventos set ativo = false where id = 1;
