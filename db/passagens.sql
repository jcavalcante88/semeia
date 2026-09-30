-- Passagens explicadas, para a busca da tela inicial.
-- Rode uma vez, depois de db/atlas.sql.
--
-- POR QUE ESCRITO A MAO:
-- o app nao tem a Biblia dentro dele e nao tem IA rodando no servidor. Resumir
-- um capitulo na hora exigiria inventar texto biblico, e isso nao se faz num
-- app cristao. Entao cada passagem aqui foi escrita e conferida, uma a uma.
--
-- Sao 1.189 capitulos na Biblia; estas sao as passagens que as pessoas de fato
-- procuram. A busca tambem cai nas 300 perguntas do quiz, que ja tem explicacao
-- e versiculo — assim quem procura um assunto fora desta lista ainda encontra
-- alguma coisa de verdade.
--
-- Para acrescentar uma passagem, copie um bloco. `lugares` so aceita nomes que
-- existam na tabela `lugares`, senao o mapa fica mudo.

create table if not exists passagens (
  id          bigserial primary key,
  referencia  text not null unique,
  titulo      text not null,
  -- Palavras soltas que a busca tambem aceita, sem acento e em minusculas.
  busca       text not null,
  resumo      text not null,
  significado text not null,
  -- [{ "nome": "...", "quem": "..." }]
  pessoas     jsonb not null default '[]'::jsonb,
  -- Nomes que precisam existir em `lugares`.
  lugares     text[] not null default '{}',
  -- [{ "palavra": "...", "significado": "..." }]
  palavras    jsonb not null default '[]'::jsonb,
  ativa       boolean not null default true
);

create index if not exists passagens_busca_idx on passagens using gin (to_tsvector('portuguese', busca));

insert into passagens (referencia, titulo, busca, resumo, significado, pessoas, lugares, palavras) values

('Gênesis 1', 'A criação',
 'criacao genesis principio luz ceus terra sete dias descanso',
 'Deus cria em seis movimentos: a luz, o céu e o mar, a terra seca e as plantas, o sol e a lua, os peixes e as aves, os animais e o ser humano. No sétimo dia descansa. A cada etapa o texto repete a mesma frase: e viu Deus que era bom.',
 'O texto não está preocupado em explicar mecânica, e sim em dizer de quem o mundo é. Repare na ordem: a luz vem antes do sol, o que mostra que o interesse não é astronômico. E o ser humano aparece por último, não como o senhor de tudo, mas como quem recebe um jardim pronto para cuidar.',
 '[{"nome":"Deus","quem":"quem fala, e tudo passa a existir"},{"nome":"Adão","quem":"o primeiro ser humano, feito do pó da terra"}]'::jsonb,
 '{}',
 '[{"palavra":"Firmamento","significado":"a abóbada do céu, como quem olha de baixo vê: uma cúpula sobre a terra"},{"palavra":"Imagem e semelhança","significado":"não é aparência. É representar alguém, como um embaixador representa um rei"}]'::jsonb),

('Gênesis 7', 'O dilúvio e a arca',
 'diluvio arca noe animais chuva pomba arco iris ararate',
 'Noé constrói a arca durante décadas, enquanto o povo assiste. Entram ele, a mulher, três filhos e as noras — oito pessoas — mais os animais. Chove quarenta dias. Quando a água baixa, a pomba volta com uma folha de oliveira, e o arco-íris sela a promessa de que não haverá outro.',
 'A história costuma ser contada como castigo, mas o centro dela é o recomeço. Deus não apaga e desiste: ele salva uma família e reinicia. O arco-íris é a primeira aliança da Bíblia, e o sinal dela fica no céu, onde todos veem — não num papel guardado.',
 '[{"nome":"Noé","quem":"o único que achou graça diante de Deus naquela geração"},{"nome":"Sem, Cão e Jafé","quem":"os filhos, que entraram na arca com as esposas"}]'::jsonb,
 '{}',
 '[{"palavra":"Arca","significado":"caixa grande, não navio. O mesmo nome do cesto de Moisés e da arca da aliança"},{"palavra":"Côvado","significado":"medida do cotovelo à ponta do dedo, uns 45 cm. A arca tinha 300 côvados de comprimento"}]'::jsonb),

