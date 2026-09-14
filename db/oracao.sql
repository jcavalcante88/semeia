-- Pedidos de oracao. Rode uma vez, depois do schema.sql.

create table if not exists pedidos_oracao (
  id         bigserial primary key,
  usuario_id uuid not null references usuarios(id) on delete cascade,
  texto      text not null check (char_length(trim(texto)) between 5 and 400),
  -- Anonimo por padrao: pedido de oracao costuma carregar doenca, familia,
  -- vicio. Sob a LGPD isso e dado sensivel, e o padrao seguro e nao expor
  -- quem pediu. Mostrar o apelido tem que ser escolha ativa da pessoa.
  anonimo    boolean not null default true,
  criado_em  timestamptz not null default now(),
  -- desligar um pedido sem apagar: `update pedidos_oracao set ativo = false`
  ativo      boolean not null default true
);

create index if not exists pedidos_oracao_recentes_idx
  on pedidos_oracao (criado_em desc);
create index if not exists pedidos_oracao_autor_idx
  on pedidos_oracao (usuario_id);

-- Quem ja orou por qual pedido. A chave primaria composta e a trava: a
-- mesma pessoa nao consegue inflar o contador clicando varias vezes.
create table if not exists oracoes (
  usuario_id uuid   not null references usuarios(id) on delete cascade,
  pedido_id  bigint not null references pedidos_oracao(id) on delete cascade,
  criado_em  timestamptz not null default now(),
  primary key (usuario_id, pedido_id)
);

create index if not exists oracoes_pedido_idx on oracoes (pedido_id);
