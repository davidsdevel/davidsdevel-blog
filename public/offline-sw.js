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

self.addEventListener("install", function (e) {
    e.waitUntil(
        caches.open("offline-app").then(function (cache) {
            cache.addAll(urls);
        })
    );
});

self.addEventListener('fetch', function(event) {
	if (self.navigator.onLine) {
		return;
	}
	
	var url = event.request.url.replace(/https?:\/\/(\w*\.)?\w*(\.\w\w*)?(:\d*)?/, "");

	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
	);
});
