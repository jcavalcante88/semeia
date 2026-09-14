-- Terceira leva de perguntas do Semeia (50 novas, total 102).
-- Texto biblico: Almeida 1911 (dominio publico).
-- Rode UMA VEZ, depois de seed.sql e seed-perguntas.sql.
--
-- Tom: quem erra recebe a explicacao com gentileza. As explicacoes assumem
-- que a pessoa pode nunca ter aberto uma Biblia.

insert into perguntas (enunciado, alternativas, correta, explicacao, versiculo, nivel) values

-- ---------------------------------------------------------------
-- Facil
-- ---------------------------------------------------------------
('Quantos irmãos venderam José como escravo?',
 '["Os próprios irmãos dele","Os vizinhos","Soldados do Egito","Ninguém, ele fugiu"]'::jsonb, 0,
 'Os irmãos tiveram ciúme e o venderam. Anos depois José os perdoou e salvou a família inteira da fome.',
 'Gênesis 37:28', 'facil'),

('O que Deus criou no primeiro dia, segundo Gênesis?',
 '["O sol","A luz","Os animais","O ser humano"]'::jsonb, 1,
 'A luz vem antes de tudo. O sol e a lua só aparecem no quarto dia — o texto tem uma ordem própria.',
 'Gênesis 1:3', 'facil'),

('Qual era o nome da esposa de Adão?',
 '["Sara","Eva","Raquel","Lia"]'::jsonb, 1,
 'Eva. O nome significa "vida", porque dela viria toda a família humana.',
 'Gênesis 3:20', 'facil'),

('Quem era o pai de Isaque?',
 '["Abraão","Jacó","Noé","Ló"]'::jsonb, 0,
 'Abraão esperou até a velhice pelo filho prometido. Isaque nasceu quando ele tinha cem anos.',
 'Gênesis 21:5', 'facil'),

('Em que animal Jesus entrou em Jerusalém no domingo de Ramos?',
 '["Cavalo","Camelo","Jumentinho","A pé"]'::jsonb, 2,
 'Num jumentinho. Reis entravam a cavalo para mostrar força — ele escolheu o animal mais humilde.',
 'Mateus 21:7', 'facil'),

('Quantas pessoas Jesus ressuscitou dos mortos nos evangelhos?',
 '["Nenhuma","Uma","Três","Dez"]'::jsonb, 2,
 'Três: a filha de Jairo, o filho da viúva de Naim e Lázaro, amigo dele.',
 'João 11:43-44', 'facil'),

('Qual apóstolo era cobrador de impostos antes de seguir Jesus?',
 '["Mateus","Pedro","André","Filipe"]'::jsonb, 0,
 'Mateus. Cobradores de imposto eram odiados por trabalharem para Roma — e foi a um deles que Jesus disse "segue-me".',
 'Mateus 9:9', 'facil'),

('Qual era a profissão de Pedro antes de seguir Jesus?',
 '["Pescador","Carpinteiro","Soldado","Médico"]'::jsonb, 0,
 'Pescador, como o irmão André. Jesus disse que os faria pescadores de gente.',
 'Mateus 4:18-19', 'facil'),

('O que Jesus ensinou os discípulos a orar?',
 '["O Pai Nosso","O Salmo 23","O Credo","A Ave-Maria"]'::jsonb, 0,
 'A oração que começa com "Pai nosso, que estás nos céus". Ela é curta de propósito: Jesus disse que não adianta falar muito.',
 'Mateus 6:9', 'facil'),

('Segundo a Bíblia, quem era o irmão de Moisés?',
 '["Arão","Josué","Calebe","Jetro"]'::jsonb, 0,
 'Arão falava por Moisés, que se achava ruim de palavra e tinha medo de encarar o Faraó sozinho.',
 'Êxodo 4:14-16', 'facil'),

('Onde Jesus foi crucificado?',
 '["No Gólgota","No Sinai","Em Belém","Em Cafarnaum"]'::jsonb, 0,
 'No Gólgota, que quer dizer "lugar da caveira", num morro fora dos muros de Jerusalém.',
 'João 19:17', 'facil'),

('Quantos dias Jesus ficou na sepultura antes de ressuscitar?',
 '["Um","Três","Sete","Quarenta"]'::jsonb, 1,
 'Três dias. Ele tinha avisado os discípulos antes, mas ninguém entendeu na hora.',
 'Lucas 24:46', 'facil'),

