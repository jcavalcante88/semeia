-- Quinta leva de perguntas do Semeia (50 novas, total 202).
-- Texto biblico: Almeida 1911 (dominio publico).
-- Rode UMA VEZ, e depois `node db/redistribuir-alternativas.mjs`.
--
-- Tema desta leva: parabolas, milagres e episodios que o banco ainda nao
-- cobria. As levas anteriores giravam muito em torno das mesmas figuras
-- (Moises, Davi, Paulo); aqui entram nomes que so aparecem uma vez na
-- Biblia e que fazem a pessoa querer procurar.

insert into perguntas (enunciado, alternativas, correta, explicacao, versiculo, nivel) values

-- ---------------------------------------------------------------
-- Facil
-- ---------------------------------------------------------------
('O que Jesus acalmou com uma palavra durante a travessia do mar?',
 '["A tempestade","Uma discussão","Um incêndio","Uma multidão"]'::jsonb, 0,
 'Os discípulos eram pescadores e ainda assim acharam que iam morrer. Jesus estava dormindo na popa.',
 'Marcos 4:39', 'facil'),

('Sobre o que Jesus andou para chegar até os discípulos no barco?',
 '["Uma ponte","Sobre as águas","Um banco de areia","Pedras"]'::jsonb, 1,
 'Era madrugada e eles acharam que fosse um fantasma. Pedro pediu para ir também, e foi — até olhar para o vento.',
 'Mateus 14:25', 'facil'),

('Na parábola, o que o pastor deixa para trás para buscar uma ovelha perdida?',
 '["O cajado","As outras noventa e nove","A casa dele","O rebanho de outro"]'::jsonb, 1,
 'A conta não fecha pela matemática, e é esse o ponto: cada pessoa vale a busca inteira.',
 'Lucas 15:4', 'facil'),

('Quantos leprosos Jesus curou de uma vez, e só um voltou para agradecer?',
 '["Três","Sete","Dez","Doze"]'::jsonb, 2,
 'Dez foram curados no caminho. O único que voltou era samaritano, justamente o estrangeiro.',
 'Lucas 17:17', 'facil'),

('Na parábola do semeador, onde a semente deu fruto?',
 '["No caminho","Entre pedras","Entre espinhos","Na boa terra"]'::jsonb, 3,
 'A mesma semente cai em quatro lugares. O que muda não é a semente, é o chão.',
 'Mateus 13:8', 'facil'),

('O que Deus pediu a Abraão que levasse ao monte para oferecer?',
 '["Um cordeiro","O filho Isaque","Dez moedas","O rebanho inteiro"]'::jsonb, 1,
 'No último instante Deus impediu e providenciou um carneiro. Foi a prova mais dura da vida de Abraão.',
 'Gênesis 22:2', 'facil'),

('O que os israelitas puseram nas portas na noite da primeira páscoa?',
 '["Sangue de cordeiro","Uma cruz","Óleo","Ramos de palmeira"]'::jsonb, 0,
 'O sinal na porta separava as casas naquela noite. É dessa noite que vem a páscoa.',
 'Êxodo 12:7', 'facil'),

('Quem cometeu o primeiro assassinato registrado na Bíblia?',
 '["Lameque","Caim","Esaú","Nimrode"]'::jsonb, 1,
 'Caim matou o próprio irmão por inveja da oferta dele. Deus perguntou: onde está teu irmão?',
 'Gênesis 4:8', 'facil'),

-- ---------------------------------------------------------------
-- Medio
-- ---------------------------------------------------------------
('Na parábola do bom samaritano, quem passou direto pelo homem ferido?',
 '["Um soldado e um mercador","Dois pastores","Um sacerdote e um levita","Dois pescadores"]'::jsonb, 2,
 'Os dois que passaram eram justamente os homens religiosos. Quem parou era o estrangeiro desprezado.',
 'Lucas 10:31', 'medio'),

('Qual parábola compara o reino de Deus à menor de todas as sementes?',
 '["O grão de mostarda","O trigo e o joio","A rede","Os dois filhos"]'::jsonb, 0,
 'Começa menor que qualquer outra e vira árvore onde as aves fazem ninho. O tamanho do começo não diz nada.',
 'Mateus 13:31', 'medio'),

('O que o pai mandou trazer quando o filho pródigo voltou?',
 '["Um chicote","A melhor roupa e um anel","Uma conta do que gastou","Nada"]'::jsonb, 1,
 'O filho vinha com um discurso pronto de arrependimento. O pai não deixou nem terminar.',
 'Lucas 15:22', 'medio'),

