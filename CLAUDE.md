# Semeia — contexto do projeto

Você está construindo o **Semeia**: um app cristão brasileiro que envia versículos
bíblicos algumas vezes ao dia, tem um quiz de múltipla escolha com ranking público,
um mural de notícias do mundo cristão e pedidos de oração.

Autor: Jerry. Fale comigo em **português do Brasil**. Código, comentários e textos
de interface também em português.

## O que o app faz

14. **Carrossel de destaques** — na tela inicial, **abaixo** da palavra de
   hoje. Esteve acima por um tempo e voltou para baixo a pedido meu: quem abre
   o app para ler um versículo tem que encontrar o versículo, não uma notícia. 15 cartões: os shows que ainda vão acontecer primeiro,
   depois as notícias mais recentes. Anda sozinho a cada 5 segundos e **para
   para sempre** assim que a pessoa encosta — carrossel que continua andando
   enquanto você lê é a razão de quase todo mundo odiar carrossel.

   > É rolagem NATIVA com `scroll-snap`, não `transform` com um índice em
   > JavaScript. Assim o dedo arrasta com a inércia que a pessoa conhece, o
   > trackpad funciona, o teclado funciona e o leitor de tela lê a lista
   > inteira. As quatro coisas quebram no carrossel de `transform`.
   >
   > **O passo mede o CARTÃO, não a tira.** Acima de 40rem cabem dois cartões
   > lado a lado; medindo a tira, ele pularia de dois em dois e a bolinha
   > acenderia errada.
   >
   > **Tem botão de pausar, anterior e próximo**, mais uma barrinha que enche
   > em 5 segundos. A barra existe para a pausa ser VISÍVEL: sem ela, quem
   > aperta pausa só descobre se funcionou depois de esperar cinco segundos.
   > As pontas dão a volta — botão que não faz nada na ponta parece quebrado.
   >
   > **Movimento reduzido decide como o carrossel COMEÇA, não o proíbe.** A
   > primeira versão simplesmente não deixava andar nunca com essa preferência
   > ligada — e aí o botão de tocar não fazia nada para essas pessoas, o que é
   > pior do que não ter botão. Hoje ele começa parado e o botão vale, porque
   > apertar tocar é um pedido explícito.
   >
   > **A tabela `eventos` nasce vazia e só recebe show de verdade.** Nenhum
   > feed RSS traz agenda, e show inventado aparece na tela com data, hora e
   > endereço — alguém pode sair de casa por causa dele. Eu já tinha deixado
   > dois exemplos falsos no banco em setembro; foram apagados. Sem evento, o
   > carrossel mostra só notícia, e não quebra.

1. **Mensagens diárias** — o usuário escolhe horários (padrão **7h e 19h**) e recebe
   um versículo por notificação push, mesmo com o app fechado.

   > **A notificação manda a MESMA palavra que a tela inicial mostra.** A
   > consulta mora em `src/lib/palavra.ts` e as duas a chamam. Antes a home
   > fazia o rodízio de 12 horas e a rota de disparo fazia `order by random()`
   > entre as ainda não enviadas: chegava uma notificação com um versículo, a
   > pessoa abria o app e encontrava outro. A notificação é um convite para
   > entrar — entrar e achar coisa diferente desfaz o convite. Duas cópias da
   > mesma regra em arquivos diferentes foi exatamente como elas se separaram.
   >
   > Isso **trocou a garantia de "nunca repete"**. `envios` ainda guarda o
   > histórico e o `not exists` de 90 minutos ainda impede o envio dobrado da
   > janela de duas horas, mas o rodízio dá a volta: com 87 versículos e 2 por
   > dia, um volta depois de 43 dias e meio. É o mesmo ciclo que a tela inicial
   > já tinha, e é o preço de as duas dizerem a mesma coisa.
   >
   > **A inscrição de push NÃO é para sempre, e foi por isso que as mensagens
   > pararam.** O navegador troca o endereço dela sozinho — atualização do
   > Chrome, limpeza de dados, aparelho muito tempo sem abrir. O endereço velho
   > passa a responder 410, a rota de disparo o apaga (e faz certo), e ninguém
   > reinscrevia: a inscrição só nascia quando a pessoa apertava "Ativar as
   > mensagens", uma vez na vida. Em 5 de outubro de 2026 o banco tinha 11
   > pessoas com horário marcado e **zero inscrições** — todas apagadas por 410,
   > em silêncio, com a permissão ainda concedida no celular.
   >
   > Agora `ReinscreverPush.tsx` confere em toda abertura do app e reinscreve
   > quem já autorizou. Não pede permissão a ninguém: só age com
   > `Notification.permission === "granted"`. O `pushsubscriptionchange` do
   > `sw.js` é a segunda linha — o Firefox dispara, o Chrome quase nunca, então
   > não dá para depender só dele.
