-- Atlas biblico: lugares com coordenadas reais, para o mapa de satelite.
-- Rode uma vez, depois do schema.sql.
--
-- POR QUE ESCRITO A MAO, e nao puxado de alguma API:
-- nenhum servico gratuito devolve "onde fica Cafarnaum" de forma confiavel, e
-- errar coordenada aqui poe a pessoa olhando o deserto errado. Cada linha
-- abaixo foi conferida uma a uma. Quando o lugar tem mais de uma localizacao
-- possivel (o monte Sinai e o caso classico), a coluna `incerto` avisa, e a
-- tela DIZ isso — melhor admitir a duvida do que fingir precisao.

create table if not exists lugares (
  id        bigserial primary key,
  nome      text not null unique,
  -- Como aparece na Biblia, se for diferente do nome de hoje.
  atual     text,
  lat       double precision not null,
  lon       double precision not null,
  -- Quanto o mapa aproxima. Cidade pede 13; regiao e mar, 10 ou 11.
  zoom      int not null default 13,
  descricao text not null,
  -- true quando a localizacao e discutida entre estudiosos.
  incerto   boolean not null default false,
  ativo     boolean not null default true,
  -- Nome sem acento e em minusculas, para a busca achar "getsemani". Quem
  -- digita no celular quase nunca poe acento, e a extensao  do
  -- Postgres nao esta ligada neste banco. Preenchida por db/busca-indexar.mjs.
  busca     text not null default ''
);

create index if not exists lugares_nome_idx on lugares (lower(nome));

