-- Conteúdo inicial. Rode depois do schema.sql.
-- Texto bíblico: Almeida 1911 (domínio público).

insert into mensagens (texto, referencia, tema) values
('O Senhor é o meu pastor; nada me faltará.', 'Salmos 23:1', 'confiança'),
('Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.', 'Salmos 46:1', 'angústia'),
('Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.', 'Mateus 11:28', 'descanso'),
('Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho.', 'Salmos 119:105', 'direção'),
('Não andeis ansiosos por coisa alguma.', 'Filipenses 4:6', 'ansiedade'),
('O amor é sofredor, é benigno; o amor não é invejoso.', '1 Coríntios 13:4', 'amor'),
('Tudo posso naquele que me fortalece.', 'Filipenses 4:13', 'força'),
('Buscai primeiro o reino de Deus, e a sua justiça.', 'Mateus 6:33', 'prioridades'),
('Bem-aventurados os que choram, porque eles serão consolados.', 'Mateus 5:4', 'consolo'),
('Porque onde estiver o vosso tesouro, aí estará também o vosso coração.', 'Mateus 6:21', 'coração'),
('Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum.', 'Salmos 23:4', 'medo'),
('A resposta branda desvia o furor.', 'Provérbios 15:1', 'palavras');

insert into perguntas (enunciado, alternativas, correta, explicacao, versiculo, nivel) values
('Qual é o primeiro livro da Bíblia?',
 '["Êxodo","Gênesis","Salmos","João"]'::jsonb, 1,
 'Gênesis abre a Bíblia contando a criação do mundo. O nome significa "origem".',
 'Gênesis 1:1', 'facil'),

('Segundo Jesus, qual é o maior mandamento?',
 '["Não matarás","Amar a Deus de todo o coração","Guardar o sábado","Honrar pai e mãe"]'::jsonb, 1,
 'Jesus respondeu que amar a Deus acima de tudo é o primeiro e maior mandamento, e que o segundo é semelhante: amar o próximo como a si mesmo.',
 'Mateus 22:37-39', 'facil'),

('Quantos discípulos Jesus escolheu para andar com ele?',
 '["7","10","12","40"]'::jsonb, 2,
 'Foram doze, escolhidos entre pescadores, um cobrador de impostos e outros homens comuns.',
 'Lucas 6:13', 'facil'),

('Em que cidade Jesus nasceu?',
 '["Nazaré","Jerusalém","Belém","Cafarnaum"]'::jsonb, 2,
 'Ele nasceu em Belém, embora tenha crescido em Nazaré — por isso é chamado de nazareno.',
 'Mateus 2:1', 'facil'),

('Quem conduziu o povo de Israel para fora do Egito?',
 '["Abraão","Moisés","Davi","Josué"]'::jsonb, 1,
 'Moisés foi chamado por Deus para tirar o povo da escravidão, mesmo se achando incapaz de falar em público.',
 'Êxodo 3:10', 'facil'),

('O que Davi usou para derrotar Golias?',
 '["Uma espada","Uma funda e uma pedra","Um arco","Uma lança"]'::jsonb, 1,
 'Davi recusou a armadura que lhe ofereceram e foi com a funda de pastor que já sabia usar.',
 '1 Samuel 17:40', 'facil'),

('Quantos livros tem a Bíblia protestante?',
 '["27","39","66","73"]'::jsonb, 2,
 'São 66 livros: 39 no Antigo Testamento e 27 no Novo.',
 'Apocalipse 22:21', 'medio'),

('Qual é o livro mais longo da Bíblia?',
 '["Isaías","Salmos","Jeremias","Gênesis"]'::jsonb, 1,
 'Salmos tem 150 capítulos. É um livro de orações e cantos, escrito por várias pessoas ao longo de séculos.',
 'Salmos 1:1', 'medio'),

('Quem escreveu a maior parte das cartas do Novo Testamento?',
 '["Pedro","Paulo","João","Tiago"]'::jsonb, 1,
 'Paulo escreveu treze cartas. Antes disso, perseguia os cristãos — a mudança dele é uma das histórias mais conhecidas da Bíblia.',
 'Atos 9:3-6', 'medio'),

('Segundo o Salmo 23, o que o Senhor é?',
 '["Meu escudo","Meu pastor","Minha rocha","Minha luz"]'::jsonb, 1,
 'A imagem é a de um pastor que cuida das ovelhas: guia, protege e não deixa faltar o necessário.',
 'Salmos 23:1', 'facil'),

('O que Jesus disse sobre o perdão, quando Pedro perguntou quantas vezes perdoar?',
 '["Até sete vezes","Até setenta vezes sete","Três vezes","Uma vez só"]'::jsonb, 1,
 'A resposta não é uma conta a cumprir: é um jeito de dizer que o perdão não tem limite marcado.',
 'Mateus 18:22', 'medio'),

('Qual é o versículo mais curto da Bíblia em português?',
 '["Orai sem cessar","Jesus chorou","Deus é amor","Não temas"]'::jsonb, 1,
 'Duas palavras, diante do túmulo de um amigo. Mostra que Jesus também sentiu a dor da perda.',
 'João 11:35', 'dificil');
