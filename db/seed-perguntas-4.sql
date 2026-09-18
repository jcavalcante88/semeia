-- Quarta leva de perguntas do Semeia (50 novas, total 152).
-- Texto biblico: Almeida 1911 (dominio publico).
-- Rode UMA VEZ, depois de seed.sql, seed-perguntas.sql e seed-perguntas-3.sql.
--
-- Por que esta leva e pesada em "dificil": quem ja terminou as 102 anteriores
-- nao volta por mais do mesmo. Sao 34 dificeis e 16 medias, nenhuma facil.
--
-- Cuidado ao escrever alternativas: o distrator tem que ser errado de verdade.
-- "Quem foi levado sem morrer" nao pode ter Elias na lista, porque Elias
-- tambem nao morreu — a pergunta ficaria injusta mesmo com gabarito certo.

insert into perguntas (enunciado, alternativas, correta, explicacao, versiculo, nivel) values

-- ---------------------------------------------------------------
-- Dificil
-- ---------------------------------------------------------------
('Qual rei de Israel reinou apenas sete dias?',
 '["Zinri","Onri","Elá","Baasa"]'::jsonb, 0,
 'Zinri tomou o trono matando o rei anterior e caiu em uma semana. O livro de Reis registra reinados assim, curtos e violentos, sem esconder nada.',
 '1 Reis 16:15', 'dificil'),

('Qual profeta estava arando com doze juntas de bois quando foi chamado?',
 '["Eliseu","Elias","Amós","Oséias"]'::jsonb, 0,
 'Eliseu era lavrador. Elias jogou o manto sobre ele no meio da lavoura, e ele deixou tudo ali mesmo.',
 '1 Reis 19:19', 'dificil'),

('A quem a Bíblia atribui o Salmo 90?',
 '["Moisés","Davi","Salomão","Asafe"]'::jsonb, 0,
 'O próprio título do salmo diz "oração de Moisés". A maioria dos salmos é de Davi, mas não todos.',
 'Salmos 90:1', 'dificil'),

('O que a mão escreveu na parede durante o banquete de Belsazar?',
 '["MENE, MENE, TEQUEL, UFARSIM","SANTO, SANTO, SANTO","ALFA E ÔMEGA","EMANUEL"]'::jsonb, 0,
 'Ninguém no palácio conseguia ler. Daniel explicou: o reino tinha sido pesado na balança e achado em falta. Naquela mesma noite Babilônia caiu.',
 'Daniel 5:25', 'dificil'),

('Qual rei recebeu mais quinze anos de vida depois de orar?',
 '["Ezequias","Josias","Manassés","Acaz"]'::jsonb, 0,
 'Ezequias estava doente de morte e chorou diante de Deus. A resposta veio pelo profeta Isaías, com prazo contado.',
 '2 Reis 20:6', 'dificil'),

('Quem era Melquisedeque?',
 '["Rei de Salém e sacerdote do Deus Altíssimo","Um general egípcio","Irmão de Abraão","Um juiz de Israel"]'::jsonb, 0,
 'Aparece de repente, abençoa Abraão e some do texto. O livro de Hebreus depois o usa como figura de Cristo.',
 'Gênesis 14:18', 'dificil'),

('Qual é o livro mais curto do Antigo Testamento?',
 '["Obadias","Ageu","Naum","Joel"]'::jsonb, 0,
 'Obadias tem um só capítulo, com vinte e um versículos. É um recado curto e duro contra Edom.',
 'Obadias 1:1', 'dificil'),

('Qual juiz de Israel fez um voto precipitado que lhe custou a filha?',
 '["Jefté","Gideão","Sansão","Baraque"]'::jsonb, 0,
 'Jefté prometeu o que não devia ter prometido. A Bíblia conta o episódio sem aplaudir: é um alerta sobre promessas feitas no desespero.',
 'Juízes 11:30', 'dificil'),

('Além de Josué, qual espia confiou que Israel podia entrar na terra?',
 '["Calebe","Arão","Otniel","Nun"]'::jsonb, 0,
 'Doze foram espiar, dez voltaram com medo. Calebe e Josué foram os únicos daquela geração a entrar na terra prometida.',
 'Números 14:6', 'dificil'),

('Qual era a profissão de Lucas, o autor do terceiro evangelho?',
 '["Médico","Pescador","Carpinteiro","Cobrador de impostos"]'::jsonb, 0,
 'Paulo o chama de "o médico amado". Lucas é também o único autor não judeu do Novo Testamento.',
 'Colossenses 4:14', 'dificil'),