('Quem foi o irmão de Maria e Marta que Jesus ressuscitou?',
 '["Lázaro","Zaqueu","Bartimeu","Nicodemos"]'::jsonb, 0,
 'Lázaro, morto havia quatro dias. Antes do milagre, Jesus chorou — o versículo mais curto da Bíblia.',
 'João 11:35', 'facil'),

('O que significa "Emanuel", nome dado a Jesus?',
 '["Deus conosco","Rei dos reis","Salvador","Filho do homem"]'::jsonb, 0,
 '"Deus conosco". É o resumo do Natal em uma palavra: Deus vindo morar perto.',
 'Mateus 1:23', 'facil'),

('Quantos eram os filhos de Jacó, que deram origem às tribos de Israel?',
 '["7","10","12","40"]'::jsonb, 2,
 'Doze filhos, doze tribos. Uma família cheia de brigas virou um povo inteiro.',
 'Gênesis 35:22', 'facil'),

('Qual foi o sinal que Deus deu a Noé depois do dilúvio?',
 '["O arco-íris","Uma estrela","Uma pomba","Um trovão"]'::jsonb, 0,
 'O arco-íris, como promessa de que a terra não seria destruída por água outra vez.',
 'Gênesis 9:13', 'facil'),

('Quem subiu numa árvore para conseguir ver Jesus passar?',
 '["Zaqueu","Nicodemos","Bartimeu","Simão"]'::jsonb, 0,
 'Zaqueu era baixo e rico, e ninguém gostava dele. Jesus parou, olhou para cima e se convidou para jantar na casa dele.',
 'Lucas 19:4-5', 'facil'),

('O que Jesus disse ser o segundo maior mandamento?',
 '["Amar o próximo como a si mesmo","Guardar o sábado","Dar o dízimo","Jejuar"]'::jsonb, 0,
 'Amar o próximo como a si mesmo. Jesus juntou os dois: amar a Deus e amar gente andam sempre juntos.',
 'Mateus 22:39', 'facil'),

-- ---------------------------------------------------------------
-- Medio
-- ---------------------------------------------------------------
('Quantos capítulos tem o livro de Salmos?',
 '["50","100","150","200"]'::jsonb, 2,
 'Cento e cinquenta. São orações e cantos de gente muito diferente, escritos ao longo de séculos.',
 'Salmos 150:6', 'medio'),

('Qual profeta enfrentou 450 profetas de Baal no monte Carmelo?',
 '["Elias","Eliseu","Jeremias","Ezequiel"]'::jsonb, 0,
 'Elias, sozinho contra todos. Depois da vitória ele entrou em depressão e pediu para morrer — a Bíblia não esconde isso.',
 '1 Reis 18:22', 'medio'),

('Quem pediu a Deus sabedoria em vez de riqueza?',
 '["Salomão","Davi","Josias","Ezequias"]'::jsonb, 0,
 'Salomão, ao assumir o trono jovem demais. Deus deu a sabedoria e, de quebra, o resto.',
 '1 Reis 3:9-13', 'medio'),

('Qual era o nome do primeiro mártir cristão, apedrejado após pregar?',
 '["Estêvão","Timóteo","Barnabé","Silas"]'::jsonb, 0,
 'Estêvão. Enquanto morria, pediu perdão para quem o matava. Paulo estava lá, aprovando — antes de mudar de vida.',
 'Atos 7:59-60', 'medio'),

('Qual foi a última praga do Egito?',
 '["A morte dos primogênitos","Trevas","Gafanhotos","Granizo"]'::jsonb, 0,
 'A morte dos primogênitos. Foi depois dela que o Faraó finalmente deixou o povo partir.',
 'Êxodo 12:29', 'medio'),

('O que Deus enviou para alimentar o povo no deserto?',
 '["Maná","Trigo","Peixe","Uvas"]'::jsonb, 0,
 'Maná, todas as manhãs, por quarenta anos. Só dava para juntar o do dia — guardar para amanhã estragava.',
 'Êxodo 16:15', 'medio'),