('Na parábola dos talentos, o que fez o servo que recebeu um só?',
 '["Dobrou o valor","Deu aos pobres","Escondeu na terra","Gastou tudo"]'::jsonb, 2,
 'Ele enterrou por medo de perder. A repreensão não foi por ter perdido, foi por não ter arriscado nada.',
 'Mateus 25:18', 'medio'),

('Que mulher foi curada ao tocar na veste de Jesus no meio da multidão?',
 '["A sogra de Pedro","A mulher que sangrava havia doze anos","Maria Madalena","A mulher samaritana"]'::jsonb, 1,
 'Doze anos de médicos e nada. Ela tocou por trás, com vergonha, e Jesus parou tudo para olhar para ela.',
 'Marcos 5:34', 'medio'),

('Em que dia da semana Jesus curou o homem da mão ressequida, irritando os fariseus?',
 '["No sábado","No domingo","Na sexta","Na quarta"]'::jsonb, 0,
 'Curar no sábado era a acusação. Jesus perguntou se é lícito fazer o bem no sábado, e ninguém respondeu.',
 'Marcos 3:2', 'medio'),

('Como os amigos conseguiram levar o paralítico até Jesus?',
 '["Pela janela","Abriram o telhado","Empurraram a multidão","Esperaram até a noite"]'::jsonb, 1,
 'A casa estava lotada, então eles desmancharam o telhado e desceram o homem com cordas.',
 'Marcos 2:4', 'medio'),

('Quem Jesus ressuscitou dizendo "menina, levanta-te"?',
 '["A filha de Jairo","A irmã de Lázaro","A filha da viúva","Tabita"]'::jsonb, 0,
 'Jairo era chefe da sinagoga. Riram de Jesus quando ele disse que a menina estava dormindo.',
 'Marcos 5:41', 'medio'),

('Qual cego gritou por Jesus à beira do caminho, em Jericó?',
 '["Bartimeu","Zaqueu","Simão","Malco"]'::jsonb, 0,
 'A multidão mandou ele calar a boca, e ele gritou mais alto. Jesus parou e mandou chamá-lo.',
 'Marcos 10:46', 'medio'),

('De quem Jesus disse não ter achado tanta fé em todo o Israel?',
 '["De um centurião romano","De Pedro","De João Batista","De Nicodemos"]'::jsonb, 0,
 'Era um oficial do exército que ocupava o país. Ele disse que bastava Jesus dizer uma palavra de longe.',
 'Mateus 8:10', 'medio'),

('Para onde caminhavam os dois discípulos quando Jesus apareceu sem ser reconhecido?',
 '["Belém","Emaús","Cafarnaum","Betânia"]'::jsonb, 1,
 'Andaram horas conversando com ele sem perceber. Só reconheceram quando ele partiu o pão.',
 'Lucas 24:13', 'medio'),

('Em que vila moravam Marta, Maria e Lázaro?',
 '["Betânia","Nazaré","Caná","Betsaida"]'::jsonb, 0,
 'Era perto de Jerusalém, e Jesus se hospedava ali. Foi lá que ele chorou diante do túmulo do amigo.',
 'João 11:1', 'medio'),

('Onde Jesus conversou com a mulher samaritana?',
 '["Na sinagoga","Num poço","No templo","Numa festa"]'::jsonb, 1,
 'Judeus não falavam com samaritanos, e homens não falavam com mulheres desconhecidas. Ele fez as duas coisas.',
 'João 4:6', 'medio'),

('O que Jesus usou para curar o homem cego de nascença?',
 '["Água do rio","Lodo passado nos olhos","Um pano","Óleo"]'::jsonb, 1,
 'Fez lodo com terra e saliva, passou nos olhos e mandou lavar no tanque de Siloé.',
 'João 9:6', 'medio'),

('Qual apóstolo cortou a orelha do servo do sumo sacerdote?',
 '["Tiago","João","Pedro","André"]'::jsonb, 2,
 'Pedro sacou a espada para defender Jesus. Jesus mandou guardar a espada e curou a orelha do homem.',
 'João 18:10', 'medio'),

('O que Pilatos mandou escrever na cruz de Jesus?',
 '["Jesus Nazareno, Rei dos Judeus","Filho de Deus","Blasfemo","Inimigo de Roma"]'::jsonb, 0,
 'Escreveu em três línguas. Os líderes pediram que mudasse, e ele respondeu: o que escrevi, escrevi.',
 'João 19:19', 'medio'),

('Quem tentou comprar de Pedro o poder do Espírito Santo com dinheiro?',
 '["Simão, o mago","Ananias","Demétrio","Elimas"]'::jsonb, 0,
 'Era mágico conhecido na Samaria. É daí que vem a palavra simonia, o comércio de coisas sagradas.',
 'Atos 8:18', 'medio'),