('Em que cidade os seguidores de Jesus foram chamados de cristãos pela primeira vez?',
 '["Antioquia","Jerusalém","Roma","Éfeso"]'::jsonb, 0,
 'O nome nasceu de fora, em Antioquia, provavelmente como apelido. A igreja o adotou.',
 'Atos 11:26', 'dificil'),

('Qual profeta foi chamado por Deus ainda menino, enquanto servia no templo?',
 '["Samuel","Jeremias","Daniel","Isaías"]'::jsonb, 0,
 'Ele ouviu o próprio nome três vezes e achou que era o sacerdote chamando. Na quarta, respondeu: fala, que o teu servo ouve.',
 '1 Samuel 3:10', 'dificil'),

('Quantos anos Jeremias disse que duraria o cativeiro na Babilônia?',
 '["Setenta","Quarenta","Sete","Cem"]'::jsonb, 0,
 'Setenta anos. Daniel estava lendo justamente essa profecia quando começou a orar pela volta do povo.',
 'Jeremias 25:11', 'dificil'),

('Qual apóstolo era chamado de o Zelote?',
 '["Simão","André","Tadeu","Filipe"]'::jsonb, 0,
 'Havia dois Simões entre os doze. Este vinha de um grupo que pregava a revolta armada contra Roma — e andava ao lado de um ex-cobrador de impostos de Roma.',
 'Lucas 6:15', 'dificil'),

('Qual jovem caiu de uma janela enquanto Paulo pregava de madrugada?',
 '["Êutico","Timóteo","Tito","Silas"]'::jsonb, 0,
 'A pregação varou a noite, o rapaz dormiu na janela e caiu do terceiro andar. Paulo desceu, o abraçou e ele viveu.',
 'Atos 20:9', 'dificil'),

('Quem escondeu os espias israelitas em Jericó?',
 '["Raabe","Débora","Rute","Ana"]'::jsonb, 0,
 'Raabe era prostituta e estrangeira. Escondeu os espias, foi poupada quando a cidade caiu, e aparece na genealogia de Jesus.',
 'Josué 2:4', 'dificil'),

('Qual foi o sinal da aliança entre Deus e Abraão?',
 '["A circuncisão","O arco-íris","O sábado","O altar de pedras"]'::jsonb, 0,
 'Cada aliança tem seu sinal. O arco-íris foi com Noé; com Abraão, a circuncisão marcava quem pertencia àquele povo.',
 'Gênesis 17:11', 'dificil'),

('De qual monte Moisés viu a terra prometida antes de morrer?',
 '["Nebo","Sinai","Carmelo","Hermom"]'::jsonb, 0,
 'Ele guiou o povo quarenta anos e viu a terra de longe, sem entrar. Morreu ali, e ninguém soube onde foi sepultado.',
 'Deuteronômio 34:1', 'dificil'),

('Qual era a ocupação de Amós antes de profetizar?',
 '["Pastor de ovelhas","Sacerdote","Escriba","Soldado"]'::jsonb, 0,
 'Amós fazia questão de dizer que não era profeta nem filho de profeta: era pastor e cuidava de figueiras. Deus o tirou de trás do rebanho.',
 'Amós 7:14', 'dificil'),

('Qual rei de Judá encontrou o livro da Lei esquecido dentro do templo?',
 '["Josias","Ezequias","Joás","Acaz"]'::jsonb, 0,
 'O livro tinha sumido dentro da própria casa de Deus. Josias rasgou as roupas ao ouvir a leitura e mudou o rumo do reino.',
 '2 Reis 22:8', 'dificil'),

('O que Eliseu pediu a Elias antes de ele ser levado?',
 '["Porção dobrada do espírito dele","Ouro e prata","Uma casa em Israel","Vida longa"]'::jsonb, 0,
 'Não pediu conforto nem segurança. Pediu o dobro daquilo que via no mestre.',
 '2 Reis 2:9', 'dificil'),

('Em que cidade um terremoto abriu a prisão onde Paulo e Silas cantavam?',
 '["Filipos","Corinto","Tessalônica","Atenas"]'::jsonb, 0,
 'Eles cantavam à meia-noite, presos e feridos. O terremoto abriu as portas, e o carcereiro acabou batizado com a família inteira.',
 'Atos 16:26', 'dificil'),

('Qual mulher vendia púrpura e foi a primeira convertida registrada na Europa?',
 '["Lídia","Priscila","Dorcas","Febe"]'::jsonb, 0,
 'Lídia tinha um negócio próprio de tecido caro. Abriu a casa para Paulo, e ali começou a igreja de Filipos.',
 'Atos 16:14', 'dificil'),