('Êxodo 14', 'A travessia do mar',
 'exodo mar vermelho moises faraó travessia egito escravidao',
 'O povo sai do Egito e o faraó muda de ideia, saindo atrás com os carros de guerra. Encurralados entre o exército e a água, o povo culpa Moisés. Ele responde que o Senhor pelejará por eles. O mar se abre, Israel passa em terra seca, e as águas voltam sobre os carros.',
 'É a cena que define o povo de Israel: eles não conquistaram a liberdade, foram tirados. Toda a Páscoa judaica e boa parte do vocabulário cristão sobre salvação nascem aqui. Repare que o milagre acontece com o povo reclamando — não foi a fé deles que abriu o mar.',
 '[{"nome":"Moisés","quem":"estendeu a mão sobre o mar"},{"nome":"Faraó","quem":"o rei do Egito, que os perseguiu"},{"nome":"Arão","quem":"irmão de Moisés e porta-voz dele"}]'::jsonb,
 '{"Mar Vermelho"}',
 '[{"palavra":"Pelejar","significado":"lutar, guerrear. O Senhor pelejará por vós quer dizer: a briga não é sua"},{"palavra":"Coluna de nuvem","significado":"o sinal visível da presença de Deus guiando o povo, de dia; de noite virava coluna de fogo"}]'::jsonb),

('Êxodo 20', 'Os dez mandamentos',
 'dez mandamentos lei tabuas sinai moises decalogo',
 'No monte Sinai, com trovões e fumaça, Deus entrega dez palavras. As quatro primeiras tratam da relação com Deus; as seis seguintes, da relação entre as pessoas. O povo fica ao pé do monte, com medo, e pede que Moisés fale por eles.',
 'A ordem importa: a lei vem DEPOIS da libertação, não antes. Deus não diz "obedeçam e eu os tiro do Egito" — ele tira primeiro e depois ensina a viver em liberdade. O quinto mandamento, honrar pai e mãe, é o único que vem com uma promessa junto.',
 '[{"nome":"Moisés","quem":"subiu ao monte e desceu com as tábuas"},{"nome":"O povo","quem":"ficou embaixo, e pediu que Moisés falasse por eles"}]'::jsonb,
 '{"Monte Sinai"}',
 '[{"palavra":"Não tomarás o nome em vão","significado":"em vão é vazio, sem peso. Trata de usar o nome de Deus para dar força a mentira ou juramento falso"},{"palavra":"Cobiçar","significado":"desejar o que é do outro a ponto de querer tirar dele"}]'::jsonb),

('Josué 6', 'A queda de Jericó',
 'jerico muralhas josue trombetas raabe sete voltas',
 'O povo dá uma volta por dia ao redor da cidade, durante seis dias, em silêncio. No sétimo dia dão sete voltas, os sacerdotes tocam as trombetas, o povo grita, e a muralha cai. Raabe e sua família são poupadas por causa do cordão vermelho na janela.',
 'A primeira cidade da terra prometida cai sem cerco e sem aríete. O modo é quase constrangedor: andar em silêncio por uma semana enquanto a cidade inteira assiste. E quem se salva é uma prostituta estrangeira, que entra na genealogia de Jesus.',
 '[{"nome":"Josué","quem":"sucessor de Moisés, quem liderou a travessia e a conquista"},{"nome":"Raabe","quem":"a mulher de Jericó que escondeu os espias"}]'::jsonb,
 '{"Jericó","Rio Jordão"}',
 '[{"palavra":"Anátema","significado":"coisa consagrada à destruição, que não podia ser tomada como despojo. Foi o que Acã desobedeceu"},{"palavra":"Trombeta de chifre de carneiro","significado":"o shofar, usado para convocar e anunciar, não como instrumento de música"}]'::jsonb),

