/* Yoga Esenio — Service Worker
 * Generado por build.mjs (no editar dist/sw.js a mano).
 *
 *  - La "cáscara" de la app (HTML, íconos, tipografías locales) se guarda
 *    completa al instalar → la app abre sin conexión desde la primera vez.
 *  - Las imágenes de Blogger se guardan al verlas (o con el botón
 *    "Descargar para uso sin conexión" dentro de la app).
 */
const VERSION = '14a2ad793c';
const STATIC_CACHE = 'yoga-esenio-static-' + VERSION;
const IMAGE_CACHE = 'yoga-esenio-img-v1'; // persiste entre versiones
const PRECACHE = [
  "./",
  "./favicon.ico",
  "./fonts/lato-bold.woff",
  "./fonts/lato-normal-italic.woff",
  "./fonts/lato-normal.woff",
  "./fonts/titulos-caps.woff",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
  "./icons/favicon-48.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png",
  "./index.html",
  "./manifest.webmanifest"
];
const INDEX_URL = new URL('./index.html', self.registration.scope).href;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) =>
        cache.addAll(PRECACHE.map((u) => new Request(u, { cache: 'reload' })))
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith('yoga-esenio-static-') && k !== STATIC_CACHE)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // 1) Navegación (abrir la app): red primero (4 s) y, si falla, caché.
  if (req.mode === 'navigate') {
    event.respondWith(handleNavigate(req));
    return;
  }

  // 2) Archivos propios de la app: caché primero.
  if (url.origin === self.location.origin) {
    event.respondWith(handleStatic(req));
    return;
  }

  // 3) Imágenes de Blogger / Google: caché primero.
  if (url.hostname.endsWith('googleusercontent.com')) {
    event.respondWith(handleImage(req));
    return;
  }

  // Todo lo demás (YouTube, OneDrive, etc.) va directo a la red.
});

async function handleNavigate(req) {
  const cache = await caches.open(STATIC_CACHE);
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(req, { signal: ctrl.signal });
    clearTimeout(timer);
    if (res.type === 'opaqueredirect') return res;
    if (res.ok) {
      cache.put(INDEX_URL, res.clone());
      return res;
    }
    return (await cache.match(INDEX_URL)) || res;
  } catch {
    return (await cache.match(INDEX_URL)) || Response.error();
  }
}

async function handleStatic(req) {
  const cache = await caches.open(STATIC_CACHE);
  const hit = await cache.match(req, { ignoreSearch: true });
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    return Response.error();
  }
}

async function handleImage(req) {
  const cache = await caches.open(IMAGE_CACHE);
  const hit = await cache.match(req.url);
  if (hit) return hit;
  try {
    let res;
    try {
      // Preferimos una respuesta "cors" (se puede medir y ocupa menos cuota).
      res = await fetch(req.url, { mode: 'cors', credentials: 'omit' });
      if (!res.ok) throw new Error('bad status');
    } catch {
      res = await fetch(req); // respaldo: petición original (opaca)
    }
    if (res && (res.ok || res.type === 'opaque')) cache.put(req.url, res.clone());
    return res;
  } catch {
    return Response.error();
  }
}