('Quem escreveu o livro de Provérbios, em sua maior parte?',
 '["Salomão","Davi","Moisés","Paulo"]'::jsonb, 0,
 'Salomão. São conselhos curtos sobre trabalho, dinheiro, amizade e boca — bem práticos.',
 'Provérbios 1:1', 'medio'),

('Qual era o nome do sogro de Moisés?',
 '["Jetro","Labão","Boaz","Eli"]'::jsonb, 0,
 'Jetro, sacerdote de Midiã. Foi ele quem ensinou Moisés a delegar, em vez de julgar o povo inteiro sozinho.',
 'Êxodo 18:17-23', 'medio'),

('Quem disse "aonde quer que tu fores irei eu" à sogra?',
 '["Rute","Ester","Ana","Débora"]'::jsonb, 0,
 'Rute, uma estrangeira que escolheu ficar com Noemi na pobreza. Ela acabou sendo bisavó do rei Davi.',
 'Rute 1:16', 'medio'),

('Qual cidade Jonas não queria que se arrependesse?',
 '["Nínive","Babilônia","Sodoma","Tiro"]'::jsonb, 0,
 'Nínive, capital de um império cruel. Jonas fugiu porque suspeitava que Deus os perdoaria — e foi o que aconteceu.',
 'Jonas 4:2', 'medio'),

('Quem era a mulher juíza e profetisa que liderou Israel?',
 '["Débora","Míriam","Hulda","Ana"]'::jsonb, 0,
 'Débora julgava o povo debaixo de uma palmeira e comandou o exército numa época em que isso não se esperava de uma mulher.',
 'Juízes 4:4-5', 'medio'),

('Qual apóstolo era chamado de "o discípulo a quem Jesus amava"?',
 '["João","Pedro","Tiago","Tomé"]'::jsonb, 0,
 'João, que assim se chama no próprio evangelho. Foi a ele que Jesus confiou o cuidado da mãe, já na cruz.',
 'João 19:26-27', 'medio'),

('Quantas eram as virgens da parábola das lâmpadas?',
 '["Cinco","Sete","Dez","Doze"]'::jsonb, 2,
 'Dez: cinco levaram azeite de reserva, cinco não. A história é sobre estar pronto sem saber a hora.',
 'Mateus 25:1-2', 'medio'),

('O que o filho pródigo foi obrigado a cuidar quando ficou sem dinheiro?',
 '["Porcos","Ovelhas","Cavalos","Uma plantação"]'::jsonb, 0,
 'Porcos — o trabalho mais humilhante possível para um judeu. E o pai o recebeu de volta correndo, sem cobrar explicação.',
 'Lucas 15:15-20', 'medio'),

('Quem ajudou Jesus a carregar a cruz no caminho?',
 '["Simão de Cirene","Pedro","José de Arimateia","Nicodemos"]'::jsonb, 0,
 'Simão de Cirene, um homem qualquer que passava e foi obrigado pelos soldados a carregar.',
 'Marcos 15:21', 'medio'),

('Segundo Jesus, o que é mais fácil do que um rico entrar no reino de Deus?',
 '["Um camelo passar pelo fundo de uma agulha","Mover uma montanha","Andar sobre a água","Contar as estrelas"]'::jsonb, 0,
 'A imagem é proposital de tão absurda. Os discípulos ficaram assustados, e Jesus respondeu que para Deus tudo é possível.',
 'Mateus 19:24-26', 'medio'),

('Quem sepultou o corpo de Jesus?',
 '["José de Arimateia","Pedro","Judas","Pilatos"]'::jsonb, 0,
 'José de Arimateia, um homem rico que pediu o corpo a Pilatos e usou o próprio túmulo novo.',
 'Mateus 27:57-60', 'medio'),

('Qual era o nome do mar que Moisés atravessou com o povo?',
 '["Mar Vermelho","Mar Morto","Mar da Galileia","Mar Mediterrâneo"]'::jsonb, 0,
 'O Mar Vermelho. As águas se abriram e o povo passou a pé enxuto, com o exército egípcio atrás.',
 'Êxodo 14:21-22', 'medio'),

('Quem foi curado de lepra ao mergulhar sete vezes no rio Jordão?',
 '["Naamã","Jó","Gideão","Sansão"]'::jsonb, 0,
 'Naamã, um general estrangeiro. Ele quase desistiu por achar a instrução simples demais e humilhante.',
 '2 Reis 5:14', 'medio'),

