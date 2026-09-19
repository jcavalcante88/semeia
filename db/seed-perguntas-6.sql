-- Sexta leva de perguntas do Semeia (52 novas, total 256).
-- Texto biblico: Almeida 1911 (dominio publico).
-- Rode UMA VEZ, e depois `node db/redistribuir-alternativas.mjs`.
--
-- Tema: Genesis e Exodo em detalhe, os reis, e os profetas menores — a
-- parte da Biblia que quase ninguem conhece e que da as perguntas mais
-- interessantes de acertar.

insert into perguntas (enunciado, alternativas, correta, explicacao, versiculo, nivel) values

-- ---------------------------------------------------------------
-- Facil
-- ---------------------------------------------------------------
('Qual era o nome do jardim onde Adão e Eva viviam?',
 '["Éden","Siló","Gósen","Betel"]'::jsonb, 0,
 'Éden quer dizer delícia. O texto descreve quatro rios saindo dali.',
 'Gênesis 2:8', 'facil'),

('De qual árvore Deus proibiu Adão e Eva de comer?',
 '["Da videira","Da figueira","Da árvore do conhecimento do bem e do mal","Da oliveira"]'::jsonb, 2,
 'A Bíblia não diz que fruta era. O que estava em jogo era a confiança, não a fruta.',
 'Gênesis 2:17', 'facil'),

('Quantas tábuas de pedra Moisés trouxe do monte?',
 '["Uma","Duas","Dez","Cinco"]'::jsonb, 1,
 'Duas tábuas, escritas dos dois lados. Ele quebrou as primeiras ao ver o povo adorando o bezerro de ouro.',
 'Êxodo 31:18', 'facil'),

('Qual era o nome do gigante filisteu que Davi enfrentou?',
 '["Golias","Sansão","Ogue","Anaque"]'::jsonb, 0,
 'Golias desafiou o exército de Israel por quarenta dias. Ninguém aceitou, até chegar um pastor adolescente.',
 '1 Samuel 17:4', 'facil'),

('Em que cidade Jesus cresceu?',
 '["Belém","Jerusalém","Nazaré","Cafarnaum"]'::jsonb, 2,
 'Nasceu em Belém e cresceu em Nazaré, uma vila pequena e sem prestígio. Por isso o chamavam de nazareno.',
 'Lucas 2:39', 'facil'),

('Quem visitou Jesus recém-nascido, guiado por uma estrela?',
 '["Os pastores","Os magos do oriente","Os sacerdotes","Os soldados"]'::jsonb, 1,
 'A Bíblia não diz quantos eram nem que fossem reis. Foram três os presentes: ouro, incenso e mirra.',
 'Mateus 2:1', 'facil'),

('O que os anjos anunciaram aos pastores naquela noite?',
 '["O fim do mundo","O nascimento do Salvador","Uma guerra","Uma seca"]'::jsonb, 1,
 'Os pastores eram gente de pouca importância, trabalhando de madrugada. A notícia foi dada a eles primeiro.',
 'Lucas 2:11', 'facil'),

('Quantos filhos Noé levou consigo para dentro da arca?',
 '["Um","Dois","Três","Sete"]'::jsonb, 2,
 'Sem, Cão e Jafé, com as esposas. Com Noé e a mulher dele, oito pessoas ao todo.',
 'Gênesis 7:13', 'facil'),

-- ---------------------------------------------------------------
-- Medio
-- ---------------------------------------------------------------
('Qual mandamento vem com a promessa de vida longa?',
 '["Não matarás","Honrar pai e mãe","Guardar o sábado","Não furtarás"]'::jsonb, 1,
 'É o único dos dez que vem com uma promessa junto. Paulo faz questão de lembrar isso numa das cartas.',
 'Êxodo 20:12', 'medio'),

('Qual é o primeiro pedido do Pai Nosso?',
 '["Santificado seja o teu nome","O pão nosso de cada dia","Perdoa as nossas dívidas","Venha a nós o teu reino"]'::jsonb, 0,
 'Antes de pedir qualquer coisa para si, a oração começa olhando para Deus. Só depois vem o pão.',
 'Mateus 6:9', 'medio'),

('Na armadura de Deus, o que é chamado de espada do Espírito?',
 '["A oração","A palavra de Deus","A fé","A justiça"]'::jsonb, 1,
 'É a única peça de ataque da lista. Todo o resto — capacete, escudo, couraça — serve para resistir.',
 'Efésios 6:17', 'medio'),

