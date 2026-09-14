# Semeia

Versículos ao longo do dia + quiz bíblico com ranking público.
Next.js (App Router, TypeScript) · Neon · Vercel · Web Push · GitHub Actions.

---

## 1. Criar o projeto

```bash
npx create-next-app@latest semeia --ts --app --no-tailwind --src-dir --import-alias "@/*"
cd semeia
npm i @neondatabase/serverless web-push
npm i -D @types/web-push
```

Depois copie os arquivos desta pasta por cima, mantendo a estrutura.

## 2. Banco (Neon)

1. Crie um projeto no Neon, região **São Paulo (sa-east-1)**.
2. SQL Editor → cole e rode `db/schema.sql`.
3. Rode `db/seed.sql` para ter conteúdo inicial.
4. Copie a connection string **pooled** (termina em `-pooler`) para `DATABASE_URL`.

## 3. Chaves de notificação

```bash
npx web-push generate-vapid-keys
```

Guarde a pública em `NEXT_PUBLIC_VAPID_PUBLIC_KEY` e a privada em `VAPID_PRIVATE_KEY`.
Elas são um par: se trocar depois, todo mundo precisa ativar de novo.

## 4. Vercel

Importe o repositório do GitHub. Em Settings → Environment Variables, cole tudo
o que está em `.env.example`, já preenchido.

## 5. O disparo das mensagens

O Vercel Hobby só deixa rodar cron **1× por dia**, e você quer 3. Por isso o
agendador vive no GitHub Actions (`.github/workflows/mensagens.yml`), que roda
de hora em hora e chama `/api/cron/disparar`.

No GitHub → Settings → Secrets and variables → Actions, crie:

| Secret        | Valor                              |
|---------------|------------------------------------|
| `SITE_URL`    | `https://seudominio.com.br`        |
| `CRON_SECRET` | o mesmo valor que está na Vercel   |

Para testar sem esperar: aba Actions → *Mensagens diarias* → **Run workflow**.

> O GitHub pode atrasar o agendamento em alguns minutos quando está
> congestionado. Para versículo diário isso não faz diferença.

## 6. Play Store

O app é um PWA. Para empacotar sem escrever React Native:

```bash
npm i -g @bubblewrap/cli
bubblewrap init --manifest https://seudominio.com.br/manifest.json
bubblewrap build
```

Sai um `.aab` para subir no Play Console (US$ 25, pagamento único).
Você precisa do arquivo `assetlinks.json` no domínio para o app abrir sem a
barra do navegador — o Bubblewrap gera e explica onde colocar.

---

## Decisões que não são óbvias

**A resposta certa nunca sai do servidor.** `/api/quiz/perguntas` devolve só
enunciado e alternativas. A correção acontece em `/api/quiz/responder`. Sem
isso, qualquer pessoa abre o DevTools e gabarita o ranking.

**Uma tentativa por pergunta.** O `unique (usuario_id, pergunta_id)` na tabela
`respostas` é o que impede alguém de responder a mesma questão cem vezes. A
trava está no banco, não no JavaScript — não dá para burlar nem com requisição
manual.

**Ranking semanal é o padrão.** O ranking geral congela: quem chegou primeiro
fica inalcançável e o novato desiste. A semana zera na segunda, fuso de
São Paulo, e o Postgres resolve o horário de verão sozinho.

**Participar do ranking é opt-in.** Convicção religiosa é dado sensível na
LGPD. Ninguém entra numa lista pública sem marcar a caixinha, e o que aparece é
um apelido escolhido pela pessoa.

**Bíblia em domínio público.** NVI, ARA, ACF e NVT são protegidas por direito
autoral e cobram licença. Este projeto usa Almeida 1911, livre. A versão
aparece no rodapé de cada mensagem.

**iPhone só recebe notificação se o app estiver na tela de início.** Limitação
da Apple, sem contorno. A tela de ativação já explica isso para o usuário.

---

## Custo

| Item | Preço |
|---|---|
| Vercel Hobby, Neon free, GitHub Actions, Web Push | R$ 0 |
| Domínio `.com.br` | ~R$ 40/ano |
| Conta Google Play | US$ 25, uma vez |

Atenção: o plano Hobby da Vercel proíbe uso comercial. No dia que ligar o
Stripe, migre para o Pro (US$ 20/mês).

## Próximos passos sugeridos

1. Chegar a 150 perguntas antes de divulgar. Com 12, a pessoa termina em dois
   minutos e não volta.
2. Imagem de Open Graph dinâmica (`@vercel/og`) com o versículo, para o link
   ficar bonito quando alguém compartilhar.
3. Card de resultado em imagem, para postar no story.
4. Migrar de cookie para Auth.js quando quiser que a pontuação acompanhe a
   pessoa entre celular e computador.