2. **Quiz** — 50 perguntas de múltipla escolha por rodada, sorteadas entre as que a
   pessoa ainda não respondeu, com **25 segundos** para responder cada uma. Ela clica
   numa alternativa e vê na hora se acertou, junto com a explicação e o versículo
   que responde a pergunta.
3. **Ranking público** — quem mais pontua aparece numa lista que todos veem, com
   pódio para os três primeiros.
4. **Mundo cristão** — notícias coletadas de feeds RSS a cada 12 horas, com título,
   resumo, imagem e link para a fonte.
5. **Pedidos de oração** — a pessoa publica um pedido e outras marcam "orei por você".
   O autor recebe push nos marcos (1, 3, 10, 25, 50, 100 orações), nunca a cada clique.

   > **O mural aparece na home e no fim do desafio.** Em dez dias ele recebeu
   > UM pedido — e esse pedido recebeu três orações, ou seja, quem chegava lá
   > usava. Faltava o caminho: a home linkava para quiz, desafio, notícias,
   > ranking e apoiar, e **não linkava para a oração**. A única porta era um
   > ícone na barra de baixo, entre outros oito.
   >
   > `MuralNaHome.tsx` mostra o pedido mais recente **de verdade**, com a
   > contagem de orações. Nada de pedido inventado para encher o mural: mural
   > que parece vazio continua vazio, e a saída honesta é mostrar que ele não
   > está vazio, não fingir que não está.
   >
   > O cartão é de propósito mais quieto que os de quiz e desafio — sem ouro
   > cheio, sem borda grossa. Pedido de oração carrega doença, família e vício;
   > chamar atenção com a mesma voz de um jogo seria fora de tom.
   >
   > **O app nunca mostra QUEM orou**, nem para o autor do pedido: a API
   > devolve só a contagem. Isso é comportamento, não acaso — não transforme
   > em lista de nomes sem me perguntar.
6. **Revisar erros** — `/revisar` mostra o que a pessoa errou, com explicação e versículo.
7. **Sequência de dias** — faixa discreta na home. Some quando quebra: sem cobrança.
13. **Mandar o versículo para alguém** — botão ao lado de "continuar lendo",
   na tela inicial. O app já compartilhava o PLACAR, que fala de quem
   compartilha; este manda o versículo, que fala de quem recebe. É a porta de
   entrada mais honesta que existe aqui: quem chega vem por um versículo que
   alguém escolheu mandar, não por propaganda de aplicativo. Usa
   `navigator.share` no celular, cai no `wa.me` no computador e, se o
   pop-up for bloqueado, copia para a área de transferência. O link vai para a
   **home**, não para o quiz: quem recebe um versículo quer ler o versículo.

8. **Card de resultado** — imagem 1080x1920 em `/api/og/resultado`, para o story. O metal
   (bronze / prata / ouro) vem da fração do banco de perguntas já acertada: 30% e 60%.
   É progressão, não aproveitamento — acertar 10 de 10 não é conhecer a Bíblia.
10. **Soletrar** — montar a resposta com letras embaralhadas, em `/soletrar`. 61 níveis
   montados das perguntas cuja resposta é uma palavra só, ordenados por tamanho
   (NOÉ antes de CARPINTEIRO). **Não pontua no ranking** — progresso próprio, porque
   o teclado já entrega as letras e isso enfraqueceria a garantia do ranking.
   Nenhum nível fica trancado, e errar não custa nada.

   > Chamava-se **Enigma** até setembro de 2026. Trocado por pedido meu:
   > "enigma" puxa para mistério e ocultismo, que é o oposto do tom do app.
   > As tabelas do banco foram renomeadas com `alter table` (os 61 níveis e
   > o progresso de quem já jogou continuam lá), e `next.config.mjs`
   > redireciona `/enigma` para `/soletrar` de forma permanente.
