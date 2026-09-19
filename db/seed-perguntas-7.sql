-- Setima leva de perguntas do Semeia (47 novas, total 300).
-- Texto biblico: Almeida 1911 (dominio publico).
-- Rode UMA VEZ, e depois `node db/redistribuir-alternativas.mjs`.
--
-- Tema: o sermao do monte, os profetas maiores, o exilio e a volta, e os
-- ultimos dias de Jesus. Fecha o alvo de 300 perguntas.

insert into perguntas (enunciado, alternativas, correta, explicacao, versiculo, nivel) values

-- ---------------------------------------------------------------
-- Facil
-- ---------------------------------------------------------------
('O que Jesus mandou fazer com os inimigos?',
 '["Evitá-los","Amá-los","Denunciá-los","Esquecê-los"]'::jsonb, 1,
 'Amar quem já gosta de você não custa nada, disse ele. A conta só muda quando inclui quem não merece.',
 'Mateus 5:44', 'facil'),

('Segundo Jesus, quem é o sal da terra?',
 '["Os sacerdotes","Os seus seguidores","Os ricos","Os profetas"]'::jsonb, 1,
 'Sal serve para dar gosto e conservar, e some dentro da comida. A imagem não é de destaque, é de efeito.',
 'Mateus 5:13', 'facil'),

('Com quantos anos, aproximadamente, Jesus começou a ensinar?',
 '["Doze","Vinte","Trinta","Quarenta"]'::jsonb, 2,
 'Passou a maior parte da vida numa oficina de carpintaria. O ministério público durou cerca de três anos.',
 'Lucas 3:23', 'facil'),

('Qual é o primeiro livro do Novo Testamento?',
 '["Marcos","Mateus","Atos","João"]'::jsonb, 1,
 'Mateus escreve para leitores judeus e começa com a genealogia, ligando Jesus a Davi e Abraão.',
 'Mateus 1:1', 'facil'),

('Qual evangelho começa com "No princípio era o Verbo"?',
 '["Lucas","Marcos","João","Mateus"]'::jsonb, 2,
 'João não começa pelo nascimento, e sim antes de tudo. É o mais diferente dos quatro.',
 'João 1:1', 'facil'),

('Quantos livros tem o Antigo Testamento na Bíblia protestante?',
 '["27","39","46","66"]'::jsonb, 1,
 'Trinta e nove no Antigo e vinte e sete no Novo, somando sessenta e seis.',
 'Gênesis 1:1', 'facil'),

('Em qual mar Jesus mais andou, pregou e chamou discípulos?',
 '["Mar da Galileia","Mar Vermelho","Mar Morto","Mar Mediterrâneo"]'::jsonb, 0,
 'É um lago de água doce, cercado de vilas de pescadores. Foi ali que ele acalmou a tempestade e andou sobre as águas.',
 'Mateus 4:18', 'facil'),

-- ---------------------------------------------------------------
-- Medio
-- ---------------------------------------------------------------
('Segundo Jesus, não se pode servir a Deus e a quem?',
 '["Ao rei","Às riquezas","Aos pais","Ao templo"]'::jsonb, 1,
 'Não é proibição de ter dinheiro: é sobre quem manda em quem. Ninguém consegue obedecer aos dois.',
 'Mateus 6:24', 'medio'),

('O que Jesus mandou tirar antes de cuidar do cisco no olho do irmão?',
 '["A trave do próprio olho","A poeira dos pés","O manto","A pedra da mão"]'::jsonb, 0,
 'A imagem é proposital de tão exagerada: uma viga inteira no próprio olho enquanto se aponta um grão no do outro.',
 'Mateus 7:5', 'medio'),

('Sobre o que o homem prudente construiu a casa, na parábola?',
 '["Sobre a areia","Sobre a rocha","Sobre madeira","Sobre barro"]'::jsonb, 1,
 'As duas casas enfrentam a mesma chuva e o mesmo vento. A diferença só aparece na tempestade.',
 'Mateus 7:24', 'medio'),

('Quem Jesus chamou de o maior entre os nascidos de mulher?',
 '["Abraão","Moisés","João Batista","Elias"]'::jsonb, 2,
 'E completou dizendo que o menor no reino dos céus é maior do que ele. João estava preso quando ouviu isso.',
 'Mateus 11:11', 'medio'),