('Qual casal fazia tendas junto com Paulo para se sustentar?',
 '["Áquila e Priscila","Ananias e Safira","Zacarias e Isabel","André e Maria"]'::jsonb, 0,
 'Paulo não vivia de oferta: trabalhava do ofício. Áquila e Priscila dividiam a oficina e depois ensinaram a fé a Apolo.',
 'Atos 18:3', 'dificil'),

('Quantos anos Jacó trabalhou ao todo para casar com Raquel?',
 '["Catorze","Sete","Vinte","Quatro"]'::jsonb, 0,
 'Foram sete anos, o sogro trocou a noiva, e ele serviu mais sete. O texto diz que os primeiros sete pareceram poucos dias, de tanto que ele a amava.',
 'Gênesis 29:30', 'dificil'),

('Quem foi a primeira mulher chamada de profetisa na Bíblia?',
 '["Miriã","Débora","Hulda","Ana"]'::jsonb, 0,
 'Miriã, irmã de Moisés, pegou o pandeiro e conduziu o cântico depois da travessia do mar.',
 'Êxodo 15:20', 'dificil'),

('Qual fariseu procurou Jesus de noite para conversar às escondidas?',
 '["Nicodemos","Gamaliel","Simão o leproso","Zaqueu"]'::jsonb, 0,
 'Nicodemos era mestre respeitado e foi de noite para ninguém ver. Foi nessa conversa que Jesus falou em nascer de novo.',
 'João 3:2', 'dificil'),

('Qual sumo sacerdote presidiu o julgamento de Jesus?',
 '["Caifás","Anás","Gamaliel","Zacarias"]'::jsonb, 0,
 'Caifás era o sumo sacerdote naquele ano. Jesus foi levado primeiro a Anás, sogro dele, e depois ao conselho reunido na casa de Caifás.',
 'Mateus 26:57', 'dificil'),

('Quem alimentou Elias junto ao ribeiro durante a seca?',
 '["Corvos","Anjos","Uma viúva","Pastores"]'::jsonb, 0,
 'Corvos levavam pão e carne de manhã e de tarde. Quando o ribeiro secou, aí sim veio a viúva de Sarepta.',
 '1 Reis 17:6', 'dificil'),

('Quantas pessoas da família de Jacó desceram ao Egito?',
 '["Setenta","Doze","Quarenta","Cem"]'::jsonb, 0,
 'Setenta pessoas entraram no Egito. Quatro séculos depois saíram como um povo inteiro.',
 'Gênesis 46:27', 'dificil'),

('Qual filho nasceu a Adão e Eva depois da morte de Abel?',
 '["Sete","Enoque","Lameque","Jubal"]'::jsonb, 0,
 'Sete nasceu no lugar de Abel. É por essa linha que o texto segue até Noé.',
 'Gênesis 4:25', 'dificil'),

('Quem escrevia em um rolo as profecias que Jeremias ditava?',
 '["Baruque","Esdras","Neemias","Malaquias"]'::jsonb, 0,
 'Baruque era o escrivão. O rei queimou o rolo pedaço por pedaço na lareira, e os dois simplesmente escreveram tudo de novo.',
 'Jeremias 36:4', 'dificil'),

('Em que ilha João escreveu o Apocalipse?',
 '["Patmos","Creta","Chipre","Malta"]'::jsonb, 0,
 'Patmos era ilha de degredo. João estava preso ali por causa da palavra de Deus quando teve as visões.',
 'Apocalipse 1:9', 'dificil'),

('Segundo a carta aos Hebreus, quem foi levado por Deus sem passar pela morte?',
 '["Enoque","Noé","Abraão","Melquisedeque"]'::jsonb, 0,
 'Enoque andou com Deus e desapareceu, porque Deus o tomou. Hebreus o cita entre os que agradaram a Deus pela fé.',
 'Hebreus 11:5', 'dificil'),

-- ---------------------------------------------------------------
-- Medio
-- ---------------------------------------------------------------
('Qual rei mandou construir o primeiro templo em Jerusalém?',
 '["Salomão","Davi","Saul","Ezequias"]'::jsonb, 0,
 'Davi juntou o material e quis construir, mas quem levantou o templo foi o filho, Salomão.',
 '1 Reis 6:1', 'medio'),

('Qual era o nome do pai de João Batista?',
 '["Zacarias","Zebedeu","Simeão","Eli"]'::jsonb, 0,
 'Zacarias era sacerdote e ficou mudo até o menino nascer, por duvidar do anjo.',
 'Lucas 1:13', 'medio'),