11. **Quebra-cabeça** — o jogo das quinze peças que deslizam, em `/quebra-cabeca`.
   Cada quadro é uma cena bíblica cortada em 4x4; ao montar, a pessoa lê o que a
   cena conta, com o versículo. Toque, arrasto e setas do teclado — celular e
   computador. **Não pontua no ranking**, como o Soletrar. O que já foi montado
   fica no `localStorage`, não no banco: não há nada a proteger de DevTools aqui.

   > **Embaralhar sorteando as 16 posições dá um tabuleiro impossível em metade
   > das vezes** — o jogo dos 15 tem duas classes de permutação e só uma se
   > resolve. Por isso embaralho fazendo jogadas legais a partir da imagem
   > pronta. Testei 20 mil embaralhadas: nenhuma sem solução.

   > **Todo quadro vem de uma imagem que eu mando.** A lista é
   > `scripts/quadros-lista.mjs` e a importação é `scripts/importar-quadro.mjs`,
   > que recorta em 720x720. Houve uma fase com cenas desenhadas em SVG, porque
   > daqui não dá para baixar arte nenhuma (o servidor do Wikimedia recusa toda
   > requisição); sumiram assim que chegaram imagens de verdade.
   >
   > **Imagem com marca d'água de quem vende não entra**: o app é público,
   > publicar é redistribuir. Já recusei três — uma foto de produção com atores
   > reais e duas de banco de imagens. Marca do próprio gerador de IA numa
   > imagem que eu gerei é outra coisa: a imagem é minha.
   >
   > **Imagem com linhas de quebra-cabeça desenhadas atrapalha.** O jogo corta
   > em 16 quadrados, e as linhas falsas não coincidem com os cortes reais —
   > fica poluído. Peça a arte sem elas. E menos de 720px de origem sai borrada.

12. **Desafio do dia** — 5 perguntas em `/desafio`, **as mesmas para todo
   mundo**, trocando à meia-noite de Brasília. É o motivo de voltar amanhã: o
   quiz é grande e finito (o Jefferson respondeu 50 num dia e sumiu), o desafio
   é curto e novo todo dia. Mostra a sequência de dias seguidos e a média de
   acertos de hoje — só dá para comparar porque as cinco são as mesmas.

   > **Ele corre POR FORA do quiz, de propósito.** Grava em
   > `desafio_respostas`, nunca em `respostas`: o quiz tem
   > `unique (usuario_id, pergunta_id)`, uma tentativa por pergunta para
   > sempre, e gravar ali queimaria a pergunta no quiz — seria mudar o
   > comportamento dele sem uma linha de código mudar. Também **não pontua no
   > ranking**.
   >
   > Quem escolhe as cinco é a view `desafio_de_hoje`: `md5(id)` faz um
   > embaralhamento fixo do banco (mistura a dificuldade, coisa que ordenar por
   > id não faria) e a data desliza uma janela de 5 sobre ele — 60 dias para dar
   > a volta nas 300. **A view não tem `correta` nem `explicacao`**, então não
   > existe caminho em que ela vaze; o gabarito só sai no POST, depois da
   > escolha, e uma vez por dia (chave primária `(usuario_id, dia, pergunta_id)`).
   >
   > A data é do Postgres, no fuso de São Paulo. Nunca do navegador: bastaria
   > adiantar o celular para jogar o desafio de amanhã.
   >
   > **O quiz deixa para o fim as perguntas já vistas no desafio.** É a única
   > linha do quiz que o desafio encostou: um termo a mais no `order by` de
   > `/api/quiz/perguntas`. Elas **continuam na fila** — excluir tiraria pontos
   > de quem joga o desafio, e o desafio não pode custar nada. Medido com 40
   > perguntas marcadas como vistas: 0 repetidas em 20 rodadas, contra 6,7 por
   > rodada que apareceriam sem isso.