('Que casal mentiu sobre o valor de um terreno vendido e morreu?',
 '["Áquila e Priscila","Ananias e Safira","Zacarias e Isabel","Félix e Drusila"]'::jsonb, 1,
 'Ninguém era obrigado a dar nada. O problema não foi o dinheiro retido, foi a mentira.',
 'Atos 5:1', 'medio'),

('Quem foi o primeiro não judeu batizado por Pedro?',
 '["Cornélio","Lucas","Tito","Públio"]'::jsonb, 0,
 'Era centurião romano. Pedro precisou de uma visão para aceitar entrar na casa dele.',
 'Atos 10:48', 'medio'),

-- ---------------------------------------------------------------
-- Dificil
-- ---------------------------------------------------------------
('Qual parábola fala de um servo perdoado que não perdoou o companheiro?',
 '["Os dois filhos","O credor incompassivo","Os lavradores maus","A dracma perdida"]'::jsonb, 1,
 'Foi perdoado de uma dívida impagável e mandou prender quem lhe devia uma ninharia. Jesus contou logo depois de Pedro perguntar quantas vezes perdoar.',
 'Mateus 18:32', 'dificil'),

('Na parábola das ovelhas e dos cabritos, de que lado ficam as ovelhas?',
 '["À direita","À esquerda","Atrás","No meio"]'::jsonb, 0,
 'O critério da separação surpreende os dois lados: comida, água, roupa, visita. Nenhum dos dois lembrava de ter feito ou deixado de fazer.',
 'Mateus 25:33', 'dificil'),

('Qual parábola fala de um homem que achou um tesouro e vendeu tudo para comprar o campo?',
 '["A rede","O tesouro escondido","O semeador","O rico insensato"]'::jsonb, 1,
 'Ele vendeu tudo com alegria, não com sacrifício. Quem entendeu o valor não sente que está perdendo nada.',
 'Mateus 13:44', 'dificil'),

('O que aconteceu com a figueira que Jesus amaldiçoou?',
 '["Deu fruto","Secou","Cresceu","Foi cortada"]'::jsonb, 1,
 'Tinha folhas e nenhum figo. No dia seguinte os discípulos viram a árvore seca desde a raiz.',
 'Marcos 11:20', 'dificil'),

('Para onde Jesus mandou os demônios que saíram do homem de Gadara?',
 '["Para o deserto","Para uma manada de porcos","Para o mar, direto","Para outra cidade"]'::jsonb, 1,
 'O homem morava entre os túmulos e ninguém conseguia prendê-lo. Depois da cura, o povo pediu que Jesus fosse embora.',
 'Marcos 5:13', 'dificil'),

('Quantos cestos de sobra recolheram depois que Jesus alimentou os cinco mil?',
 '["Sete","Três","Doze","Nenhum"]'::jsonb, 2,
 'Doze cestos, um para cada discípulo. Quando ele alimentou os quatro mil, as sobras foram sete.',
 'Mateus 14:20', 'dificil'),

('Quem Jesus ressuscitou na cidade de Naim?',
 '["O filho único de uma viúva","Um jovem rico","Um soldado","O irmão de Marta"]'::jsonb, 0,
 'Ele encontrou o enterro na porta da cidade. Não pediram nada: ele viu a mãe chorando e se compadeceu.',
 'Lucas 7:14', 'dificil'),

('Qual mulher Pedro ressuscitou na cidade de Jope?',
 '["Lídia","Tabita","Priscila","Rode"]'::jsonb, 1,
 'Tabita, também chamada Dorcas, costurava roupas para as viúvas. Elas mostraram as peças a Pedro, chorando.',
 'Atos 9:40', 'dificil'),

('Quem acompanhou Paulo na primeira viagem missionária?',
 '["Barnabé","Silas","Timóteo","Lucas"]'::jsonb, 0,
 'Barnabé foi quem apresentou Paulo à igreja quando ninguém confiava nele. O apelido dele quer dizer filho da consolação.',
 'Atos 13:2', 'dificil'),

('Por causa de quem Paulo e Barnabé se separaram?',
 '["João Marcos","Timóteo","Apolo","Tito"]'::jsonb, 0,
 'O rapaz tinha abandonado a viagem anterior. Paulo não quis levá-lo de novo, Barnabé insistiu, e cada um seguiu por um lado.',
 'Atos 15:39', 'dificil'),

('Qual rei disse a Paulo "por pouco me persuades a ser cristão"?',
 '["Herodes","Agripa","Festo","Félix"]'::jsonb, 1,
 'Paulo estava preso e acorrentado. Respondeu que gostaria que todos ali ficassem como ele, menos as correntes.',
 'Atos 26:28', 'dificil'),

