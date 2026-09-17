-- Enigma: soletrar a resposta com letras embaralhadas.
-- Rode uma vez, depois do schema.sql e dos seeds de perguntas.

/* Quais perguntas viram nível, e em que ordem.
   O nível não fica guardado na pergunta: fica aqui. Assim dá para
   reordenar, tirar um nível ou acrescentar outro sem tocar no quiz. */
create table if not exists enigmas (
  nivel       serial primary key,
  pergunta_id int not null unique references perguntas(id) on delete cascade,
  ativa       boolean not null default true
);

/* Progresso. A chave primária composta é a trava: resolver o mesmo nível
   duas vezes não conta duas vezes — a mesma ideia do "orei por você". */
create table if not exists enigmas_resolvidos (
  usuario_id   uuid not null references usuarios(id) on delete cascade,
  nivel        int  not null,
  tentativas   int  not null default 1,
  resolvido_em timestamptz not null default now(),
  primary key (usuario_id, nivel)
);

create index if not exists enigmas_resolvidos_usuario_idx
  on enigmas_resolvidos (usuario_id);

/* Monta os níveis com as perguntas cuja resposta é UMA palavra.
   Resposta numérica ("40") ou com espaço ("Atos dos Apóstolos") não dá
   para soletrar, então fica de fora — o quiz continua usando todas.

   A ordem é por tamanho da palavra: NOÉ antes de CARPINTEIRO. Isso cria
   uma subida de dificuldade sem ninguém precisar classificar à mão.

   O intervalo À-ÿ cobre os acentos sem precisar da extensão unaccent. */
insert into enigmas (pergunta_id)
select id
  from perguntas
 where ativa
   and (alternativas->>correta) ~ '^[A-Za-zÀ-ÿ]{3,12}$'
 order by length(alternativas->>correta), id
on conflict do nothing;