('Que dom os discípulos receberam no dia de Pentecostes?',
 '["Falar em outras línguas","Voar","Ficar invisíveis","Prever o futuro"]'::jsonb, 0,
 'Começaram a falar em línguas que não tinham aprendido, e cada estrangeiro ali ouviu na própria língua.',
 'Atos 2:4', 'medio'),

('Qual foi o primeiro pedido de Salomão que agradou a Deus?',
 '["Um coração sábio para julgar","Vida longa","Vitória militar","Ouro"]'::jsonb, 0,
 'Ele pediu discernimento para governar bem. Deus gostou justamente do que ele não pediu.',
 '1 Reis 3:9', 'medio'),

-- ---------------------------------------------------------------
-- Dificil
-- ---------------------------------------------------------------
('Qual livro do Antigo Testamento não menciona o nome de Deus?',
 '["Ester","Rute","Joel","Naum"]'::jsonb, 0,
 'Ester. O nome de Deus não aparece nenhuma vez, mas a história inteira é sobre a mão dele agindo nos bastidores.',
 'Ester 4:14', 'dificil'),

('Quem foi o profeta que se casou com Gômer por ordem de Deus?',
 '["Oséias","Amós","Miquéias","Sofonias"]'::jsonb, 0,
 'Oséias. O casamento sofrido dele virou um retrato de um amor que insiste mesmo quando é traído.',
 'Oséias 1:2', 'dificil'),

('Quantos livros tem o Novo Testamento?',
 '["21","27","39","40"]'::jsonb, 1,
 'Vinte e sete: quatro evangelhos, Atos, vinte e uma cartas e o Apocalipse.',
 '2 Timóteo 3:16', 'dificil'),

('Qual era o nome hebraico de Daniel na Babilônia?',
 '["Beltessazar","Sadraque","Mesaque","Abednego"]'::jsonb, 0,
 'Beltessazar. Os três amigos dele também foram rebatizados — era o jeito do império apagar a identidade dos estrangeiros.',
 'Daniel 1:7', 'dificil'),

('Quem perdeu a força ao ter os cabelos cortados?',
 '["Sansão","Gideão","Jefté","Baraque"]'::jsonb, 0,
 'Sansão. O cabelo era sinal de um voto; a força vinha de Deus, não dos fios.',
 'Juízes 16:17-19', 'dificil'),

('Qual apóstolo substituiu Judas Iscariotes entre os doze?',
 '["Matias","Barnabé","Paulo","Silas"]'::jsonb, 0,
 'Matias, escolhido por sorteio entre os que tinham acompanhado Jesus desde o começo.',
 'Atos 1:26', 'dificil'),

('A quem Paulo escreveu pedindo que recebesse de volta um escravo fugido?',
 '["Filemom","Tito","Timóteo","Lucas"]'::jsonb, 0,
 'A Filemom, sobre Onésimo. Paulo pediu que o recebesse "não já como servo, mas como irmão amado".',
 'Filemom 1:16', 'dificil'),

('Qual profeta viu um vale de ossos secos ganhando vida?',
 '["Ezequiel","Isaías","Jeremias","Daniel"]'::jsonb, 0,
 'Ezequiel. A visão falava de um povo derrotado no exílio, que se sentia morto e voltaria a viver.',
 'Ezequiel 37:1-5', 'dificil'),

('Quantas cartas Paulo escreveu à igreja de Corinto, no Novo Testamento?',
 '["Uma","Duas","Três","Quatro"]'::jsonb, 1,
 'Duas chegaram até nós. Corinto era uma igreja cheia de brigas, e as cartas são bem diretas.',
 '1 Coríntios 1:10', 'dificil'),

('Qual rei escreveu boa parte dos Salmos?',
 '["Davi","Saul","Salomão","Josias"]'::jsonb, 0,
 'Davi, que foi pastor, fugitivo e rei. Ele escreve tanto em alegria quanto em desespero — e não disfarça nenhum dos dois.',
 'Salmos 51:1', 'dificil'),

('Em que língua a maior parte do Antigo Testamento foi escrita?',
 '["Hebraico","Grego","Latim","Aramaico"]'::jsonb, 0,
 'Hebraico, com alguns trechos em aramaico. O Novo Testamento veio em grego.',
 'Neemias 8:8', 'dificil');