('Na armadura de Deus, o que se toma como escudo?',
 '["A fé","A verdade","A salvação","A paz"]'::jsonb, 0,
 'O escudo daquela época era grande, de madeira coberta de couro molhado, e apagava as flechas incendiárias.',
 'Efésios 6:16', 'medio'),

('Quantas igrejas recebem cartas no começo do Apocalipse?',
 '["Três","Sete","Doze","Quatro"]'::jsonb, 1,
 'Sete igrejas reais da Ásia Menor, cada uma com um elogio, uma repreensão e uma promessa.',
 'Apocalipse 1:11', 'medio'),

('Quem perdeu tudo num só dia e ainda disse "o Senhor deu, o Senhor tomou"?',
 '["Jó","Davi","Jeremias","Habacuque"]'::jsonb, 0,
 'Perdeu bens, empregados e os dez filhos em poucas horas. O livro inteiro é ele tentando entender o porquê.',
 'Jó 1:21', 'medio'),

('Quantos amigos foram visitar Jó na desgraça dele?',
 '["Dois","Três","Sete","Dez"]'::jsonb, 1,
 'Ficaram sete dias em silêncio junto dele, e essa foi a melhor parte. Quando começaram a falar, pioraram tudo.',
 'Jó 2:11', 'medio'),

('Quais dois personagens apareceram ao lado de Jesus na transfiguração?',
 '["Abraão e Davi","Moisés e Elias","Pedro e João","Noé e Samuel"]'::jsonb, 1,
 'Moisés representa a lei e Elias os profetas. Pedro quis levantar três tendas e ficar ali.',
 'Mateus 17:3', 'medio'),

('Em que ocasião Jesus lavou os pés dos discípulos?',
 '["Na última ceia","No batismo","Na transfiguração","Na entrada em Jerusalém"]'::jsonb, 0,
 'Lavar pés era trabalho de escravo. Pedro se recusou, até Jesus dizer que sem isso não teria parte com ele.',
 'João 13:5', 'medio'),

('Qual festa judaica os discípulos celebravam quando o Espírito Santo desceu?',
 '["A páscoa","Pentecostes","Os tabernáculos","O purim"]'::jsonb, 1,
 'Jerusalém estava cheia de gente de vários países, e cada um ouviu na própria língua. Foi o dia em que a igreja começou.',
 'Atos 2:1', 'medio'),

('O que Deus confundiu para interromper a construção da torre de Babel?',
 '["O material","A língua deles","O clima","Os planos"]'::jsonb, 1,
 'Eles queriam um nome e um lugar só para si. A confusão das línguas espalhou o povo pela terra.',
 'Gênesis 11:7', 'medio'),

('Qual sobrinho de Abraão foi morar em Sodoma?',
 '["Ló","Ismael","Labão","Naor"]'::jsonb, 0,
 'Ló escolheu a planície bem regada e ficou com a melhor terra. A escolha o levou para dentro da cidade.',
 'Gênesis 13:12', 'medio'),

('No que a mulher de Ló se transformou ao olhar para trás?',
 '["Pedra","Estátua de sal","Árvore","Pó"]'::jsonb, 1,
 'Tinham sido avisados para não olhar. Jesus usa esse episódio séculos depois, em três palavras: lembrai-vos da mulher de Ló.',
 'Gênesis 19:26', 'medio'),

('Quem trocou o direito de primogenitura por um prato de comida?',
 '["Esaú","Jacó","Rúben","Judá"]'::jsonb, 0,
 'Esaú voltou faminto do campo e vendeu o direito de filho mais velho por um guisado de lentilhas.',
 'Gênesis 25:33', 'medio'),

('Com o que Jacó sonhou ao dormir com a cabeça sobre uma pedra?',
 '["Uma escada que ia até o céu","Sete vacas","Um trono","Uma videira"]'::jsonb, 0,
 'Anjos subiam e desciam por ela. Ele acordou e disse: o Senhor está neste lugar e eu não sabia.',
 'Gênesis 28:12', 'medio'),

('Que nome Jacó recebeu depois de lutar a noite inteira?',
 '["Abraão","Israel","Ismael","Isaque"]'::jsonb, 1,
 'Saiu manco daquela luta, e mancando pelo resto da vida. O povo inteiro passou a levar esse nome.',
 'Gênesis 32:28', 'medio'),

