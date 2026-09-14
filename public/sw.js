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
