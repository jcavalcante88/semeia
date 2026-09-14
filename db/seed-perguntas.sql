-- Segunda leva de perguntas do Semeia (38 novas, total 50).
-- Texto biblico: Almeida 1911 (dominio publico).
-- Rode UMA VEZ, depois do seed.sql. Rodar duas vezes duplica tudo.
--
-- Tom: quem erra recebe a explicacao com gentileza. As explicacoes
-- assumem que a pessoa pode nunca ter aberto uma Biblia.

insert into perguntas (enunciado, alternativas, correta, explicacao, versiculo, nivel) values

-- ---------------------------------------------------------------
-- Facil
-- ---------------------------------------------------------------
('Quem construiu a arca?',
 '["Moisés","Noé","Abraão","Jó"]'::jsonb, 1,
 'Noé passou anos construindo um barco enorme em terra seca, porque acreditou num aviso que ninguém mais levou a sério.',
 'Gênesis 6:14', 'facil'),

('Quantos dias choveu durante o dilúvio?',
 '["7","40","100","365"]'::jsonb, 1,
 'Quarenta dias e quarenta noites. Esse número aparece várias vezes na Bíblia marcando períodos de espera e transformação.',
 'Gênesis 7:12', 'facil'),

('Qual é o último livro da Bíblia?',
 '["Judas","Apocalipse","Malaquias","Atos"]'::jsonb, 1,
 'Apocalipse significa "revelação". É um livro de visões, escrito para dar esperança a cristãos que sofriam perseguição.',
 'Apocalipse 1:1', 'facil'),

('Quantos mandamentos Deus entregou a Moisés no monte?',
 '["5","7","10","12"]'::jsonb, 2,
 'Dez, escritos em tábuas de pedra. São regras curtas sobre como tratar a Deus e às pessoas ao redor.',
 'Êxodo 20:1-17', 'facil'),

('Qual era o trabalho de Jesus antes de começar a ensinar?',
 '["Pescador","Carpinteiro","Pastor","Escriba"]'::jsonb, 1,
 'Carpinteiro, o ofício de José. Jesus passou a maior parte da vida trabalhando com as mãos, numa cidade pequena.',
 'Marcos 6:3', 'facil'),

('Em que rio Jesus foi batizado?',
 '["Nilo","Eufrates","Jordão","Tigre"]'::jsonb, 2,
 'No rio Jordão, que corta Israel de norte a sul. Era ali que João Batista pregava e batizava as pessoas.',
 'Mateus 3:13', 'facil'),

('Quem batizou Jesus?',
 '["Pedro","João Batista","André","Tiago"]'::jsonb, 1,
 'João Batista, primo de Jesus. Ele mesmo achou estranho o pedido e disse que quem precisava ser batizado era ele.',
 'Mateus 3:13-14', 'facil'),

('Qual foi o primeiro milagre de Jesus?',
 '["Curar um cego","Transformar água em vinho","Multiplicar pães","Andar sobre as águas"]'::jsonb, 1,
 'Numa festa de casamento, em Caná, o vinho acabou e Jesus transformou água em vinho para não deixar os noivos passarem vergonha.',
 'João 2:11', 'facil'),

('Quantas pessoas entraram na arca de Noé?',
 '["4","6","8","12"]'::jsonb, 2,
 'Oito: Noé, a esposa, os três filhos e as três noras. Uma família inteira coube na história toda.',
 'Gênesis 7:13', 'facil'),

('Qual é o nome da mãe de Jesus?',
 '["Marta","Maria","Ana","Isabel"]'::jsonb, 1,
 'Maria era uma jovem de Nazaré, uma cidade tão pequena que virou piada na época.',
 'Lucas 1:30-31', 'facil'),

('Quem foi lançado na cova dos leões?',
 '["Daniel","José","Jeremias","Elias"]'::jsonb, 0,
 'Daniel foi condenado por continuar orando quando isso virou crime. Passou a noite entre leões e saiu sem um arranhão.',
 'Daniel 6:16', 'facil'),

('Quem foi engolido por um grande peixe?',
 '["Jó","Jonas","Oséias","Amós"]'::jsonb, 1,
 'Jonas fugiu de barco para o lado oposto ao que Deus tinha pedido. A história é sobre alguém que muda de ideia — e é acolhido de volta.',
 'Jonas 1:17', 'facil'),

