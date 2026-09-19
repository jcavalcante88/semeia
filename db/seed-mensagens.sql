-- Segunda leva de versiculos (75 novos, total 87).
-- Texto biblico: Almeida 1911 (dominio publico) — regra 5.
-- Rode UMA VEZ, depois de seed.sql.
--
-- Por que esta leva existe: o banco tinha 12 versiculos. Com dois blocos por
-- dia, a fila inteira dava a volta em 6 dias e a pessoa reconhecia tudo. Com
-- 87, a volta leva mais de um mes.
--
-- Versiculo curto e melhor aqui: isto aparece na notificacao push, onde o
-- Android corta em poucas linhas, e na home como "a palavra de hoje".

insert into mensagens (texto, referencia, tema) values

-- ---------------------------------------------------------------
-- Quem Deus e, e o que ele promete
-- ---------------------------------------------------------------
('Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.', 'João 3:16', 'amor'),
('Eu sou o caminho, e a verdade, e a vida; ninguém vem ao Pai senão por mim.', 'João 14:6', 'caminho'),
('Eu sou a luz do mundo; quem me segue não andará em trevas.', 'João 8:12', 'luz'),
('Jesus Cristo é o mesmo ontem, e hoje, e eternamente.', 'Hebreus 13:8', 'constância'),
('O céu e a terra passarão, mas as minhas palavras não hão de passar.', 'Marcos 13:31', 'permanência'),
('As misericórdias do Senhor renovam-se cada manhã; grande é a tua fidelidade.', 'Lamentações 3:23', 'esperança'),
('Porque para Deus nada é impossível.', 'Lucas 1:37', 'fé'),

-- ---------------------------------------------------------------
-- Medo, aflicao e ansiedade
-- ---------------------------------------------------------------
('Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.', 'Isaías 41:10', 'medo'),
('O Senhor é a minha luz e a minha salvação; a quem temerei?', 'Salmos 27:1', 'medo'),
('Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.', '1 Pedro 5:7', 'ansiedade'),
('Lança o teu cuidado sobre o Senhor, e ele te susterá.', 'Salmos 55:22', 'ansiedade'),
('Não andeis ansiosos pelo dia de amanhã, porque o dia de amanhã cuidará de si mesmo.', 'Mateus 6:34', 'ansiedade'),
('Muitas são as aflições do justo, mas o Senhor o livra de todas.', 'Salmos 34:19', 'aflição'),
('Perto está o Senhor dos que têm o coração quebrantado.', 'Salmos 34:18', 'consolo'),
('E Deus limpará de seus olhos toda a lágrima.', 'Apocalipse 21:4', 'consolo'),
('O Senhor pelejará por vós, e vós vos calareis.', 'Êxodo 14:14', 'descanso'),
('Aquietai-vos, e sabei que eu sou Deus.', 'Salmos 46:10', 'quietude'),

-- ---------------------------------------------------------------
-- Coragem e forca
-- ---------------------------------------------------------------
('Esforça-te, e tem bom ânimo; não temas, nem te espantes.', 'Josué 1:9', 'coragem'),
('Sede fortes e corajosos; não temais, porque o Senhor vosso Deus é o que vai convosco.', 'Deuteronômio 31:6', 'coragem'),
('Se Deus é por nós, quem será contra nós?', 'Romanos 8:31', 'coragem'),
('Os que esperam no Senhor renovarão as suas forças; subirão com asas como águias.', 'Isaías 40:31', 'força'),
('Espera no Senhor, anima-te, e ele fortalecerá o teu coração.', 'Salmos 27:14', 'espera'),
('A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza.', '2 Coríntios 12:9', 'fraqueza'),
('Não nos cansemos de fazer o bem, porque a seu tempo ceifaremos, se não houvermos desfalecido.', 'Gálatas 6:9', 'perseverança'),

-- ---------------------------------------------------------------
-- Confianca e direcao
-- ---------------------------------------------------------------
('Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento.', 'Provérbios 3:5', 'confiança'),
('Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.', 'Provérbios 3:6', 'direção'),
('Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.', 'Salmos 37:5', 'confiança'),
('Todas as coisas contribuem juntamente para o bem daqueles que amam a Deus.', 'Romanos 8:28', 'propósito'),
('Porque eu bem sei os pensamentos que penso de vós: pensamentos de paz, e não de mal.', 'Jeremias 29:11', 'esperança'),
('O meu socorro vem do Senhor, que fez o céu e a terra.', 'Salmos 121:2', 'socorro'),
('O Senhor te guardará de todo o mal; ele guardará a tua alma.', 'Salmos 121:7', 'proteção'),
('Porque andamos por fé, e não por vista.', '2 Coríntios 5:7', 'fé'),
('A fé é o firme fundamento das coisas que se esperam, e a prova das coisas que se não veem.', 'Hebreus 11:1', 'fé'),
('Tudo é possível ao que crê.', 'Marcos 9:23', 'fé'),
('Eu creio; ajuda a minha incredulidade.', 'Marcos 9:24', 'fé'),
('Provai, e vede que o Senhor é bom.', 'Salmos 34:8', 'fé'),

