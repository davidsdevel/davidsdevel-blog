const urls = [
  "/",
  "/fonts/Roboto.ttf",
  "/images/connection.png",
  "/images/davidsdevel-black.png",
  "/images/davidsdevel-rombo.png",
  "/images/landing-desktop-960p.jpg",
  "/images/landing-desktop.jpg",
  "/images/landing-mobile-480p.jpg",
  "/images/landing-mobile.jpg",
  "/images/landing.jpg",
  "/images/me.jpg",
  "/images/og.jpg",
  "/images/payoneer.png",
  "/images/platzi.png",
  "/images/privacidad.jpg",
  "/assets/arrow-white.svg",
  "/assets/arrow.svg",
  "/assets/bubbles.svg",
  "/assets/cross.svg",
  "/assets/eye.svg",
  "/assets/facebook.svg",
  "/assets/instagram.svg",
  "/assets/linkedin.svg",
  "/assets/menu.svg",
  "/assets/search.svg",
  "/assets/spinner.svg",
  "/assets/twitter.svg"
];

self.addEventListener("install", async ({waitUntil}) => {
  try {
    const cache = caches.open("offline-app");

    const toWait = cache.addAll(urls);

    waitUntil(toWait);

  } catch(err) {
    console.error(err);
  }
});

self.addEventListener('fetch', async ({request, respondWith}) => {
  try {
    if (self.navigator.onLine) {
      return;
    }
    const response = await caches.match(request);

    respondWith(response || fetch(request));
  } catch(err) {
    console.error(err);
  }
});

self.addEventListener("activate", async ({waitUntil}) => {

    const keyList = await caches.keys();

    const promises = keyList.map((key) => key !== "offline-app"  ? cache.delete(key) : null);

    waitUntil(Promise.all(promises));
})

/*
// CODELAB: Add fetch event handler here.
if (evt.request.mode !== 'navigate') {
  // Not a page navigation, bail.
  return;
}
evt.respondWith(
    fetch(evt.request)
        .catch(() => {
          return caches.open(CACHE_NAME)
              .then((cache) => {
                return cache.match('offline.html');
              });
        })
);
*/




/*
// CODELAB: Add fetch event handler here.
if (evt.request.url.includes('/forecast/')) {
  console.log('[Service Worker] Fetch (data)', evt.request.url);
  evt.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(evt.request)
            .then((response) => {
              // If the response was good, clone it and store it in the cache.
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }
              return response;
            }).catch((err) => {
              // Network request failed, try to get it from the cache.
              return cache.match(evt.request);
            });
      }));
  return;
}
evt.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(evt.request)
          .then((response) => {
            return response || fetch(evt.request);
          });
    })
);
*/