('Segundo a Bíblia, qual foi o primeiro homem?',
 '["Abel","Adão","Caim","Sete"]'::jsonb, 1,
 'Adão. O nome vem de uma palavra hebraica para "terra", lembrando de que material ele teria sido formado.',
 'Gênesis 2:7', 'facil'),

('Quantos evangelhos existem no Novo Testamento?',
 '["2","3","4","5"]'::jsonb, 2,
 'Quatro: Mateus, Marcos, Lucas e João. Cada um conta a vida de Jesus de um ângulo diferente, para leitores diferentes.',
 'Lucas 1:1-4', 'facil'),

('Quem entregou Jesus por trinta moedas de prata?',
 '["Pedro","Judas Iscariotes","Tomé","Barrabás"]'::jsonb, 1,
 'Judas era um dos doze e cuidava do dinheiro do grupo. Andou três anos ao lado de Jesus antes disso.',
 'Mateus 26:14-15', 'facil'),

('Quem negou conhecer Jesus três vezes?',
 '["João","Tiago","Pedro","Tomé"]'::jsonb, 2,
 'Pedro, com medo, negou três vezes numa mesma noite. Foi perdoado e acabou virando líder da igreja — a queda não foi o fim da história dele.',
 'Lucas 22:61-62', 'facil'),

-- ---------------------------------------------------------------
-- Medio
-- ---------------------------------------------------------------
('Quantos dias Jesus passou jejuando no deserto?',
 '["7","30","40","50"]'::jsonb, 2,
 'Quarenta dias, sozinho, antes de começar a ensinar. Foi ali que ele enfrentou as três tentações.',
 'Mateus 4:1-2', 'medio'),

('Quem sucedeu Moisés na liderança do povo de Israel?',
 '["Josué","Calebe","Arão","Gideão"]'::jsonb, 0,
 'Josué. Moisés levou o povo até a fronteira, mas foi Josué quem entrou na terra prometida com eles.',
 'Josué 1:1-2', 'medio'),

('Qual cidade teve as muralhas derrubadas depois de sete voltas do povo?',
 '["Jerusalém","Jericó","Babilônia","Nínive"]'::jsonb, 1,
 'Jericó. O povo deu uma volta por dia durante seis dias e sete voltas no sétimo, sem atacar — e as muralhas caíram.',
 'Josué 6:20', 'medio'),

('Quem foi o primeiro rei de Israel?',
 '["Davi","Saul","Salomão","Samuel"]'::jsonb, 1,
 'Saul. O povo pediu um rei para ser como as outras nações, e Saul foi escolhido antes de Davi.',
 '1 Samuel 10:1', 'medio'),

('Quantos homens Jesus alimentou com cinco pães e dois peixes?',
 '["500","1000","5000","10000"]'::jsonb, 2,
 'Cerca de cinco mil homens, sem contar mulheres e crianças. A comida saiu da marmita de um menino.',
 'Mateus 14:19-21', 'medio'),

('Qual apóstolo só acreditou na ressurreição depois de ver as marcas?',
 '["Pedro","Tomé","Filipe","Bartolomeu"]'::jsonb, 1,
 'Tomé. Jesus não o repreendeu: apareceu de novo e ofereceu as próprias mãos para ele tocar. A dúvida dele foi levada a sério.',
 'João 20:25-27', 'medio'),

('Em que dia da semana Jesus ressuscitou?',
 '["Sexta-feira","Sábado","Domingo","Segunda-feira"]'::jsonb, 2,
 'No primeiro dia da semana, o domingo. É por isso que os cristãos se reúnem nesse dia desde o começo.',
 'Marcos 16:9', 'medio'),

('Quem escreveu o livro de Apocalipse?',
 '["Paulo","Pedro","João","Tiago"]'::jsonb, 2,
 'João, já idoso e exilado na ilha de Patmos por causa da fé.',
 'Apocalipse 1:9', 'medio'),

('O que significa a palavra "evangelho"?',
 '["Boa nova","Lei","Profecia","Oração"]'::jsonb, 0,
 'Boa nova, boa notícia. Era a palavra usada para o anúncio de uma vitória ou de um acontecimento feliz.',
 'Marcos 1:1', 'medio'),

('Qual foi a primeira praga que caiu sobre o Egito?',
 '["Trevas","As águas viraram sangue","Gafanhotos","Rãs"]'::jsonb, 1,
 'As águas do Nilo viraram sangue. Foram dez pragas ao todo, até o Faraó deixar o povo sair.',
 'Êxodo 7:20', 'medio'),