15. **Busca de passagens** — barra abaixo da palavra de hoje. Procurando uma
   passagem, parábola ou lugar, `/buscar` mostra: o que acontece, o que
   significa, quem aparece, as palavras difíceis, e **onde fica, num mapa de
   satélite**.

   > **O conteúdo é escrito à mão, uma passagem por vez.** O app não tem a
   > Bíblia dentro dele e não tem IA rodando no servidor — resumir um capítulo
   > na hora exigiria inventar texto bíblico, e isso não se faz aqui. São
   > 1.189 capítulos; `db/passagens.sql` cobre as que as pessoas procuram
   > (15 hoje). **Nunca gere passagem automaticamente.**
   >
   > **Ela procura em cinco lugares**: as 15 passagens escritas à mão, os 87
   > versículos do app, os 42 lugares do atlas, as 300 perguntas do quiz e o
   > capítulo da Bíblia quando o termo é uma referência ("João 3" abre o link
   > do capítulo mesmo sem passagem escrita para ele). Os versículos eram o
   > buraco maior: procurar "Salmos 23" não achava nada, sendo que o versículo
   > estava no banco desde o primeiro dia.
   >
   > **Acento se resolve na coluna `busca`**, não na consulta: `lugares` e
   > `mensagens` têm uma cópia do texto sem acento e em minúsculas, preenchida
   > por `db/busca-indexar.mjs`. A extensão `unaccent` do Postgres resolveria
   > isso no banco, mas ligar extensão exige superusuário, que o Neon não dá.
   > **Rode o script depois de acrescentar lugar ou versículo.**
   >
   > A busca também cai nas 300 perguntas do quiz, que já têm explicação e
   > versículo. É a rede para quem procura fora da lista curada. O gabarito
   > sai ali e **não fere a regra 1**: ela protege `/api/quiz/perguntas`, que
   > alimenta a rodada valendo ponto; aqui é material de estudo, fora do quiz.
   >
   > **Os exemplos passam dentro da barra, um a cada 3,2s.** O texto fixo era
   > "Procure uma passagem, parábola ou lugar" — 38 caracteres que não cabem
   > num celular de 360px, e o fim sumia justo na parte que ninguém adivinharia.
   > Dizer menos por vez mostra mais no total. Cada exemplo é real e acha algo:
   > exemplo que não acha nada ensina a pessoa a desconfiar da barra.
   >
   > A dica é um `<span>` POR CIMA do campo, não o `placeholder`: placeholder
   > não se anima nem ganha reticências. Ela tem `pointer-events: none` para o
   > toque atravessar e `aria-hidden` porque repete o `aria-label` (sem isso o
   > leitor de tela anunciaria a troca a cada 3 segundos).
   >
   > **Esconder e parar são coisas diferentes.** Com o campo em foco ou com
   > texto digitado a dica SOME, senão ficaria por baixo do que a pessoa
   > escreve. Com o mouse em cima ela fica na tela e só não troca mais: no
   > computador o ponteiro chega antes do clique, e quem está lendo para
   > decidir se clica merece que ela espere. No celular isso não existe — lá o
   > dedo já chega clicando.
   >
   > **Movimento reduzido NÃO congela a dica — errei isso duas vezes.** A
   > primeira versão não trocava o exemplo com a preferência ligada, e no
   > computador do Jerry ela está: a barra ficou presa em "o bom samaritano"
   > para sempre, ensinando uma das oito coisas que ela existe para ensinar.
   > Ficou pior que o texto fixo antigo, que ao menos nomeava três categorias.
   > É o mesmo erro do carrossel, que já estava escrito aqui. Trocar a palavra
   > é informação; movimento é o deslize e o apagar. Com a preferência ligada
   > o exemplo continua passando e a troca é seca.
   >
   > **O mapa não usa biblioteca.** `MapaSatelite.tsx` calcula qual quadrado
   > do mosaico cobre a coordenada e monta 3x3 com `<img>`. Leaflet serve para
   > arrastar e dar zoom; aqui o mapa é figura parada, e figura parada não
   > precisa de 40 KB de JavaScript. As imagens são do World Imagery da Esri,
   > que permite uso não comercial **com crédito visível** — o crédito está no
   > rodapé do mapa e não pode sair.
   >
   > `db/atlas.sql` tem 42 lugares com coordenadas conferidas uma a uma.
   > Cinco estão marcados como `incerto` (o monte Sinai é o caso clássico) e a
   > tela DIZ isso: melhor admitir a dúvida do que fingir precisão.

9. **Ouvir a pergunta** — botão lê enunciado e alternativas com a voz do navegador
   (`speechSynthesis`), de graça e sem arquivo de áudio. O cronômetro pausa enquanto
   a voz fala, e nada toca sozinho. Sem voz em português, o botão não aparece.

## Tom

O app é um **convite**, nunca um confronto. Nada de debate com ateus, nada de
simulador de objeções, nada de humor sarcástico ou de mau gosto. Quem erra recebe
o versículo explicando com gentileza, nunca uma reprovação. Sem som de erro, sem
nada que humilhe.

> Até setembro de 2026 esta seção também dizia "sem contagem regressiva". Eu pedi
> o cronômetro por pergunta. Ele existe, mas com duas travas que preservam o
> resto da regra: **o relógio para assim que a pessoa responde** (a explicação e o
> versículo se leem sem pressa), e **estourar o tempo pula a pergunta, não a erra**
> — ela volta numa rodada futura em vez de ser queimada pela regra da tentativa
> única. Medi as 52 perguntas antes de escolher o número: média de 4,1s só de
> leitura, e a mais longa leva 7,6s. Passou por 7s, 10s e 40s; hoje está em 25s.
> A constante é `SEGUNDOS` no topo de `src/app/quiz/Quiz.tsx`.

A pessoa que chega pelo Instagram pode não ser cristã e não saber nada da Bíblia.
O texto da interface tem que funcionar para ela.

## Stack (não troque sem me perguntar)

- Next.js 15, **App Router**, **TypeScript**
- Neon (Postgres), driver `@neondatabase/serverless`
- Vercel (plano Hobby)
- `web-push` para notificações (VAPID, sem Firebase)
- GitHub Actions como agendador
- Sem Tailwind: CSS puro em `src/app/globals.css` com variáveis
- Sem ORM (Prisma, Drizzle): SQL direto com template tag do Neon
- Sem parser de XML: `src/lib/rss.ts` lê RSS em ~120 linhas, sem dependência