('Que nome Jesus deu a Simão quando o chamou?',
 '["Pedro","Tiago","Tadeu","Barnabé"]'::jsonb, 0,
 'Pedro quer dizer pedra. Ele negaria Jesus três vezes e ainda assim seria um dos alicerces da igreja.',
 'João 1:42', 'medio'),

('Como Paulo se chamava antes da conversão?',
 '["Saulo","Silas","Estêvão","Simeão"]'::jsonb, 0,
 'Saulo perseguia cristãos de casa em casa. O nome muda no livro de Atos, quando a missão passa a ser entre os não judeus.',
 'Atos 13:9', 'medio'),

('Em que cidade Jesus transformou água em vinho?',
 '["Caná da Galileia","Nazaré","Cafarnaum","Betânia"]'::jsonb, 0,
 'Foi numa festa de casamento em Caná, a pedido da mãe dele. O primeiro sinal de Jesus não foi num templo, foi numa festa.',
 'João 2:11', 'medio'),

('Quem ungiu Davi como rei quando ele ainda era pastor de ovelhas?',
 '["Samuel","Natã","Elias","Abiatar"]'::jsonb, 0,
 'Samuel passou por sete irmãos mais velhos antes de mandar chamar o caçula, que estava com o rebanho.',
 '1 Samuel 16:13', 'medio'),

('Quantos anos Salomão reinou sobre Israel?',
 '["40","20","70","12"]'::jsonb, 0,
 'Quarenta anos, o mesmo tempo do pai, Davi. Foi o período de maior riqueza e também o começo da divisão do reino.',
 '1 Reis 11:42', 'medio'),

('Quem entregou aos filisteus o segredo da força de Sansão?',
 '["Dalila","Jezabel","Atalia","Mical"]'::jsonb, 0,
 'Ela perguntou quatro vezes e ele acabou contando. A força nunca esteve no cabelo, e sim no voto que o cabelo representava.',
 'Juízes 16:18', 'medio'),

('Qual era o nome da esposa de Abraão?',
 '["Sara","Rebeca","Raquel","Lia"]'::jsonb, 0,
 'Sara riu quando ouviu que teria filho na velhice. O menino ganhou o nome de Isaque, que quer dizer riso.',
 'Gênesis 17:15', 'medio'),

('Qual filho de Davi se rebelou e tentou tomar o trono do pai?',
 '["Absalão","Amnom","Jônatas","Mefibosete"]'::jsonb, 0,
 'Absalão conquistou o povo aos poucos e forçou o pai a fugir de Jerusalém. Davi chorou a morte dele mesmo tendo sido traído.',
 '2 Samuel 15:10', 'medio'),

('Qual profeta confrontou Davi depois do pecado com Bate-Seba?',
 '["Natã","Samuel","Gade","Elias"]'::jsonb, 0,
 'Natã contou uma história sobre uma ovelha roubada. Quando Davi se indignou, ouviu a frase: esse homem és tu.',
 '2 Samuel 12:7', 'medio'),

('Em que língua a maior parte do Novo Testamento foi escrita?',
 '["Grego","Latim","Hebraico","Aramaico"]'::jsonb, 0,
 'Grego comum, a língua do dia a dia no império. Era o que mais gente conseguia ler — e isso ajudou a mensagem a correr.',
 'João 19:20', 'medio'),

('Segundo o fim do livro de Rute, ela foi bisavó de quem?',
 '["Davi","Salomão","Saul","Samuel"]'::jsonb, 0,
 'Rute era moabita, de fora do povo de Israel. A história termina mostrando que dela veio o rei Davi.',
 'Rute 4:17', 'medio'),

('Qual era o nome do pai de Davi?',
 '["Jessé","Obede","Boaz","Ner"]'::jsonb, 0,
 'Jessé, de Belém. Os profetas depois chamariam o Messias de renovo do tronco de Jessé.',
 '1 Samuel 16:1', 'medio'),

('Qual rio secou para o povo entrar na terra prometida?',
 '["Jordão","Nilo","Eufrates","Tigre"]'::jsonb, 0,
 'O Mar Vermelho abriu na saída do Egito; o Jordão parou na chegada. Uma geração inteira separa os dois milagres.',
 'Josué 3:17', 'medio'),

('Quantos anos José tinha quando se apresentou ao faraó?',
 '["Trinta","Dezessete","Quarenta","Cinquenta"]'::jsonb, 0,
 'Foi vendido aos dezessete e chegou ao poder aos trinta. No meio, treze anos de escravidão e prisão.',
 'Gênesis 41:46', 'medio');