('Quem interpretou os sonhos do Faraó no Egito?',
 '["Daniel","José","Moisés","Arão"]'::jsonb, 1,
 'José, que tinha sido vendido como escravo pelos próprios irmãos e estava preso quando foi chamado.',
 'Gênesis 41:15-16', 'medio'),

('Segundo Gálatas, qual é o primeiro fruto do Espírito citado?',
 '["Amor","Fé","Justiça","Sabedoria"]'::jsonb, 0,
 'O amor encabeça a lista, seguido de alegria, paz, paciência e outras cinco qualidades.',
 'Gálatas 5:22', 'medio'),

('A quem Jesus disse "hoje estarás comigo no paraíso"?',
 '["A Pedro","A um ladrão crucificado ao lado dele","A João","A Maria Madalena"]'::jsonb, 1,
 'A um criminoso condenado, nas últimas horas de vida dele. Não houve tempo de consertar nada — e ainda assim a resposta foi sim.',
 'Lucas 23:43', 'medio'),

('Qual animal falou com o profeta Balaão?',
 '["Cavalo","Jumenta","Camelo","Boi"]'::jsonb, 1,
 'A jumenta que ele montava. A cena tem humor: o animal enxerga o que o profeta não estava enxergando.',
 'Números 22:28', 'medio'),

('Quem foi a primeira pessoa a ver Jesus ressuscitado?',
 '["Pedro","Maria Madalena","João","Tomé"]'::jsonb, 1,
 'Maria Madalena. Numa época em que o testemunho de mulheres nem valia no tribunal, foi a ela que Jesus apareceu primeiro.',
 'João 20:14-16', 'medio'),

-- ---------------------------------------------------------------
-- Dificil
-- ---------------------------------------------------------------
('Quantos anos o povo de Israel andou pelo deserto?',
 '["7","12","40","70"]'::jsonb, 2,
 'Quarenta anos. Uma viagem que levaria semanas virou uma geração inteira de caminhada.',
 'Números 14:33', 'dificil'),

('Qual profeta foi levado ao céu num carro de fogo?',
 '["Eliseu","Elias","Enoque","Isaías"]'::jsonb, 1,
 'Elias. O discípulo Eliseu assistiu à cena e herdou o manto e a missão dele.',
 '2 Reis 2:11', 'dificil'),

('Qual governador romano julgou Jesus?',
 '["Herodes","Pôncio Pilatos","César Augusto","Félix"]'::jsonb, 1,
 'Pôncio Pilatos. Ele disse não encontrar culpa em Jesus, mas cedeu à pressão da multidão.',
 'Mateus 27:22-24', 'dificil'),

('Qual livro conta a história dos primeiros cristãos depois da ressurreição?',
 '["Romanos","Atos dos Apóstolos","Hebreus","Tiago"]'::jsonb, 1,
 'Atos dos Apóstolos, escrito por Lucas como continuação do evangelho dele.',
 'Atos 1:1-2', 'dificil'),

('Em que monte Moisés recebeu as tábuas da lei?',
 '["Sinai","Carmelo","Sião","Nebo"]'::jsonb, 0,
 'No monte Sinai, também chamado de Horebe, no meio do deserto.',
 'Êxodo 19:20', 'dificil'),

('Qual é o nome do lugar onde Jesus orou na noite em que foi preso?',
 '["Getsêmani","Éden","Betânia","Emaús"]'::jsonb, 0,
 'O jardim do Getsêmani, no monte das Oliveiras. Foi ali que ele pediu, se possível, para não passar por aquilo.',
 'Mateus 26:36', 'dificil'),

('Quem é o homem que viveu mais tempo, segundo a Bíblia?',
 '["Noé","Matusalém","Adão","Abraão"]'::jsonb, 1,
 'Matusalém, com 969 anos. O nome dele virou sinônimo de vida longa.',
 'Gênesis 5:27', 'dificil'),

('O que Paulo estava fazendo quando encontrou Jesus no caminho de Damasco?',
 '["Pregando","Perseguindo cristãos","Pescando","Cobrando impostos"]'::jsonb, 1,
 'Ele ia prender cristãos. Virou o maior missionário da igreja — a mesma pessoa, do outro lado.',
 'Atos 9:1-5', 'dificil'),

('Qual rainha arriscou a própria vida para salvar seu povo da morte?',
 '["Ester","Débora","Rute","Mical"]'::jsonb, 0,
 'Ester entrou sem ser chamada diante do rei, o que podia custar a vida dela, e disse: "se perecer, pereci".',
 'Ester 4:16', 'dificil');
