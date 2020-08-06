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