('1 Samuel 17', 'Davi e Golias',
 'davi golias gigante funda pedra filisteus vale do carvalho',
 'O gigante filisteu desafia o exército de Israel por quarenta dias e ninguém aceita. Davi, um pastor adolescente que só foi levar comida aos irmãos, se oferece. Recusa a armadura do rei, escolhe cinco pedras do ribeiro, e derruba Golias com a primeira.',
 'A frase que Davi diz antes de atirar é o centro de tudo: tu vens a mim com espada, eu vou a ti em nome do Senhor. A história não é sobre coragem de um garoto — é sobre alguém que mediu o gigante contra Deus, e não contra si mesmo. Todos os outros fizeram a conta ao contrário.',
 '[{"nome":"Davi","quem":"o caçula de Jessé, pastor de ovelhas"},{"nome":"Golias","quem":"o campeão filisteu, de quase três metros"},{"nome":"Saul","quem":"o rei, que ofereceu a própria armadura"}]'::jsonb,
 '{"Belém"}',
 '[{"palavra":"Funda","significado":"tira de couro para arremessar pedra. Arma de pastor contra animais, com alcance e força reais"},{"palavra":"Incircunciso","significado":"o termo com que Davi chama Golias. Quer dizer de fora do povo da aliança"}]'::jsonb),

('1 Reis 18', 'Elias no monte Carmelo',
 'elias carmelo baal profetas fogo altar acabe jezabel seca',
 'Depois de três anos de seca, Elias convoca 450 profetas de Baal para uma prova pública: dois altares, e o deus que responder com fogo é o verdadeiro. Eles clamam a manhã inteira e nada acontece. Elias encharca o seu altar com água e o fogo cai.',
 'O momento mais forte não é o fogo, é a pergunta do começo: até quando ficareis mancando entre dois pensamentos? O povo não tinha abandonado Deus — tinha juntado Baal por segurança. E é isso que Elias chama de mancar: viver com um pé em cada lado.',
 '[{"nome":"Elias","quem":"o profeta, sozinho contra 450"},{"nome":"Acabe","quem":"o rei de Israel"},{"nome":"Jezabel","quem":"a rainha, que trouxe o culto a Baal e matava os profetas"}]'::jsonb,
 '{"Monte Carmelo","Sarepta"}',
 '[{"palavra":"Baal","significado":"o deus cananeu da chuva e da fertilidade. Daí a ironia da seca de três anos"},{"palavra":"Mancar entre dois pensamentos","significado":"a imagem é de quem anda pulando entre duas pedras sem firmar o pé em nenhuma"}]'::jsonb),

('Salmos 23', 'O Senhor é o meu pastor',
 'salmo 23 pastor vale sombra morte verdes pastos mesa',
 'Seis versículos em duas imagens. Na primeira, Deus é pastor: guia, alimenta, e acompanha até pelo vale da sombra da morte. Na segunda, é anfitrião: prepara uma mesa diante dos inimigos e unge a cabeça com óleo.',
 'Repare que o salmo não promete ausência de perigo. Ele diz "ainda que eu andasse pelo vale" — o vale continua no caminho. O que muda é a companhia. E há uma virada no meio: até o versículo 3 Davi fala de Deus na terceira pessoa; no vale, passa a falar com ele.',
 '[{"nome":"Davi","quem":"o autor, que foi pastor antes de ser rei e sabia do que falava"}]'::jsonb,
 '{}',
 '[{"palavra":"Ungir com óleo","significado":"gesto de honra ao hóspede, e também o cuidado do pastor com a cabeça ferida da ovelha"},{"palavra":"Vale da sombra da morte","significado":"em hebraico é uma palavra só, que descreve escuridão profunda. Os desfiladeiros entre Jerusalém e Jericó eram assim"}]'::jsonb),

('Jonas 1', 'Jonas e o grande peixe',
 'jonas peixe baleia ninive tarsis tempestade fuga cabaco',
 'Mandado pregar em Nínive, Jonas embarca no sentido oposto. Vem a tempestade, ele é lançado ao mar e engolido por um grande peixe. Ao ser devolvido, vai a Nínive, a cidade se arrepende — e ele fica furioso com isso.',
 'O livro tem quatro capítulos, e o peixe ocupa um. O assunto de verdade é o capítulo 4: Jonas confessa que fugiu porque sabia que Deus perdoaria. Ele não tinha medo da missão, tinha medo de que desse certo. É um livro sobre alguém que quer a misericórdia para si e a justiça para o inimigo.',
 '[{"nome":"Jonas","quem":"o profeta que fugiu"},{"nome":"Os marinheiros","quem":"pagãos que, curiosamente, oram e relutam em jogá-lo ao mar"},{"nome":"O rei de Nínive","quem":"decretou jejum até para os animais"}]'::jsonb,
 '{"Jope","Nínive"}',
 '[{"palavra":"Társis","significado":"o ponto mais distante conhecido, provavelmente no sul da Espanha — o oposto exato de Nínive"},{"palavra":"Grande peixe","significado":"o texto hebraico diz peixe, não baleia. A tradição da baleia vem de traduções posteriores"}]'::jsonb),

