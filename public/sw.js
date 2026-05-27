// Service Worker da Mudinha — recebe push e mostra notificação
// Quando o backend manda um push pro endpoint da pessoa, esse SW pega aqui.

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { title: "Mudinha", body: event.data ? event.data.text() : "" };
  }

  const title = payload.title || "🌿 Mudinha";
  const options = {
    body: payload.body || "sua mudinha tá com sede",
    icon: "/icon.svg",
    badge: "/icon.svg",
    tag: payload.tag || "mudinha-lembrete",
    data: { url: payload.url || "/jardim" },
    vibrate: [100, 50, 100],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/jardim";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});