Tudo tem que rodar de graça. Só posso pagar domínio e a conta do Google Play.

## Regras que não se quebram

**1. A resposta certa nunca sai do servidor.**
`/api/quiz/perguntas` devolve só `id`, `enunciado`, `alternativas` e `nivel`.
A única exceção é `/api/quiz/erros`: lá o gabarito pode sair, porque o filtro é
`acertou = false` do próprio usuário — pergunta que ela já respondeu e já perdeu,
e que pela tentativa única nunca mais pontua.
Nunca `correta`, nunca `explicacao`. A correção acontece em
`/api/quiz/responder`, que recebe apenas `{ perguntaId, escolha }`.
Se o gabarito for para o navegador, qualquer pessoa abre o DevTools e gabarita
o ranking. Esta é a regra mais importante do projeto.

**2. Toda trava mora no banco, não no JavaScript.**
Uma tentativa por pergunta: `unique (usuario_id, pergunta_id)` em `respostas`.
Um "orei por você" por pessoa: chave primária `(usuario_id, pedido_id)` em `oracoes`.
Uma notícia por link: `link unique` em `noticias`. Um pedido de oração a cada 6
horas: consulta de data no `POST /api/oracao`. Nada disso se contorna pelo DevTools.

**3. Ranking semanal é o padrão.**
Ranking geral congela e o novato desiste. A semana zera na segunda-feira, fuso
`America/Sao_Paulo`. Deixe o Postgres fazer a conta de fuso — nunca em JavaScript.

**4. Aparecer em público é sempre opt-in, e a caixa começa desmarcada.**
Convicção religiosa é dado sensível na LGPD, e caixa pré-marcada não é
consentimento. No ranking, o que aparece é um nome escolhido pela pessoa, nunca
nome completo nem e-mail. Nos pedidos de oração o padrão é **anônimo**, porque
pedido costuma carregar doença, família e vício.

**5. Só Bíblia em domínio público.**
NVI, ARA, ACF, NVT e NAA são protegidas e cobram licença. Use **Almeida 1911** ou
Bíblia Livre. A versão aparece no rodapé. Se eu pedir outra versão, me lembre
disso antes de fazer.

**6. Sem conta, sem senha.**
Identidade anônima por cookie httpOnly, criada quando a pessoa escolhe um nome.
Quem vem do Instagram desiste se encontrar tela de cadastro. Auth.js fica para depois.
O cookie é `secure` só em produção — em `localhost` o navegador descartaria.

**7. O agendador é o GitHub Actions, não o Vercel Cron.**
O plano Hobby da Vercel só permite 1 execução de cron por dia. São dois workflows:
`mensagens.yml` de hora em hora e `noticias.yml` a cada 12 horas, ambos protegidos
por `Authorization: Bearer ${CRON_SECRET}`.
A rota de mensagens cobre **a hora atual e a anterior**, porque o GitHub atrasa
quando está congestionado — com igualdade exata o envio seria pulado em silêncio.

**8. iPhone só recebe push se o app estiver na tela de início.**
É limitação da Apple, sem contorno. A tela de ativação precisa explicar isso em
português simples: "toque em Compartilhar e depois em Adicionar à Tela de Início".

**9. Conteúdo de terceiros: só título, trecho e link.**
Copiar a matéria inteira é violação de direito autoral. O texto completo fica
sempre no site de origem, e o rodapé de `/noticias` diz de quem é o conteúdo.
As notícias são publicadas **automaticamente, sem revisão** — foi decisão minha,
sabendo que manchete de política partidária pode aparecer. Para tirar uma:
`update noticias set ativa = false where id = X`.

**11. Doação é Pix, e só Pix.**
Stripe e Mercado Pago cobram taxa e exigem conta de empresa. O Pix é gratuito,
cai na hora e aceita qualquer valor. O código `copia e cola` é montado em
`src/lib/pix.ts` sem dependência — é o padrão EMV do Banco Central, com CRC16
no fim. Nada de pop-up nem banner: um cartão na lateral e um link no rodapé.
Atenção: o plano Hobby da Vercel proíbe uso comercial. Doação é zona cinzenta,
e eu aceito o risco enquanto o app for gratuito.

**10. Arte de terceiros exige crédito visível.**
A pomba vem do Icons8 e a licença gratuita pede link de volta. O crédito está no
rodapé de `/configuracoes`. Trocando a arte, tire o crédito junto.

## Modelo de dados

