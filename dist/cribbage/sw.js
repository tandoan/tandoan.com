const cacheName = 'cribbageBoard-v2'
const addResourcesToCache = async (resources) => {
    const cache = await caches.open(cacheName);
    await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
    event.waitUntil(
        addResourcesToCache([
            "/cribbage/",
            "/cribbage/index.html",
            "/cribbage/assets/cribbage_board.js",
            "/cribbage/assets/cribbage_board.min.css",
            "/cribbage/assets/main.min.css",
            "/cribbage/assets/img/board-bkg-classic.png",
            "/cribbage/assets/img/board-bkg-clear.png",
            "/cribbage/assets/img/classic.jpg",
            "/cribbage/assets/img/peg_shadow.png",
            "/cribbage/assets/img/skunk.svg",
            "/cribbage/assets/img/stinkline.svg",
            "/cribbage/assets/img/app-icon.png",
            "/cribbage/assets/img/app-icon512.png",
        ]),
    );
});


// Fetching content using Service Worker
self.addEventListener('fetch', (e) => {
    // Cache http and https only, skip unsupported chrome-extension:// and file://...
    if (!(
        e.request.url.startsWith('http:') || e.request.url.startsWith('https:')
    )) {
        return;
    }

    e.respondWith((async () => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) return r;
        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response;
    })());
});
