const CACHE_NAME = 'my-app-cache-v1';  // Название кеша, можно поменять при обновлениях

// Список файлов для кеширования
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/illustration.webp', 
  '/manifest.json',
  // '/icon-192x192.webp',
  // '/icon-512x512.webp',
  // '/favicon.png',
  '/sw.js',
  '/lock.webp',
  '/lamp.webp'// Важно: путь к видео — укажите относительный или абсолютный корректно!
  // Добавьте сюда остальные необходимые ресурсы, которые хотите кешировать
];

// Установка сервис-воркера — кешируем нужные файлы
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Активация — очистка старых кешей (опционально)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Перехват запросов — отдаём из кеша, если есть, иначе из сети (Fallback)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