```
usuarios         id uuid, apelido, fuso_horario, no_ranking bool, criado_em
preferencias     usuario_id, horarios text[], ativo   -- padrao {07:00,19:00}
inscricoes_push  id, usuario_id, endpoint unique, p256dh, auth
mensagens        id, texto, referencia, tema, versao, ativa, busca
envios           usuario_id + mensagem_id (PK)   -- impede repetir versículo
perguntas        id, enunciado, alternativas jsonb, correta smallint,
                 explicacao, versiculo, nivel, ativa
respostas        id, usuario_id, pergunta_id, acertou, pontos, respondida_em,
                 unique (usuario_id, pergunta_id)
noticias         id, titulo, resumo, link unique, fonte, imagem,
                 publicado_em, coletado_em, ativa
fontes_noticias  id, nome, url unique, ativa   -- ligar/desligar feed sem deploy
desafio_respostas usuario_id + dia + pergunta_id (PK)  -- uma tentativa por dia
views            desafio_de_hoje  -- as 5 perguntas de hoje, sem gabarito
soletrar         nivel serial, pergunta_id unique, ativa
soletrar_resolvidos usuario_id + nivel (PK)  -- progresso do Soletrar
pedidos_oracao   id, usuario_id, texto, anonimo, criado_em, ativo
oracoes          usuario_id + pedido_id (PK)   -- um "orei" por pessoa
views            ranking_semana, ranking_geral
```

Pontuação: fácil 10, médio 20, difícil 30. Errar vale 0. Nada de bônus de tempo.
Hoje são **300 perguntas ativas** (64 fáceis, 109 médias, 127 difíceis) e
**87 versículos**.

**A "palavra de hoje" é rodízio, nunca sorteio.** Ela era
`order by random() limit 1` com `revalidate = 300`: trocava a cada 5 minutos
— não tinha nada de "hoje" — e, como sorteio não tem memória, o mesmo
versículo voltava duas e três vezes seguidas. Hoje a posição vem do relógio,
num bloco de 12 horas (vira à meia-noite e ao meio-dia de Brasília), andando
na fila e só dando a volta depois de passar pelos 87. A conta de fuso é do
Postgres, como manda a regra 3. **Sorteio aqui parece aleatório e é sentido
como repetição** — a pessoa nota a repetição, nunca as 85 que não saíram.

**A resposta certa tem que se espalhar entre as quatro posições.** O app não
embaralha na tela: `/api/quiz/responder` compara o índice que o navegador
mandou com o `correta` do banco, e embaralhar no cliente quebraria essa
conferência. Então a ordem gravada é a ordem que a pessoa vê. Em setembro de
2026 o banco tinha 97 perguntas com a certa na 1ª opção, 37 na 2ª, 18 na 3ª e
**nenhuma na 4ª** — chutar o primeiro botão acertava 64% das vezes. Depois de
todo seed novo, rode `node db/redistribuir-alternativas.mjs`.

## Estrutura de arquivos