-- ---------------------------------------------------------------
-- Paz e alegria
-- ---------------------------------------------------------------
('A paz vos deixo, a minha paz vos dou; não se turbe o vosso coração.', 'João 14:27', 'paz'),
('E a paz de Deus, que excede todo o entendimento, guardará os vossos corações.', 'Filipenses 4:7', 'paz'),
('Bem-aventurados os pacificadores, porque eles serão chamados filhos de Deus.', 'Mateus 5:9', 'paz'),
('Alegrai-vos sempre no Senhor; outra vez digo: alegrai-vos.', 'Filipenses 4:4', 'alegria'),
('Este é o dia que fez o Senhor; regozijemo-nos, e alegremo-nos nele.', 'Salmos 118:24', 'alegria'),
('Deleita-te também no Senhor, e ele te concederá os desejos do teu coração.', 'Salmos 37:4', 'alegria'),
('Louvai ao Senhor, porque ele é bom, porque a sua benignidade dura para sempre.', 'Salmos 136:1', 'gratidão'),
('Em tudo dai graças, porque esta é a vontade de Deus.', '1 Tessalonicenses 5:18', 'gratidão'),
('Porque o meu jugo é suave e o meu fardo é leve.', 'Mateus 11:30', 'descanso'),

-- ---------------------------------------------------------------
-- Perdao e recomeco
-- ---------------------------------------------------------------
('Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar.', '1 João 1:9', 'perdão'),
('Ainda que os vossos pecados sejam como a escarlata, eles se tornarão brancos como a neve.', 'Isaías 1:18', 'perdão'),
('Quão longe está o oriente do ocidente, assim afasta de nós as nossas transgressões.', 'Salmos 103:12', 'perdão'),
('Cria em mim, ó Deus, um coração puro, e renova em mim um espírito reto.', 'Salmos 51:10', 'perdão'),
('Sede uns para com os outros benignos, perdoando-vos uns aos outros.', 'Efésios 4:32', 'perdão'),
('Se alguém está em Cristo, nova criatura é; as coisas velhas já passaram.', '2 Coríntios 5:17', 'renovação'),
('Porque pela graça sois salvos, por meio da fé; e isto não vem de vós, é dom de Deus.', 'Efésios 2:8', 'graça'),

-- ---------------------------------------------------------------
-- Oracao e busca
-- ---------------------------------------------------------------
('Pedi, e dar-se-vos-á; buscai, e encontrareis; batei, e abrir-se-vos-á.', 'Mateus 7:7', 'oração'),
('Orai sem cessar.', '1 Tessalonicenses 5:17', 'oração'),
('Buscar-me-eis, e me achareis, quando me buscardes de todo o vosso coração.', 'Jeremias 29:13', 'busca'),
('Eis que estou à porta, e bato; se alguém ouvir a minha voz, e abrir a porta, entrarei.', 'Apocalipse 3:20', 'convite'),
('Onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles.', 'Mateus 18:20', 'comunhão'),
('Sonda-me, ó Deus, e conhece o meu coração.', 'Salmos 139:23', 'entrega'),

-- ---------------------------------------------------------------
-- Como viver com os outros
-- ---------------------------------------------------------------
('Amarás o teu próximo como a ti mesmo.', 'Mateus 22:39', 'amor'),
('Sobre tudo isto, revesti-vos de amor, que é o vínculo da perfeição.', 'Colossenses 3:14', 'amor'),
('Nem a morte, nem a vida poderá separar-nos do amor de Deus.', 'Romanos 8:38', 'amor'),
('Levai as cargas uns dos outros, e assim cumprireis a lei de Cristo.', 'Gálatas 6:2', 'compaixão'),
('Sede misericordiosos, como também vosso Pai é misericordioso.', 'Lucas 6:36', 'misericórdia'),
('Dai, e ser-vos-á dado.', 'Lucas 6:38', 'generosidade'),
('Não saia da vossa boca nenhuma palavra torpe, mas só a que for boa para edificação.', 'Efésios 4:29', 'palavras'),
('Vós sois a luz do mundo; não se pode esconder uma cidade edificada sobre um monte.', 'Mateus 5:14', 'testemunho'),
('Mas o fruto do Espírito é: amor, alegria, paz, longanimidade, benignidade.', 'Gálatas 5:22', 'caráter'),

-- ---------------------------------------------------------------
-- Sabedoria, tempo e trabalho
-- ---------------------------------------------------------------
('O princípio da sabedoria é o temor do Senhor.', 'Provérbios 9:10', 'sabedoria'),
('Ensina-nos a contar os nossos dias, de tal maneira que alcancemos coração sábio.', 'Salmos 90:12', 'sabedoria'),
('Sobre tudo o que se deve guardar, guarda o teu coração, porque dele procedem as saídas da vida.', 'Provérbios 4:23', 'coração'),
('Tudo tem o seu tempo determinado, e há tempo para todo o propósito debaixo do céu.', 'Eclesiastes 3:1', 'tempo'),
('Melhor é o fim das coisas do que o princípio delas.', 'Eclesiastes 7:8', 'paciência'),
('Tudo quanto fizerdes, fazei-o de todo o coração, como ao Senhor, e não aos homens.', 'Colossenses 3:23', 'trabalho'),
('Se o Senhor não edificar a casa, em vão trabalham os que a edificam.', 'Salmos 127:1', 'trabalho'),
('Não ajunteis tesouros na terra, mas ajuntai tesouros no céu.', 'Mateus 6:20', 'prioridades');