('Daniel 6', 'Daniel na cova dos leões',
 'daniel leoes cova dario babilonia oracao janela persa',
 'Daniel é o preferido do rei, e os invejosos não acham nada contra ele. Então armam uma lei: durante trinta dias, só se pode pedir alguma coisa ao rei. Daniel continua orando três vezes ao dia, de janelas abertas. É lançado aos leões e sai sem arranhão.',
 'O detalhe que muda tudo está no versículo 10: ele orava com as janelas abertas, COMO SEMPRE TINHA FEITO. Não foi um ato de desafio nem de coragem súbita — foi a recusa a mudar a rotina por medo. A fidelidade dele já existia antes da lei.',
 '[{"nome":"Daniel","quem":"levado cativo ainda jovem, chegou a administrador do império"},{"nome":"Dario","quem":"o rei, que passou a noite em jejum e sem dormir"}]'::jsonb,
 '{"Babilônia"}',
 '[{"palavra":"Sátrapa","significado":"governador de uma província do império persa"},{"palavra":"Lei dos medos e persas","significado":"decreto que, assinado, não podia ser revogado nem pelo próprio rei"}]'::jsonb),

('Mateus 5', 'O sermão do monte',
 'sermao monte bem aventurancas sal luz mateus 5 6 7 pai nosso',
 'Jesus sobe um monte e ensina. Começa pelas bem-aventuranças — bem-aventurados os pobres de espírito, os que choram, os mansos — e segue com o sal da terra, a luz do mundo, o amor aos inimigos, o Pai Nosso e a casa sobre a rocha.',
 'É o discurso mais longo de Jesus nos evangelhos, e o mais desconfortável. Ele não afrouxa a lei: aperta. Não matar vira não odiar; não adulterar vira não cobiçar. O sermão não é um código de regras a cumprir, é um retrato de quem já foi alcançado.',
 '[{"nome":"Jesus","quem":"sentou-se para ensinar, como faziam os mestres"},{"nome":"A multidão","quem":"gente comum da Galileia, que ouviu e se admirou da autoridade dele"}]'::jsonb,
 '{"Mar da Galileia","Cafarnaum"}',
 '[{"palavra":"Bem-aventurado","significado":"feliz, mas num sentido mais fundo: alguém em situação de bênção, ainda que a vida não pareça boa"},{"palavra":"Pobres de espírito","significado":"quem reconhece que não tem nada a oferecer. Não é falta de ânimo, é falta de pretensão"}]'::jsonb),

('Lucas 10:25-37', 'O bom samaritano',
 'bom samaritano parabola proximo levita sacerdote jerico estrada',
 'Um doutor da lei pergunta quem é o seu próximo. Jesus conta de um homem assaltado na estrada de Jerusalém a Jericó. Um sacerdote passa e desvia. Um levita também. Um samaritano para, cuida dos ferimentos e paga a hospedagem.',
 'A pergunta era "quem é o meu próximo?", e Jesus devolve outra: quem SE FEZ próximo? O primeiro jeito de perguntar procura um limite — de quem eu preciso cuidar. O segundo não tem limite. E o herói da história é justamente o tipo de gente que quem perguntou desprezava.',
 '[{"nome":"O doutor da lei","quem":"queria justificar-se, diz o texto"},{"nome":"O samaritano","quem":"de um povo que os judeus evitavam"},{"nome":"O sacerdote e o levita","quem":"os dois homens religiosos, que passaram direto"}]'::jsonb,
 '{"Jerusalém","Jericó"}',
 '[{"palavra":"Levita","significado":"auxiliar do templo, da tribo de Levi. Passar direto tinha até justificativa: tocar em morto o deixaria impuro"},{"palavra":"Dois dinheiros","significado":"dois denários, dois dias de trabalho — o bastante para umas duas semanas de hospedagem"}]'::jsonb),

