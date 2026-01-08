const CACHE_NAME = 'pulapocket-v3';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/types.ts',
  '/constants.ts',
  '/hooks/useTheme.tsx',
  '/components/Branding.tsx',
  '/components/GlassCard.tsx',
  '/components/OfflineIndicator.tsx',
  '/components/ThemeSwitcher.tsx',
  '/App.tsx',
  '/pages/Dashboard.tsx',
  '/pages/TransactionDesk.tsx',
  '/pages/Savings.tsx',
  '/pages/Forex.tsx',
  '/pages/Settings.tsx',
  '/icon.svg',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap',
  'https://esm.sh/react@^19.2.3',
  'https://esm.sh/react-dom@^19.2.3/',
  'https://esm.sh/lucide-react@^0.562.0',
  'https://esm.sh/recharts@^3.6.0'
];

// Install the service worker and cache the app shell
self.addEventListener('install', event => {
  self.skipWaiting(); // Force new SW to activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache, fetch from network and cache for next time
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            if (!response || response.status !== 200) {
              return response;
            }
            // Also ignore chrome-extension requests or non-http
            if (!event.request.url.startsWith('http')) {
                return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(() => {
          // Fallback logic if needed, but cache-first covers most
        });
      })
  );
});

// Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    Promise.all([
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                if (cacheWhitelist.indexOf(cacheName) === -1) {
                    console.log('Deleting old cache:', cacheName);
                    return caches.delete(cacheName);
                }
                })
            );
        }),
        self.clients.claim() // Take control of all clients immediately
    ])
  );
});