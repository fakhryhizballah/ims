// service-worker.js
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('app-cache')
            .then((cache) => {
                return cache.addAll([
                    '/favicon.ico',
                    '/assets/img/android-launchericon-192x192.png',
                    '/assets/img/android-launchericon-512x512.png',
                    '/assets/img/256.png',
                ]);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});