('Lucas 15:11-32', 'O filho pródigo',
 'filho prodigo perdido pai porcos heranca festa irmao mais velho',
 'O filho mais novo pede a herança em vida, vai embora e gasta tudo. Acaba cuidando de porcos e com fome. Volta ensaiando um pedido de desculpas, mas o pai o vê de longe, corre, e manda trazer a melhor roupa. O irmão mais velho se recusa a entrar na festa.',
 'A parábola tem dois filhos perdidos, e só um percebe. O mais novo se perdeu longe; o mais velho, dentro de casa, servindo por obrigação e guardando ressentimento. A história termina sem dizer se ele entrou — porque a pergunta é para quem está ouvindo.',
 '[{"nome":"O filho mais novo","quem":"pediu a herança como se o pai já tivesse morrido"},{"nome":"O pai","quem":"correu ao encontro dele, coisa que um homem de idade não fazia naquela cultura"},{"nome":"O filho mais velho","quem":"ficou, mas do lado de fora da festa"}]'::jsonb,
 '{}',
 '[{"palavra":"Pródigo","significado":"gastador, quem desperdiça. A palavra não aparece no texto — virou título depois"},{"palavra":"Alfarroba","significado":"vagem usada para alimentar porcos. Para um judeu, cuidar de porcos já era o fundo do poço"}]'::jsonb),

('João 11', 'A ressurreição de Lázaro',
 'lazaro morte marta maria betania ressurreicao jesus chorou tumulo',
 'Lázaro adoece e as irmãs mandam chamar Jesus, que demora dois dias. Quando chega, o amigo está morto há quatro. Marta e Maria dizem a mesma frase: se estivesses aqui, ele não teria morrido. Jesus chora, e depois chama Lázaro para fora do túmulo.',
 'O versículo mais curto da Bíblia está aqui: Jesus chorou. Ele sabia o que ia fazer em cinco minutos, e mesmo assim chorou. É a cena que mostra que saber o final não dispensa ninguém da dor do meio — e que Deus não trata luto como fraqueza.',
 '[{"nome":"Lázaro","quem":"o amigo de Jesus, irmão de Marta e Maria"},{"nome":"Marta","quem":"foi ao encontro dele na estrada"},{"nome":"Maria","quem":"ficou em casa e só saiu quando foi chamada"}]'::jsonb,
 '{"Betânia","Jerusalém"}',
 '[{"palavra":"Quatro dias","significado":"detalhe proposital: havia a crença de que a alma rondava o corpo por três dias. No quarto, não havia mais dúvida"},{"palavra":"Ressurreição","significado":"não é o mesmo que reanimar. Lázaro voltou para morrer de novo; a ressurreição de Jesus é de outra ordem"}]'::jsonb),

('Atos 2', 'O dia de Pentecostes',
 'pentecostes espirito santo linguas fogo pedro igreja jerusalem tres mil',
 'Cinquenta dias depois da Páscoa, com Jerusalém cheia de peregrinos, os discípulos estão reunidos. Vem um som como de vento e línguas de fogo. Eles falam, e cada visitante ouve na própria língua. Pedro prega, e três mil pessoas se juntam a eles no mesmo dia.',
 'É o avesso de Babel: lá as línguas se confundiram e o povo se espalhou; aqui a diferença continua, mas todos entendem. O Espírito não apaga a língua de ninguém — atravessa. E quem prega é o mesmo Pedro que, cinquenta dias antes, tinha negado conhecer Jesus.',
 '[{"nome":"Pedro","quem":"pregou o primeiro sermão da igreja"},{"nome":"Os doze","quem":"já com Matias no lugar de Judas"},{"nome":"Os peregrinos","quem":"judeus de quinze regiões diferentes, em Jerusalém para a festa"}]'::jsonb,
 '{"Jerusalém"}',
 '[{"palavra":"Pentecostes","significado":"quinquagésimo, em grego. Festa judaica da colheita, cinquenta dias depois da Páscoa"},{"palavra":"Línguas como de fogo","significado":"o texto diz COMO DE fogo, e como de vento. São comparações: o autor descreve algo para o qual falta palavra"}]'::jsonb);