('Por que João Batista foi preso?',
 '["Por repreender Herodes","Por pregar sem permissão","Por batizar Jesus","Por não pagar imposto"]'::jsonb, 0,
 'Ele disse ao rei que não era lícito ficar com a mulher do irmão. Herodes o prendeu, mas gostava de ouvi-lo.',
 'Marcos 6:18', 'medio'),

('O que foi pedido como recompensa pela dança diante de Herodes?',
 '["Metade do reino","A cabeça de João Batista","Ouro","A liberdade de um preso"]'::jsonb, 1,
 'A moça perguntou à mãe o que pedir. Herodes ficou triste, mas cumpriu por causa dos convidados.',
 'Marcos 6:25', 'medio'),

('Qual foi a primeira coisa que Deus disse não ser boa?',
 '["A escuridão","O homem estar só","O silêncio","A terra seca"]'::jsonb, 1,
 'Até ali tudo tinha sido chamado de bom. A primeira coisa que Deus chama de não boa é a solidão.',
 'Gênesis 2:18', 'medio'),

('Quantas pragas caíram sobre o Egito?',
 '["Sete","Dez","Doze","Três"]'::jsonb, 1,
 'Dez, uma atrás da outra, cada uma atingindo algo que os egípcios adoravam. A última fez o faraó ceder.',
 'Êxodo 11:1', 'medio'),

('O que saiu da rocha quando Moisés a feriu no deserto?',
 '["Fogo","Água","Óleo","Maná"]'::jsonb, 1,
 'O povo estava prestes a apedrejá-lo de sede. Paulo mais tarde chama essa rocha de figura de Cristo.',
 'Êxodo 17:6', 'medio'),

('Quantos espias Moisés enviou para ver a terra prometida?',
 '["Dois","Sete","Doze","Quarenta"]'::jsonb, 2,
 'Um de cada tribo. Dez voltaram falando de gigantes, e só dois falaram do que Deus podia fazer.',
 'Números 13:2', 'medio'),

('Qual cidade Davi conquistou e tornou capital do reino?',
 '["Hebrom","Jerusalém","Belém","Siquém"]'::jsonb, 1,
 'Era uma fortaleza jebuseia que ninguém tinha tomado. Passou a se chamar cidade de Davi.',
 '2 Samuel 5:7', 'medio'),

('Qual rainha viajou de longe para testar a sabedoria de Salomão?',
 '["A rainha de Sabá","Jezabel","Ester","Atalia"]'::jsonb, 0,
 'Ela veio com perguntas difíceis e foi embora dizendo que não tinham lhe contado nem a metade.',
 '1 Reis 10:1', 'medio'),

('Qual profeta ressuscitou o filho da viúva de Sarepta?',
 '["Elias","Eliseu","Samuel","Natã"]'::jsonb, 0,
 'A viúva o alimentava com o pouco que tinha. Quando o filho morreu, ela culpou o profeta.',
 '1 Reis 17:22', 'medio'),

('Qual rei sonhou com uma estátua feita de vários metais?',
 '["Nabucodonosor","Belsazar","Dario","Ciro"]'::jsonb, 0,
 'Ele exigiu que os sábios contassem o sonho antes de interpretá-lo. Só Daniel conseguiu.',
 'Daniel 2:31', 'medio'),

('Quantos amigos de Daniel foram lançados na fornalha?',
 '["Dois","Três","Sete","Dez"]'::jsonb, 1,
 'Sadraque, Mesaque e Abednego. Disseram ao rei que Deus podia livrá-los, e que mesmo se não livrasse, não adorariam a estátua.',
 'Daniel 3:23', 'medio'),

('O que Daniel continuou fazendo três vezes ao dia, contra a lei do rei?',
 '["Jejuava","Orava","Ensinava","Lia"]'::jsonb, 1,
 'Com as janelas abertas para Jerusalém, como sempre tinha feito. Foi por isso que caiu na cova dos leões.',
 'Daniel 6:10', 'medio'),

