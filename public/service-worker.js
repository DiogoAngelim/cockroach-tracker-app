self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('roach-monitor-cache-v1').then(cache => {
      return cache.addAll([
        '/',
        '/icon-light-32x32.png',
        '/icon-dark-32x32.png',
        '/icon.svg',
        '/apple-icon.png',
        // Add more assets as needed
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