('Em que ilha Paulo naufragou e foi picado por uma víbora?',
 '["Chipre","Creta","Malta","Patmos"]'::jsonb, 2,
 'Os moradores acharam que ele era assassino sendo castigado. Quando nada aconteceu, acharam que era um deus.',
 'Atos 28:1', 'dificil'),

('Qual jovem Paulo chamava de "meu verdadeiro filho na fé"?',
 '["Tito","Timóteo","Onésimo","Trófimo"]'::jsonb, 1,
 'Timóteo era filho de mãe judia e pai grego. Paulo o recrutou ainda muito novo e escreveu duas cartas a ele.',
 '1 Timóteo 1:2', 'dificil'),

('Quem abandonou Paulo por amar o presente século?',
 '["Demas","Marcos","Lucas","Erasto"]'::jsonb, 0,
 'É uma das frases mais tristes do Novo Testamento, escrita por Paulo já perto do fim.',
 '2 Timóteo 4:10', 'dificil'),

('Qual pregador eloquente foi corrigido por Áquila e Priscila?',
 '["Estêvão","Apolo","Barnabé","Silas"]'::jsonb, 1,
 'Apolo pregava com fogo, mas só conhecia o batismo de João. O casal o chamou de lado em vez de expô-lo em público.',
 'Atos 18:26', 'dificil'),

('Quem foi o primeiro juiz de Israel?',
 '["Otniel","Gideão","Sansão","Débora"]'::jsonb, 0,
 'Otniel era sobrinho de Calebe. Depois dele vieram Eúde, Débora, Gideão, Jefté e Sansão.',
 'Juízes 3:9', 'dificil'),

('Com quantos homens Gideão enfrentou os midianitas?',
 '["Trezentos","Trinta mil","Três mil","Sete"]'::jsonb, 0,
 'Eram trinta e dois mil no começo. Deus foi reduzindo até sobrarem trezentos, para ninguém dizer que venceu sozinho.',
 'Juízes 7:7', 'dificil'),

('Qual rei mandou matar Nabote para tomar a vinha dele?',
 '["Acabe","Jeroboão","Roboão","Jeú"]'::jsonb, 0,
 'Acabe queria a vinha para fazer uma horta. Jezabel armou o julgamento falso, e Elias foi confrontá-lo na própria vinha.',
 '1 Reis 21:16', 'dificil'),

('Qual rainha mandou matar os profetas do Senhor em Israel?',
 '["Atalia","Jezabel","Ester","Vasti"]'::jsonb, 1,
 'Jezabel era filha do rei de Sidom e trouxe o culto a Baal para Israel. Cem profetas foram escondidos numa caverna para escapar.',
 '1 Reis 18:4', 'dificil'),

('Quem escondeu debaixo da tenda o que deveria ter sido destruído em Jericó?',
 '["Acã","Zimri","Corá","Datã"]'::jsonb, 0,
 'Um manto, prata e uma barra de ouro. Por causa disso o exército inteiro perdeu a batalha seguinte.',
 'Josué 7:21', 'dificil'),

('Qual homem ficou com dez tribos quando o reino se dividiu depois de Salomão?',
 '["Roboão","Jeroboão","Asa","Onri"]'::jsonb, 1,
 'Roboão, filho de Salomão, prometeu aumentar os impostos. Dez tribos foram embora com Jeroboão e nunca mais voltaram.',
 '1 Reis 12:20', 'dificil'),

('Quem reconstruiu os muros de Jerusalém depois do exílio?',
 '["Esdras","Neemias","Zorobabel","Ageu"]'::jsonb, 1,
 'Era copeiro do rei da Pérsia e largou o cargo pela obra. O muro ficou pronto em cinquenta e dois dias, com a espada ao lado da ferramenta.',
 'Neemias 6:15', 'dificil'),

('Qual escriba leu a Lei em voz alta ao povo depois da volta do exílio?',
 '["Esdras","Baruque","Malaquias","Zacarias"]'::jsonb, 0,
 'O povo ficou de pé desde a manhã até o meio-dia, ouvindo. Muitos choraram, porque não conheciam mais aquele texto.',
 'Neemias 8:2', 'dificil'),

('Quem foi o rei de Judá levado cego para a Babilônia?',
 '["Zedequias","Josias","Joaquim","Manassés"]'::jsonb, 0,
 'Zedequias foi o último rei de Judá. Viu os filhos serem mortos e logo depois lhe furaram os olhos.',
 '2 Reis 25:7', 'dificil'),

('Qual profeta comprou um campo enquanto a cidade estava cercada pelo inimigo?',
 '["Jeremias","Ezequiel","Isaías","Habacuque"]'::jsonb, 0,
 'Era um gesto absurdo e proposital: comprar terra num lugar prestes a cair, como sinal de que o povo voltaria.',
 'Jeremias 32:9', 'dificil');