-- ---------------------------------------------------------------
-- Dificil
-- ---------------------------------------------------------------
('Qual rei persa autorizou os judeus a voltarem do exílio?',
 '["Ciro","Dario","Artaxerxes","Assuero"]'::jsonb, 0,
 'Ciro mandou reconstruir o templo e devolveu os objetos levados por Nabucodonosor. Isaías o citara pelo nome muito antes.',
 'Esdras 1:1', 'dificil'),

('Quem liderou o primeiro grupo que voltou do exílio na Babilônia?',
 '["Zorobabel","Esdras","Neemias","Josué"]'::jsonb, 0,
 'Zorobabel lançou os fundamentos do segundo templo. Os velhos que lembravam do primeiro choraram ao ver o tamanho.',
 'Esdras 2:2', 'dificil'),

('Qual profeta trabalhou ao lado de Ageu incentivando a reconstrução do templo?',
 '["Zacarias","Malaquias","Joel","Obadias"]'::jsonb, 0,
 'A obra tinha parado por desânimo e oposição. Os dois profetas conseguiram fazer o povo recomeçar.',
 'Esdras 5:1', 'dificil'),

('Qual é o último livro do Antigo Testamento?',
 '["Malaquias","Zacarias","Ageu","Daniel"]'::jsonb, 0,
 'Termina prometendo o retorno de Elias. Depois dele vêm cerca de quatrocentos anos sem profeta registrado.',
 'Malaquias 4:5', 'dificil'),

('Qual profeta reclamou que Deus não respondia e ouviu "o justo viverá pela fé"?',
 '["Habacuque","Naum","Sofonias","Jonas"]'::jsonb, 0,
 'Ele discute com Deus o livro inteiro e termina dizendo que se alegra mesmo se a figueira não florescer.',
 'Habacuque 2:4', 'dificil'),

('Qual profeta andou descalço e despido por três anos, como sinal?',
 '["Isaías","Ezequiel","Oséias","Jeremias"]'::jsonb, 0,
 'Era um aviso encenado sobre o que aconteceria ao Egito e à Etiópia. Vários profetas pregaram com o corpo, não só com a boca.',
 'Isaías 20:3', 'dificil'),

('Qual profeta comeu um rolo escrito que tinha gosto de mel?',
 '["Ezequiel","Daniel","Jeremias","Amós"]'::jsonb, 0,
 'Deus mandou que ele engolisse a mensagem antes de falar. O gosto era doce, mas o conteúdo era duro.',
 'Ezequiel 3:3', 'dificil'),

('Qual profeta viu o Senhor num trono alto e disse ser homem de lábios impuros?',
 '["Isaías","Ezequiel","Miqueias","Amós"]'::jsonb, 0,
 'A visão aconteceu no ano da morte do rei Uzias. Ele não se achou digno nem de olhar.',
 'Isaías 6:5', 'dificil'),

('O que um serafim usou para tocar os lábios de Isaías?',
 '["Uma brasa do altar","Óleo","Água","Um ramo"]'::jsonb, 0,
 'Depois disso ele ouviu a pergunta "a quem enviarei?" e respondeu: eis-me aqui, envia-me a mim.',
 'Isaías 6:6', 'dificil'),

('Qual era o cargo de Neemias na corte da Pérsia?',
 '["Copeiro do rei","Escriba","General","Tesoureiro"]'::jsonb, 0,
 'Copeiro provava a bebida do rei e tinha acesso diário a ele. Largou isso para ir levantar um muro em ruínas.',
 'Neemias 1:11', 'dificil'),

('Qual foi o primeiro milagre de Eliseu depois de receber o manto de Elias?',
 '["Dividir as águas do Jordão","Curar um leproso","Multiplicar azeite","Ressuscitar um menino"]'::jsonb, 0,
 'Ele bateu nas águas com o manto e perguntou onde estava o Deus de Elias. As águas se abriram.',
 '2 Reis 2:14', 'dificil'),

('O que Eliseu fez um machado de ferro fazer, dentro do rio?',
 '["Boiar","Cortar pedra","Sumir","Virar ouro"]'::jsonb, 0,
 'A ferramenta era emprestada, e o rapaz ficou desesperado. É um dos milagres mais miúdos da Bíblia, e é sobre uma dívida.',
 '2 Reis 6:6', 'dificil'),

