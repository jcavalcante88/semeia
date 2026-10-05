// Service worker: recebe a mensagem mesmo com o app fechado.
self.addEventListener("push", (evento) => {
  let dados = { titulo: "Semeia", corpo: "", url: "/" };
  try {
    dados = evento.data.json();
  } catch (_) {}

  evento.waitUntil(
    self.registration.showNotification(dados.titulo, {
      body: dados.corpo,
      icon: "/icone-192.png",
      badge: "/badge.png",
      tag: "versiculo",
      data: { url: dados.url },
    }),
  );
});

self.addEventListener("notificationclick", (evento) => {
  evento.notification.close();
  const destino = evento.notification.data?.url || "/";
  evento.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((abas) => {
      const aberta = abas.find((a) => a.url.includes(self.location.origin));
      if (aberta) return aberta.focus();
      return clients.openWindow(destino);
    }),
  );
});

/**
 * O navegador trocou o endereco da inscricao.
 *
 * Isto acontece sozinho: atualizacao do Chrome, limpeza de dados, aparelho
 * muito tempo sem abrir o app. Quando acontece, o endereco velho passa a
 * responder 410 e o servidor o apaga — e sem este trecho ninguem avisava o
 * novo, entao as mensagens paravam de chegar caladas.
 *
 * A chave VAPID vem da inscricao ANTIGA (`oldSubscription.options`), e nao
 * escrita aqui: o service worker nao enxerga as variaveis de ambiente do
 * Next, e chave colada a mao vira chave errada no dia em que ela mudar.
 *
 * Este evento nao e confiavel — o Firefox implementa, o Chrome quase nunca
 * dispara. Por isso ele e a SEGUNDA linha de defesa: a primeira e
 * ReinscreverPush.tsx, que confere em toda abertura do app.
 */
self.addEventListener("pushsubscriptionchange", (evento) => {
  evento.waitUntil(
    (async () => {
      try {
        const chave =
          evento.oldSubscription?.options?.applicationServerKey ??
          (await self.registration.pushManager.getSubscription())?.options
            ?.applicationServerKey;
        if (!chave) return;

        const nova =
          evento.newSubscription ??
          (await self.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: chave,
          }));

        await fetch("/api/push/inscrever", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nova.toJSON()),
        });
      } catch (_) {
        // Sem recado: nao ha tela para mostrar nada, o app esta fechado.
      }
    })(),
  );
});
