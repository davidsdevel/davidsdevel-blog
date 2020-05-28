const router = require("express").Router();
const url = require("url");
const Jimp = require('jimp');
const qs = require("qs");
const fetch = require("isomorphic-fetch");
const {readFileSync} = require("fs");

router
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
	.get("/logout", (req, res) => {
		if (!req.session.adminAuth)
			res.sendStatus(404);
		else {
			req.session.adminAuth = false;

			res.send("success");
		}

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
	.get("/resize-image", async (req, res) => {
		try {
			const {url, width, height} = req.query;

			const urlSplitted = url.split(".");
			const mime = urlSplitted[urlSplitted.length - 1];
			res.type(mime);

			const image = await Jimp.read(url.startsWith("/") ? "http://localhost:3000" + url : url);

			image.resize(width ? width * 1 : Jimp.AUTO, height ? height * 1 : Jimp.AUTO).getBuffer(Jimp.AUTO, (err, buffer) => {
				if (err) {
					console.error(err);
					res.status(500).send(err.toString());
				} else {
					res.send(buffer);
				}
			});
		} catch (err) {
			console.error(err);
			res.status(500).send(err.toString());
		}
	})
	.get("/preview/:secret/:ID", async (req, res) => {
		const {ID} = req.params;
		const data = await req.db.getPostByID(ID);

		var template = readFileSync("./templates/previewPost").toString();

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
	});

module.exports = router;