('Quem escondeu Moisés bebê num cesto no rio?',
 '["A própria mãe","A irmã dele","Uma vizinha","Uma escrava egípcia"]'::jsonb, 0,
 'Joquebede o escondeu três meses e depois fez o cesto. A irmã ficou vigiando de longe para ver o que aconteceria.',
 'Êxodo 2:3', 'medio'),

('Quem encontrou o cesto de Moisés no rio?',
 '["Uma pastora","A filha do faraó","Uma sacerdotisa","Um soldado"]'::jsonb, 1,
 'Ela sabia que era um menino hebreu e mesmo assim o criou como filho — dentro do palácio de quem mandou matá-los.',
 'Êxodo 2:5', 'medio'),

-- ---------------------------------------------------------------
-- Dificil
-- ---------------------------------------------------------------
('Qual era o nome do pai de Noé?',
 '["Lameque","Matusalém","Enoque","Jarede"]'::jsonb, 0,
 'Lameque, filho de Matusalém. A genealogia de Gênesis 5 liga Adão a Noé em dez gerações.',
 'Gênesis 5:28', 'dificil'),

('Quantos anos tinha Noé quando veio o dilúvio?',
 '["Cem","Trezentos","Seiscentos","Novecentos"]'::jsonb, 2,
 'Seiscentos anos. A construção da arca levou décadas, com o povo assistindo e rindo.',
 'Gênesis 7:6', 'dificil'),

('Qual ave Noé soltou primeiro da arca?',
 '["Uma pomba","Um corvo","Uma águia","Um pardal"]'::jsonb, 1,
 'O corvo foi e voltou até a terra secar. Só depois veio a pomba, que na terceira vez não voltou mais.',
 'Gênesis 8:7', 'dificil'),

('Em que monte a arca de Noé parou?',
 '["Sinai","Ararate","Carmelo","Nebo"]'::jsonb, 1,
 'Nos montes de Ararate, na região onde hoje fica a Turquia.',
 'Gênesis 8:4', 'dificil'),

('Quem foi a serva de Sara que se tornou mãe de Ismael?',
 '["Agar","Zilpa","Bila","Rebeca"]'::jsonb, 0,
 'A ideia foi de Sara, cansada de esperar. Agar fugiu para o deserto e ali encontrou o anjo do Senhor.',
 'Gênesis 16:15', 'dificil'),

('Qual foi a esposa de Isaque?',
 '["Sara","Rebeca","Raquel","Lia"]'::jsonb, 1,
 'O servo de Abraão a encontrou junto a um poço, oferecendo água aos camelos. Ela topou partir sem nunca ter visto o noivo.',
 'Gênesis 24:67', 'dificil'),

('Qual filho de Jacó propôs vender José em vez de matá-lo?',
 '["Rúben","Judá","Levi","Simeão"]'::jsonb, 1,
 'Judá sugeriu a venda, e Rúben tentou salvá-lo escondido. Anos depois Judá se ofereceria como escravo no lugar de Benjamim.',
 'Gênesis 37:26', 'dificil'),

('Qual era o nome do irmão mais novo de José?',
 '["Benjamim","Levi","Dã","Aser"]'::jsonb, 0,
 'Benjamim era o caçula e o outro filho de Raquel. Ela morreu no parto dele.',
 'Gênesis 35:18', 'dificil'),

('Quem foi o artesão escolhido por Deus para construir o tabernáculo?',
 '["Bezalel","Hirão","Zorobabel","Aoliabe"]'::jsonb, 0,
 'É a primeira vez na Bíblia que alguém é descrito como cheio do Espírito de Deus — e é um artesão, não um profeta.',
 'Êxodo 31:2', 'dificil'),

('O que era guardado dentro da arca da aliança?',
 '["As tábuas da lei","Ouro","Os rolos dos profetas","Óleo"]'::jsonb, 0,
 'As tábuas da lei, e junto delas um vaso de maná e a vara de Arão que floresceu.',
 'Deuteronômio 10:5', 'dificil'),

('Quem se rebelou contra Moisés e foi tragado pela terra?',
 '["Corá","Acã","Balaão","Nadabe"]'::jsonb, 0,
 'Corá reuniu duzentos e cinquenta homens contra a liderança de Moisés. A terra se abriu debaixo deles.',
 'Números 16:32', 'dificil'),

