# Se você já baixou o semeia-app.zip

Descompacte na pasta do projeto e cole isto no Claude Code:

---

Leia o CLAUDE.md e depois o README.md deste projeto. O esqueleto já está escrito:
schema, seed, rotas de API, telas de quiz e ranking, service worker e workflow do
GitHub Actions.

Antes de tudo, faça uma revisão e me diga o que encontrar:

1. Rode `npm install` e `npx tsc --noEmit` e corrija os erros de tipo que aparecerem.
2. Confirme que `correta` e `explicacao` não vazam em /api/quiz/perguntas.
3. Confirme que a view ranking_semana calcula a virada da semana no fuso de
   São Paulo, e não em UTC.
4. Aponte qualquer lugar onde falte tratamento de erro nas chamadas fetch do cliente.

Não mude nada além disso ainda. Me mostre a lista primeiro.
