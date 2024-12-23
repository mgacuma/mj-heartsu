self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Add custom fetch handling here if needed
});

self.addEventListener("push", (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "/mj-heartsu/ggbr-favicon.jpeg",
    badge: "/mj-heartsu/ggbr-favicon.jpeg",
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});