('Que objeto Moisés levantou no deserto para curar quem olhasse para ele?',
 '["Uma serpente de bronze","Uma tocha","O cajado","A arca"]'::jsonb, 0,
 'Séculos depois o povo passou a adorar aquele bronze, e o rei Ezequias o destruiu. Jesus compara a si mesmo com essa cena.',
 'Números 21:9', 'dificil'),

('Qual rei pagou Balaão para amaldiçoar o povo de Israel?',
 '["Balaque","Ogue","Siom","Adoni-Zedeque"]'::jsonb, 0,
 'Balaque era rei de Moabe e tinha medo do povo que vinha chegando. Cada vez que Balaão abria a boca, saía bênção.',
 'Números 22:6', 'dificil'),

('Quem eram os filhos corruptos do sacerdote Eli?',
 '["Ofni e Fineias","Nadabe e Abiú","Corá e Datã","Sadoque e Abiatar"]'::jsonb, 0,
 'Roubavam da oferta e abusavam das mulheres que serviam na entrada. Morreram os dois no mesmo dia.',
 '1 Samuel 2:34', 'dificil'),

('Qual mulher convenceu Davi a não matar o próprio marido?',
 '["Abigail","Mical","Bate-Seba","Ana"]'::jsonb, 0,
 'Nabal tinha humilhado os homens de Davi. Abigail saiu ao encontro dele com comida e um discurso, e evitou um massacre.',
 '1 Samuel 25:32', 'dificil'),

('Qual filho de Saul se tornou o melhor amigo de Davi?',
 '["Jônatas","Isbosete","Abinadabe","Malquisua"]'::jsonb, 0,
 'Jônatas era o herdeiro do trono e mesmo assim defendeu Davi do próprio pai, sabendo que perderia a coroa.',
 '1 Samuel 18:1', 'dificil'),

('A quem Saul recorreu na véspera da última batalha?',
 '["A Samuel","A uma médium, em En-Dor","Aos sacerdotes","A Davi"]'::jsonb, 1,
 'Ele mesmo tinha expulsado os médiuns do país, e foi procurar um disfarçado, de noite. Foi a última noite da vida dele.',
 '1 Samuel 28:7', 'dificil'),

('Qual general matou Absalão contra a ordem expressa do rei Davi?',
 '["Joabe","Abner","Benaia","Amasa"]'::jsonb, 0,
 'Davi tinha pedido que tratassem o rapaz com brandura. Joabe o encontrou preso pelos cabelos num carvalho.',
 '2 Samuel 18:14', 'dificil'),

('Qual filho de Jônatas Davi acolheu para comer à sua mesa?',
 '["Mefibosete","Isbosete","Simei","Ziba"]'::jsonb, 0,
 'Ele era aleijado dos dois pés e se escondia, esperando ser morto como parente do rei anterior. Davi o tratou como filho.',
 '2 Samuel 9:7', 'dificil'),

('Qual rei de Judá foi coroado com sete anos de idade?',
 '["Joás","Uzias","Manassés","Josias"]'::jsonb, 0,
 'Ficou escondido no templo desde bebê, para escapar da avó, que matara o resto da família real.',
 '2 Reis 11:21', 'dificil'),

('Qual rei ficou leproso por queimar incenso no templo, função só dos sacerdotes?',
 '["Uzias","Acaz","Jeroboão","Amazias"]'::jsonb, 0,
 'Reinou cinquenta e dois anos e terminou isolado. A lepra apareceu na testa dele enquanto ele discutia com os sacerdotes.',
 '2 Crônicas 26:19', 'dificil'),

('Qual profeta descreveu uma praga de gafanhotos anunciando o dia do Senhor?',
 '["Joel","Amós","Naum","Sofonias"]'::jsonb, 0,
 'É de Joel a promessa de que Deus derramaria o Espírito sobre toda a carne — o texto que Pedro cita no Pentecostes.',
 'Joel 1:4', 'dificil'),

('Qual profeta anunciou que de Belém sairia o governador de Israel?',
 '["Miqueias","Oséias","Ageu","Habacuque"]'::jsonb, 0,
 'Foi esse texto que os sacerdotes citaram a Herodes quando os magos perguntaram onde o menino tinha nascido.',
 'Miqueias 5:2', 'dificil');