('Qual exército Eliseu cegou e conduziu para dentro de Samaria?',
 '["O exército da Síria","O exército do Egito","Os filisteus","Os amonitas"]'::jsonb, 0,
 'Em vez de mandar matá-los, ele mandou servir um banquete e soltar todos. As tropas pararam de invadir Israel.',
 '2 Reis 6:18', 'dificil'),

('O que Ana prometeu a Deus caso tivesse um filho?',
 '["Entregá-lo ao Senhor","Construir um altar","Doar o rebanho","Mudar de cidade"]'::jsonb, 0,
 'Ela orava mexendo os lábios sem som, e o sacerdote achou que estava bêbada. O menino foi Samuel.',
 '1 Samuel 1:11', 'dificil'),

('Quem se casou com Rute e resgatou a terra da família dela?',
 '["Boaz","Obede","Elimeleque","Quiliom"]'::jsonb, 0,
 'Havia um parente mais próximo com direito de preferência, e ele desistiu. Boaz assumiu o resgate diante dos anciãos.',
 'Rute 4:13', 'dificil'),

('Diante de qual rei filisteu Davi fingiu loucura para escapar?',
 '["Aquis","Abimeleque","Golias","Siseras"]'::jsonb, 0,
 'Davi fugia de Saul e se refugiou justamente na cidade de Golias. Fingiu-se louco, babando na barba, e foi expulso em vez de morto.',
 '1 Samuel 21:13', 'dificil'),

('Em que lugar Davi cortou a ponta do manto de Saul em vez de matá-lo?',
 '["Numa caverna, em En-Gedi","No palácio","No deserto de Zife","Em Gilboa"]'::jsonb, 0,
 'Saul entrou sozinho na caverna onde Davi se escondia. Depois Davi mostrou o pedaço de pano de longe, como prova.',
 '1 Samuel 24:3', 'dificil'),

('Qual foi a última palavra de Jesus na cruz, segundo o evangelho de João?',
 '["Está consumado","Pai, perdoa-lhes","Tenho sede","Em tuas mãos entrego"]'::jsonb, 0,
 'Em grego é uma palavra só, a mesma que se escrevia num recibo quitado: está pago.',
 'João 19:30', 'dificil'),

('O que aconteceu ao véu do templo no momento da morte de Jesus?',
 '["Rasgou-se em dois","Pegou fogo","Caiu no chão","Ficou preto"]'::jsonb, 0,
 'Rasgou de alto a baixo. Aquele pano separava o lugar onde só o sumo sacerdote entrava, uma vez por ano.',
 'Mateus 27:51', 'dificil'),

('Quem ajudou José de Arimateia a sepultar o corpo de Jesus?',
 '["Nicodemos","Simão de Cirene","Zaqueu","Barnabé"]'::jsonb, 0,
 'Os dois eram membros do conselho que condenou Jesus. Nicodemos levou trinta quilos de especiarias.',
 'João 19:39', 'dificil'),

('Segundo Paulo, quantas pessoas viram Jesus ressuscitado de uma só vez?',
 '["Mais de quinhentas","Doze","Setenta","Cerca de cem"]'::jsonb, 0,
 'Ele escreve que a maioria ainda estava viva quando a carta foi enviada — ou seja, dava para ir perguntar.',
 '1 Coríntios 15:6', 'dificil'),

('Qual é a mais longa das cartas de Paulo?',
 '["Romanos","1 Coríntios","Efésios","Hebreus"]'::jsonb, 0,
 'Romanos tem dezesseis capítulos e foi escrita a uma igreja que ele ainda não conhecia pessoalmente.',
 'Romanos 1:1', 'dificil'),

('A qual igreja Paulo escreveu corrigindo a desordem no culto e o uso de línguas?',
 '["Corinto","Éfeso","Filipos","Colossos"]'::jsonb, 0,
 'A igreja tinha dons de sobra e confusão do mesmo tamanho. A regra que ele dá é: tudo seja feito com decência e ordem.',
 '1 Coríntios 14:40', 'dificil'),
('Que peça o sumo sacerdote usava sobre o peito, com doze pedras preciosas?',
 '["O peitoral","A coroa","O cinto","O manto azul"]'::jsonb, 0,
 'Uma pedra para cada tribo, com o nome gravado. Ele entrava na presença de Deus carregando o povo inteiro sobre o peito.',
 'Êxodo 28:21', 'dificil');