```
db/schema.sql
db/seed.sql                                  12 versículos + 12 perguntas
db/seed-perguntas.sql                        40 perguntas extras
db/seed-perguntas-3.sql                      50 perguntas extras
db/seed-perguntas-4.sql                      50 perguntas extras (34 dificeis)
db/seed-perguntas-5.sql                      52 perguntas: parabolas e milagres
db/seed-perguntas-6.sql                      49 perguntas: Genesis, Exodo, reis
db/seed-perguntas-7.sql                      46 perguntas: profetas e exilio
db/seed-mensagens.sql                        75 versiculos extras (total 87)
db/redistribuir-alternativas.mjs             espalha a resposta certa entre as 4 posicoes
db/noticias.sql                              tabelas de notícia e fontes
db/oracao.sql                                pedidos de oração
db/eventos.sql                               shows cristãos do carrossel (nasce vazia)
db/atlas.sql                                 42 lugares bíblicos com coordenadas
db/busca-indexar.mjs                         preenche as colunas `busca` sem acento
db/passagens.sql                             passagens explicadas, escritas à mão
db/soletrar.sql                              níveis do Soletrar + progresso
db/desafio.sql                               tabela do desafio + view desafio_de_hoje
arte/pomba.png                               arte de origem (Icons8)
scripts/icones.mjs                           gera os PNG do PWA com sharp
scripts/quadros-lista.mjs                    a lista unica dos quadros (titulo, versiculo, significado)
scripts/quadros-json.mjs                     gera src/lib/quadros.json a partir da lista
scripts/importar-quadro.mjs                  recorta uma imagem enviada em 720x720
src/lib/quadros.ts                           le src/lib/quadros.json, gerado pela lista
public/quadros/*.png                         as cenas do quebra-cabeca
public/{sw.js,manifest.json,pomba.png,icone-192.png,icone-512.png,badge.png}
.github/workflows/mensagens.yml              cron de hora em hora
.github/workflows/noticias.yml               cron 06:10 e 18:10 de Brasília
src/lib/{db,tipos,pontos,sessao,rss,pix,biblia,soletrar}.ts
src/lib/palavra.ts                           a palavra do bloco de 12h: home E notificação
src/app/globals.css
src/app/globals.papel.css.bak                tema "papel" antigo, para voltar
src/app/globals.ceu-azul.css.bak             tema "céu azul", idem
src/app/globals.branco-ouro.css.bak          tema "branco e ouro", idem
src/app/layout.tsx
src/app/{Logo,Navegacao,Voltar}.tsx          logo, menus e botão de voltar
src/app/{icon,apple-icon,opengraph-image}.png  favicon e cartão do WhatsApp
src/app/page.tsx                             palavra de hoje + chamada do quiz
src/app/quiz/{page.tsx,Quiz.tsx,AtivarMensagens.tsx,Ouvir.tsx}
src/app/ranking/page.tsx                     pódio + lista
src/app/noticias/page.tsx
src/app/oracao/{page.tsx,Oracao.tsx}
src/app/revisar/{page.tsx,Revisar.tsx}       perguntas erradas + explicação
src/app/soletrar/{page.tsx,Soletrar.tsx}     mapa de níveis + montar a palavra
src/app/quebra-cabeca/{page.tsx,QuebraCabeca.tsx}  jogo das 15 peças
src/app/desafio/{page.tsx,Desafio.tsx}       as 5 perguntas do dia
src/app/api/desafio/route.ts                 GET as 5 de hoje, POST confere uma
src/app/api/soletrar/route.ts                GET mapa/nível, POST confere a palavra
next.config.mjs                              redireciona /enigma -> /soletrar
src/app/apoiar/{page.tsx,Apoiar.tsx}        doação por Pix, código gerado em src/lib/pix.ts
src/app/Sequencia.tsx                        faixa de dias seguidos
src/app/CompartilharVersiculo.tsx            manda a palavra de hoje para alguém
src/app/MuralNaHome.tsx                      último pedido de oração na tela inicial
src/app/Carrossel.tsx                        a tira que rola, com scroll-snap
src/app/Busca.tsx                            a barra de busca, com os exemplos passando
src/app/ReinscreverPush.tsx                  reinscreve o push a cada abertura do app
src/app/buscar/page.tsx                      resultados: passagem, mapa e perguntas
src/app/MapaSatelite.tsx                     mosaico de satélite, sem biblioteca
src/app/DestaquesNaHome.tsx                  busca shows + notícias para o carrossel
src/app/configuracoes/{page.tsx,Configuracoes.tsx}
src/app/api/usuario/route.ts
src/app/api/quiz/{perguntas,responder}/route.ts
src/app/api/ranking/route.ts
src/app/api/push/inscrever/route.ts
src/app/api/oracao/route.ts                  GET, POST e DELETE
src/app/api/oracao/orei/route.ts             runtime nodejs (envia push nos marcos)
src/app/api/sequencia/route.ts
src/app/api/quiz/erros/route.ts
src/app/api/og/resultado/route.tsx           card do story, via next/og
src/app/api/cron/disparar/route.ts           runtime nodejs (web-push não roda no edge)
src/app/api/cron/noticias/route.ts           runtime nodejs
```

## Visual

**Azul, púrpura e escarlata: as cores do tabernáculo.** São as três citadas
juntas dezenas de vezes em Êxodo — as cortinas, o véu, as vestes do sacerdote.
Eram os três tingimentos mais caros do mundo antigo, e é por isso que estão lá.
O fundo é **linho**, não branco puro: o tabernáculo era tecido de linho fino
*com* fios dessas cores. Cor forte em tudo cansa; ela vale como fio.

> O tema mudou três vezes. Era "papel claro" até setembro de 2026; virou céu
> azul; virou branco e ouro; hoje é o tabernáculo. Os três anteriores estão em
> `src/app/globals.papel.css.bak`, `globals.ceu-azul.css.bak` e
> `globals.branco-ouro.css.bak` — um `cp` restaura qualquer um.

```
--papel       #FDFBF6   linho
--tinta       #1B2340   texto principal (14,9:1 sobre o linho)
--tinta-suave #4D5570   texto secundário (7,3:1)
--azul        #1D3C8F   tekhelet, o azul das franjas e do véu
--azul-vivo   #2E5BBF   brilho, botões, item de menu ativo
--azul-fundo  #142A63   azul escuro para texto
--azul-claro  #C9D6F0   bordas
--purpura     #6B2151   argaman, a realeza — selo da pomba, fonte da notícia
--purpura-vivo #8B2F6B
--acerto      #1E6B3A   acertou (verde, fora da família das três)
--escarlata   #A4162B   tola'at shani — erros e selos cheios
```

