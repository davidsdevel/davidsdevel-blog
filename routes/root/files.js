const router = require("express").Router();

router
	.get("/manifest.json", (req, res) => res.json({
		start_url: "http://localhost:3000",
		description: "JavaScript, tecnología, informática y mas JavaScript en este blog. Un simple blog de un desarrollador JavaScript Venezolano.",
		icons: [{"src":"/touch-icon.png","sizes":"192x192","type":"image/png"}],
		name: "David's Devel - Blog",
		short_name: "David's Devel",
		orientation: "portrait",
		display: "fullscreen",
		gcm_sender_id: "103953800507",
		theme_color: "#fff",
		background_color:"#fff"
	}))
	.get("/sitemap.xml", (req, res) => req.router.sitemap({req, res}))
	.get("/robots.txt", (req, res) => {
		res.set({
			"Content-Type": "text/plain"
		});
		const robot = `User-agent: *
			Disallow: /privacidad
			Disallow: /terminos
			Disallow: /search
			Disallow: /feed
			Allow: /
				
			Sitemap: https://blog.davidsdevel.com/sitemap.xml`;

		res.send(robot.replace(/\t/g, ""));
	})
	.get("/feed", (req, res) => req.router.feed({req, res}))
	.get("/firebase-messaging-sw.js", (req, res) => res.sendFile(join(__dirname, "..", "fcm-sw.js")))
	.get("/:type/:secret/:name", async (req, res, next) => {
		try {
			const {type, secret, name} = req.params;

			if (!/^\d\d\d\d\d\d\d\d\d\d$/.test(secret))
				return next();
				
			const {width} = req.query;

			var file = await req.db.getFile(secret, name);

			if (width) {

				let image = await Jimp.read(file.buffer);

				image.resize(width * 1, Jimp.AUTO).getBuffer(Jimp.AUTO, (err, buffer) => {
					if (err) {
						console.error(err);
						res.status(500).send(err.toString());
					} else {
						res.set({
							"Content-Type": file.mime
						});

						res.send(buffer);
					}
				});
			} else {
				res.set({
					"Content-Type": file.mime
				});

				res.send(file.buffer);
			}
		} catch(err) {
			console.log(err);
			if (err === "dont-exists")
				res.status(404).send(err.toString());
			else
				res.status(500).send(err.toString());
		}
	});

module.exports = router;
