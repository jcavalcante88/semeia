# Prompt de arranque — cole no Claude Code

Leia o CLAUDE.md deste projeto inteiro antes de começar.

Quero construir o Semeia do zero, nesta ordem. Pare no fim de cada etapa e me
mostre o resultado antes de seguir para a próxima.

**Etapa 1 — esqueleto**
Crie o projeto Next.js 15 com App Router, TypeScript, sem Tailwind, com src/ e
import alias "@/*". Instale @neondatabase/serverless, web-push e @types/web-push.
Escreva o .env.example com todas as variáveis que o projeto vai precisar.

**Etapa 2 — banco**
Escreva db/schema.sql com todas as tabelas e as duas views de ranking descritas
no CLAUDE.md. Depois db/seed.sql com 12 versículos e 12 perguntas em Almeida 1911.
Me explique como rodar isso no SQL Editor do Neon.

**Etapa 3 — identidade e quiz**
src/lib (db, tipos, pontos, sessao), a rota /api/usuario com cookie httpOnly, e as
rotas /api/quiz/perguntas e /api/quiz/responder.
Confirme para mim, por escrito, que o campo `correta` não aparece em nenhuma
resposta enviada ao navegador.

**Etapa 4 — telas**
globals.css com as variáveis de cor e as fontes, layout, página inicial, a tela do
quiz (uma pergunta por vez, alternativa fica verde ou vermelha ao clicar, explicação
e versículo aparecem embaixo) e a tela final com botão de compartilhar.

**Etapa 5 — ranking**
/ranking com abas "Esta semana" e "Desde o começo", destacando a linha da própria
pessoa. Cache de 60 segundos para não bater no Neon a cada visita.

**Etapa 6 — mensagens push**
public/sw.js, public/manifest.json, o componente de ativação (com o aviso do iPhone)
e a rota /api/cron/disparar. Apague a inscrição quando o push voltar 404 ou 410.

**Etapa 7 — agendador**
.github/workflows/mensagens.yml rodando de hora em hora, chamando a rota de disparo
com o CRON_SECRET. Me diga exatamente quais secrets criar no GitHub e quais variáveis
criar na Vercel.

**Etapa 8 — README**
Passo a passo do deploy: Neon, Vercel, chaves VAPID, secrets do GitHub e o empacotamento
com Bubblewrap para a Play Store.

Comece pela etapa 1.