**Azul e púrpura carregam texto BRANCO** (10:1 e 10,7:1). Isso é o contrário do
tema de ouro, onde branco sobre ouro dava 2,2:1 e **todo** botão precisava de
texto escuro. Toda a paleta foi medida antes de entrar: a mais apertada é o
verde do acerto, com 6,3:1.

**A escarlata mora nos selos cheios e nos erros, nunca em texto corrido.** Selo
escarlata lê-se como destaque editorial; um parágrafo escarlata pareceria erro.
Ela também é a cor do erro por um motivo que está no próprio texto: "ainda que
os vossos pecados sejam como a escarlata, eles se tornarão brancos como a neve"
(Isaías 1:18).

**Layout.** Acima de 992px são três colunas: menu à esquerda (com a pomba num selo
pinho), conteúdo no centro, atalhos à direita. Abaixo disso, coluna única com a
marca num cabeçalho grudado no topo e **um botão flutuante** no rodapé que abre
os nove destinos num painel. A lista de destinos vive só em `Navegacao.tsx`.

> Era uma barra com os nove lado a lado. Com nove colunas, cada uma ficava com
> 35px num celular de 320px e o rótulo tinha que encolher para 0,46rem — letra
> que muita gente não lê. Agora cada destino tem 44px de altura, o mínimo que
> um dedo acerta. O painel fecha ao trocar de página, com Escape e tocando
> fora: menu que só fecha pelo próprio botão prende quem abriu sem querer.

**`min-width: 0` e `width: 100%` na `.folha` seguram a página inteira.** Ela é
item de grid, e item de grid nasce com `min-width: auto` — "nunca menor que o
meu conteúdo". Com `margin: 0 auto` ele ainda deixa de esticar e passa a ser
medido pelo conteúdo. A tira do carrossel tem 15 cartões; somando o mínimo de
cada um dava **546px numa tela de 360**, e a folha ia junto.

> O estrago aparecia em três lugares que não pareciam ter relação com
> carrossel: **a página abria com zoom** (o navegador não consegue encolher
> para a largura do aparelho se o conteúdo não cabe), **a barra da pomba
> aparecia cortada**, e **sobrava uma faixa azul à direita** — o céu do fundo,
> aparecendo onde a folha não alcançava. Uma linha de CSS, três sintomas.

**A barra do celular e o ícone são a púrpura, e a cor mora em TRÊS
arquivos.** A barra acima do app (a de hora e bateria) e o fundo do favicon
ficaram dourados quando o tema de ouro saiu — a troca da paleta no CSS não
alcança nenhum dos dois. Quem manda são `themeColor` em `layout.tsx`,
`theme_color` no `manifest.json` e a constante `FUNDO` em
`scripts/icones.mjs`. Mudando a cor, mude nos três e rode
`node scripts/icones.mjs` — o script redesenha os sete PNG, e sem rodá-lo o
código fica certo e o ícone continua com a cor velha. A púrpura foi escolhida
porque a pomba é branca: em ouro claro ela quase sumia dentro do ícone.

**Tipos.** **Newsreader** para versículos, **Fraunces** para títulos, **Karla** para
interface. Escala fluida com `clamp()` — sem breakpoint de tamanho de letra.
A fonte é maior só em `/noticias`, que é leitura rápida, não meditação.

Mobile primeiro. Foco de teclado visível. `prefers-reduced-motion` respeitado: com
ele ligado as nuvens somem e as animações param.

**Cuidado com `padding` em porcentagem** — ele resolve contra a largura do **pai**,
não do próprio elemento. Já sumi com a logo inteira assim uma vez.

## Como trabalhar comigo

- Faça um passo de cada vez e me mostre o que fez antes de seguir.
- Rode `npx tsc --noEmit` depois de mexer em TypeScript. Se o npx baixar um pacote
  chamado `tsc`, use `node node_modules/typescript/bin/tsc --noEmit`.
- **Não rode `next build` enquanto meu `npm run dev` estiver de pé** — o build
  troca os arquivos de `.next` por baixo do servidor e ele quebra com
  `Cannot find module './XXX.js'`. Pare o servidor antes, ou use outra pasta.
- Nunca escreva segredo em arquivo versionado. Tudo em `.env.local`, com
  `.env.example` atualizado.
- Não instale dependência nova sem me perguntar antes.
- Se eu pedir algo que quebra uma das regras acima, me avise antes de fazer.
- Não crie testes automatizados por enquanto.
- Antes de apagar linha do banco, olhe o que vai sair. Já quase apaguei um usuário
  real achando que era de teste. **Nome não identifica ninguém** — pode existir uma
  Ana de verdade. Junte uma segunda condição que só o registro de teste satisfaz,
  como a data de criação: os cinco fictícios foram apagados com
  `criado_em < 2026-09-13 18:52`, o minuto em que eu os criei.