insert into lugares (nome, atual, lat, lon, zoom, descricao, incerto) values
  ('Jerusalém', null, 31.7683, 35.2137, 13,
   'A cidade do templo e o destino das três grandes festas do ano. Davi a tomou dos jebuseus e fez dela a capital.', false),
  ('Belém', null, 31.7054, 35.2024, 14,
   'Cidade de Davi e lugar do nascimento de Jesus. Fica a menos de 10 km de Jerusalém, a pé em duas horas.', false),
  ('Nazaré', null, 32.7010, 35.2973, 13,
   'A vila onde Jesus cresceu. Era pequena e sem prestígio — daí a pergunta de Natanael: pode vir alguma coisa boa de Nazaré?', false),
  ('Cafarnaum', null, 32.8808, 35.5750, 15,
   'Base de Jesus na Galileia, à beira do lago. Ali ficava a casa de Pedro e a sinagoga onde ele ensinou.', false),
  ('Jericó', null, 31.8700, 35.4440, 13,
   'Uma das cidades mais antigas do mundo, 250 m abaixo do nível do mar. As muralhas caíram diante de Josué.', false),
  ('Mar da Galileia', 'Lago Tiberíades', 32.8000, 35.5900, 11,
   'Lago de água doce cercado de vilas de pescadores. É aqui que Jesus acalmou a tempestade e chamou os primeiros discípulos.', false),
  ('Rio Jordão', null, 31.8370, 35.5390, 14,
   'O rio que Israel atravessou a seco para entrar na terra, e onde João batizava. O ponto marcado é o local tradicional do batismo de Jesus.', false),
  ('Monte das Oliveiras', null, 31.7784, 35.2464, 15,
   'A colina em frente ao templo, do outro lado do vale. Jesus subia ali para orar, e dali partiu a entrada em Jerusalém.', false),
  ('Getsêmani', null, 31.7794, 35.2397, 17,
   'Um olival ao pé do monte das Oliveiras. O nome quer dizer prensa de azeite. Foi ali a oração da última noite.', false),
  ('Gólgota', 'Santo Sepulcro', 31.7784, 35.2298, 17,
   'O lugar da crucificação, fora dos muros da cidade naquela época. Hoje está dentro da cidade velha.', false),
  ('Betânia', null, 31.7710, 35.2620, 15,
   'Vila a caminho de Jerusalém onde moravam Marta, Maria e Lázaro. Jesus se hospedava ali.', false),
  ('Caná da Galileia', null, 32.7470, 35.3390, 14,
   'Onde Jesus transformou água em vinho, numa festa de casamento — o primeiro sinal do evangelho de João.', false),
  ('Monte Carmelo', null, 32.7333, 35.0500, 12,
   'A serra à beira do Mediterrâneo onde Elias enfrentou os 450 profetas de Baal.', false),
  ('Monte Sinai', 'Jebel Musa', 28.5392, 33.9750, 12,
   'Onde Moisés recebeu a lei. A localização é discutida: esta é a tradicional, no sul do Sinai, mas há outras propostas.', true),
  ('Monte Nebo', null, 31.7680, 35.7250, 13,
   'Do alto dele Moisés viu a terra prometida antes de morrer, sem entrar.', false),
  ('Mar Morto', null, 31.5590, 35.4730, 10,
   'O ponto mais baixo da terra firme do planeta. Perto dele ficavam Sodoma e Gomorra.', false),
  ('Hebrom', null, 31.5326, 35.0998, 13,
   'Onde Abraão comprou a caverna para sepultar Sara. Davi reinou ali sete anos antes de tomar Jerusalém.', false),
  ('Berseba', null, 31.2520, 34.7915, 13,
   'O limite sul da terra. A expressão "de Dã a Berseba" quer dizer o país inteiro.', false),
  ('Siló', null, 32.0560, 35.2890, 14,
   'Onde o tabernáculo ficou por séculos, antes do templo. Samuel serviu ali ainda menino.', false),
  ('Samaria', 'Sebastia', 32.2760, 35.1950, 14,
   'Capital do reino do norte. Dela vem o nome dos samaritanos, desprezados pelos judeus da Judeia.', false),
  ('Poço de Jacó', 'Sicar', 32.2100, 35.2830, 16,
   'Onde Jesus conversou com a mulher samaritana — quebrando duas regras de uma vez: falar com samaritano e com mulher desconhecida.', false),
  ('Monte Tabor', null, 32.6870, 35.3900, 14,
   'Monte isolado na Galileia, local tradicional da transfiguração.', true),
  ('Emaús', null, 31.8390, 34.9890, 13,
   'A vila para onde iam os dois discípulos quando Jesus caminhou com eles sem ser reconhecido.', true),
  ('Jope', 'Jaffa', 32.0540, 34.7500, 14,
   'Porto de onde Jonas embarcou fugindo. Séculos depois, Pedro teve ali a visão que abriu a igreja aos não judeus.', false),
  ('Sarepta', null, 33.4560, 35.2970, 14,
   'Vila fenícia onde a viúva alimentou Elias durante a seca com o pouco que tinha.', false),
  ('Tiro', null, 33.2704, 35.2038, 13,
   'Cidade portuária fenícia, rica e poderosa. Vários profetas anunciaram sua queda.', false),
  ('Nínive', 'Mossul', 36.3600, 43.1520, 12,
   'Capital da Assíria, a cidade que Jonas não queria que se arrependesse.', false),
  ('Babilônia', null, 32.5422, 44.4208, 13,
   'Para onde o povo de Judá foi levado cativo por setenta anos. Daniel serviu na corte daqui.', false),
  ('Ur dos Caldeus', null, 30.9626, 46.1030, 13,
   'A cidade de onde saiu a família de Abraão, no sul da Mesopotâmia.', false),
  ('Damasco', null, 33.5138, 36.2765, 12,
   'Para onde Saulo ia prender cristãos quando foi derrubado pela luz no caminho.', false),
  ('Antioquia', 'Antáquia', 36.2020, 36.1600, 12,
   'Onde os seguidores de Jesus foram chamados de cristãos pela primeira vez, e de onde Paulo partiu nas viagens.', false),
  ('Éfeso', null, 37.9410, 27.3410, 14,
   'Grande cidade da Ásia Menor, com o templo de Diana. Paulo ficou ali quase três anos.', false),
  ('Filipos', null, 41.0130, 24.2870, 14,
   'Primeira igreja da Europa. Aqui Lídia se converteu e um terremoto abriu a prisão de Paulo e Silas.', false),
  ('Tessalônica', null, 40.6401, 22.9444, 12,
   'Cidade da Macedônia que recebeu as duas cartas mais antigas de Paulo.', false),
  ('Corinto', null, 37.9060, 22.8790, 13,
   'Cidade portuária grega, rica e barulhenta. A igreja de lá tinha dons de sobra e confusão do mesmo tamanho.', false),
  ('Atenas', null, 37.9838, 23.7275, 12,
   'Onde Paulo pregou no Areópago, começando pelo altar ao deus desconhecido.', false),
  ('Roma', null, 41.9028, 12.4964, 11,
   'A capital do império, destino final de Paulo. A carta aos Romanos foi escrita a uma igreja que ele ainda não conhecia.', false),
  ('Malta', null, 35.9375, 14.3754, 11,
   'A ilha onde Paulo naufragou e foi picado por uma víbora sem sofrer nada.', false),
  ('Patmos', null, 37.3090, 26.5470, 12,
   'Ilha de degredo no mar Egeu, onde João escreveu o Apocalipse.', false),
  ('Cesareia Marítima', null, 32.5000, 34.8917, 14,
   'Porto romano onde Cornélio foi batizado e onde Paulo ficou preso dois anos.', false),
  ('Gadara', 'Umm Qais', 32.6500, 35.6833, 14,
   'Região a leste do lago onde Jesus curou o homem que vivia entre os túmulos.', true),
  ('Mar Vermelho', null, 29.5000, 32.8000, 9,
   'O mar que se abriu na saída do Egito. O ponto de travessia é discutido; este é o golfo de Suez.', true);
