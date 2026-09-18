const CACHE = "ek-scout-v3";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const base = self.registration.scope;
      const urls = [base, new URL("index.html", base).href, new URL("manifest.json", base).href];
      await Promise.all(urls.map((url) => cache.add(url).catch(() => undefined)));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    (async () => {
      try {
        const fresh = await fetch(event.request);
        const cache = await caches.open(CACHE);
        void cache.put(event.request, fresh.clone());
        return fresh;
      } catch {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.mode === "navigate") {
          const fallback = await caches.match(new URL("index.html", self.registration.scope).href);
          if (fallback) return fallback;
        }
        throw new Error("offline");
      }
    })(),
  );
});
