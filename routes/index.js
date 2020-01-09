const router = require("express").Router();
const {existsSync, mkdirSync, readFileSync, unlinkSync} = require("fs");
const {join} = require("path");
const url = require("url");
const qs = require("qs");
var Jimp = require('jimp');
const fetch = require("isomorphic-fetch");

//FILES
router
	.get("/manifest.json", (req, res) => res.json({
			gcm_sender_id: "103953800507",
			theme_color: "#fff"
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
					res.status(404).send(err);
				else
					res.status(500).send(err);
			}
		});

//API
router
	.get("/preview/:secret/:ID", async (req, res) => {
		const {ID} = req.params;
		const data = await req.db.getPostByID(ID);

		var template = readFileSync("./previewTemplate.html").toString();

		var tags = "";

		data.tags.split(/\,\s*/).forEach(e => (tags += `<li class="jsx-3065913865 jsx-552310415"><a class="jsx-3065913865 jsx-552310415" href="/search?q=${e}">${e}</a></li>`))

		template = template
			.replace(/\%TITLE\%/g, data.title)
			.replace(/\%DESCRIPTION\%/g, data.description)
			.replace(/\%URL\%/g, data.url)
			.replace(/\%IMAGE\%/g, data.image)
			.replace(/\%CONTENT\%/g, data.content)
			.replace(/%TAGS%/g, tags);

			res.send(template);
	})
	.post("/admin-login", (req, res) => {
		const {username, password} = req.body;

		if (username === "davidsdevel" && password == 1234) {
			req.session.adminAuth = true;
				
			res.json({
				status: "OK"
			});
		} else
			res.json({
				status: "Error",
				message: "Usuario o contraseña incorrectos"
			});
	})
	.post('/fb-webhook', (req, res) => {  

		let body = req.body;
		// Checks this is an event from a page subscription
		if (body.object === 'application') {
		
			// Iterates over each entry - there may be multiple if batched
			body.entry.forEach(async entry => {
				let commentId = entry.changes[0].value.id;
				try {
					const fetchToken = await fetch(`https://graph.facebook.com/oauth/access_token?client_id=${fbClientID}&client_secret=${fbClientSecret}&grant_type=client_credentials`);
					const tokenData = await fetchToken.json();

					const fetchUrl = await fetch(`https://graph.facebook.com/${commentId}?fields=permalink_url&access_token=${tokenData['access_token']}`);
					const linkData = await fetchUrl.json();
					const {permalink_url} = linkData;

					console.log(permalink_url);

					const urlQuery = url.parse(permalink_url);
					const parsedQuery = qs.parse(urlQuery);
					const postPath = /development|design|marketing|technology|others\/(\w*-)*\w(?=\?)/.exec(parsedQuery.u)[0];

					await req.db.setComment(postPath);
				} catch(err) {
					console.error(err);
					res.sendStatus(500);
				}

				// Gets the message. entry.messaging is an array, but
			});
			// Returns a '200 OK' response to all requests
			res.status(200).send('EVENT_RECEIVED');
		} else {
			// Returns a '404 Not Found' if event is not from a page subscription
			res.sendStatus(404);
		}
	})
	.get('/fb-webhook', (req, res) => {

		// Your verify token. Should be a random string.
		let VERIFY_TOKEN = "C@mila";
			
		// Parse the query params
		let mode = req.query['hub.mode'];
		let token = req.query['hub.verify_token'];
		let challenge = req.query['hub.challenge'];
			
		// Checks if a token and mode is in the query string of the request
		if (mode && token) {
			// Checks the mode and token sent is correct
			if (mode === 'subscribe' && token === VERIFY_TOKEN) {
				// Responds with the challenge token from the request
				console.log('WEBHOOK_VERIFIED');
				res.status(200).send(challenge);
			
			} else {
				// Responds with '403 Forbidden' if verify tokens do not match
				res.sendStatus(403);      
			}
		}
	})
	.post('/upload/:type', (req,res) => {
		const {file} = req.files;
		const {name, mime, width} = req.body;
		const {type} = req.params;

		var path = join(__dirname, "files");
		if (!existsSync(path))
			mkdirSync(path);

		const filepath = join(path, name);
		file.mv(filepath, async () => {
			try{
				const data = await req.db.uploadFile(type, name, mime, filepath, width);

				unlinkSync(filepath);

				res.json(data);
			} catch(err) {
				console.error(err);
				res.status(500).json({
					status:err
				});
			}
		});
	})
	.delete("/action-images/delete", async (req, res) => {
		try {
			const {name, secret} = req.body;

			const data = await req.db.deleteImage(name, secret);

			res.json(data);
		} catch(err) {
			console.error(err);
			res.status(500).send(err.toString());
		}
	})
	.get("/data/:type", async (req, res) => {
		try {
			const {type} = req.params;

			switch(type) {
			case "images":
				res.json(await req.db.getImages());
				break;
			case "stats":
				res.json(await req.db.getStats());
				break;
			default:
				res.sendStatus(404);
				break;
			}
		} catch(err) {
			res.status(500).send(err.toString());
		}
	});


module.exports = router;
