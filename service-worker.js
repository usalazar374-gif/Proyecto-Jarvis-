const CACHE_NAME = 'ubh-cache-v1';
const ASSETS = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Solo cachea el propio app shell; todo lo demás (Wikipedia, clima, YouTube, etc.)
// siempre va directo a la red para no mostrar datos viejos.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if(url.origin !== self.location.origin){ return; }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
