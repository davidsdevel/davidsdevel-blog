//Server
const express = require('express');
const server = express();
const next = require('next');

//Express Middlewares
const session = require('express-session');
const fileUpload = require('express-fileupload');
const userAgent = require("express-ua-middleware");

//APIS
const fetch = require("isomorphic-fetch");
const Router = require("./lib/router");

//Native Modules
const {existsSync, mkdirSync} = require("fs");
const {join} = require("path");

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const DB = dev ? require("./lib/TestDB") : require("./lib/DB");
const PostsManager = require("./lib/PostsManager");

const PORT = process.env.PORT || 3000;

var sess = {
	store: new (require('connect-pg-simple')(session))(),
  	secret: 'keyboard cat',
  	resave: false,
  	saveUninitialized: true,
	cookie: {
		maxAge: 3600000 * (24 * 365)
	}
}

if (!dev) {
	server.set('trust proxy', 1) // trust first proxy
	sess.cookie.secure = true;
}
const db = new DB(process.env.DATABASE_URL);
const posts = new PostsManager(db);
const router = new Router(db);

server
	.use(express.urlencoded())
	.use(session(sess))
	.use(fileUpload())
	.use(userAgent)

async function Init() {
	try {
		console.log("Preparing...");
		await app.prepare();
		await db.init();
		console.log("Prepared");

		server
		/*-------FILES----------*/
		.get("/manifest.json", (req, res) => {
			res.json({
				gcm_sender_id: "103953800507",
				theme_color: "#fff"
			})
		})
		.get("/sitemap.xml", (req, res) => router.sitemap({req, res}))
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
		.get("/feed", (req, res) => router.feed({req, res}))

		/*----------API----------*/
		.post("/admin-login", (req, res) => {
			const {username, password} = req.body;
			if (username === "davidsdevel" && password == 1234)
				req.session.adminAuth = true;

			res.redirect(302, "/admin");
		})
		.get("/posts/:action", async (req, res) => {
			try {
				const {action} = req.params;
				const {page, url, referer, userAgent, fields} = req.query;
				var data;
				if (action === "all")
					data = await posts.all(page);

				else if (action === "all-edit")
					data = await posts.allEdit();

				else if (action === "single")
					data = await posts.single(url, referer, req.userAgentFromString(userAgent));

				else if(action === "single-edit")
					data = await posts.singleEdit(url);

				else if (action === "find") {
					//TODO
				}
				if (fields) {
					const parse = postData => {
						var newData = {};
						const parsedFields = fields.split(",");
						Object.entries(postData).forEach(e => {
							for (let i = 0; i < parsedFields.length; i++) {
								if (e[0] === parsedFields[i]) {
									newData[e[0]] = e[1];
								}
							}
						});
						return newData;
					}
					if (action === "all-edit" ||
						action === "all" ||
						action === "find" ||
						action === "category" ||
						action === "category-edit"
					)
						data = data.map(e => parse(e));

					else
						data = parse(data);
					
				}
				res.json(data);
			} catch(err) {
				console.error(err);
				if (err === "dont-exists")
					res.status(404).send(err);
				else
					res.status(500).send(err);
			}
		})
		.post("/manage-post/:action", async (req, res) => {
			try {
				const {action} = req.params;
				var id;
				if (action === "publish") {
					id = await db.publishPost(req.body);
				} else if (action === "save") {
					id = await db.savePost(req.body);
				}

				res.status(200).send(id.toString());
			} catch(err) {
				console.log(err)
				res.status(500).send(err);
			}
		})
		.get("/:type/:secret/:name", async (req, res, next) => {
			try {
				const {type, secret, name} = req.params;

				if (!/^\d\d\d\d\d\d\d\d\d\d$/.test(secret)) return next();
				const file = await db.getFile(type, secret, name);

				res.set({
					"Content-Type": file.mime
				});
				res.send(file.buffer);
			} catch(err) {
				if (err === "dont-exists")
					res.status(404).send(err);
				else
					res.status(500).send(err);
			}
		})
		.post('/upload/:type', (req,res) => {
			const {file} = req.files;
			const {name, mime} = req.body;
			const {type} = req.params;

			var path = join(__dirname, "files");
			if (!existsSync(path))
				mkdirSync(path);

			const filepath = join(path, name);
			file.mv(filepath, async () => {
				try{
					const data = await db.uploadFile(type, name, mime, filepath);
					res.json(data);
				} catch(err) {
					console.log(err);
					res.status(500).json({
						status:err
					});
				}
			});
		})
		.get("/fcm/:action", async (req, res) => {
			try {

				const {action} = req.params;

				if (action === "add-token") {
					await db.addFCMToken(req.query.token);
				}
			} catch(err) {
				console.error(err);
				res.status(500).send(err);
			}
		})
		.get("/firebase-messaging-sw.js", (req, res) => {
			res.sendFile(join(__dirname, "fcm-sw.js"));
		})
		.get("*", (req, res) => handle(req, res))
		.listen(PORT, err => {
			if (err) throw new Error(err);
			console.log(`> App Listen on Port: ${PORT}`);
		});

	} catch(err) {
		throw new Error(err);
	}
}

Init();

/*
fetch("https://fcm.googleapis.com/fcm/send", {
	method: "POST",
	headers: {
		Authorization: "key=AAAAJv0rZbw:APA91bGnaLO5-hPfN45LNH1xhvwUbjHHinhk-N4nA4jf1ylEyBNmvEiv2m9XAfok52CFTeKgQ7B5yC30MT8IjHtsbhfKDqZ7fcbj7MlVKZfJkafvh2pa3vuHaCHLWhaf62NW3dTfQ-R6",
		"Content-Type": "application/json"
	},
	body: JSON.stringify({
		notification: {
			title: "Portugal vs. Denmark",
			body: "5 to 1",
			icon: "/static/images/davidsdevel-black.png",
			click_action: "http://localhost:8081"
		},
		to: "YOUR-IID-TOKEN"
	})
})

POST /fcm/send HTTP/1.1
Host: fcm.googleapis.com
Authorization: key=AAAAJv0rZbw:APA91bGnaLO5-hPfN45LNH1xhvwUbjHHinhk-N4nA4jf1ylEyBNmvEiv2m9XAfok52CFTeKgQ7B5yC30MT8IjHtsbhfKDqZ7fcbj7MlVKZfJkafvh2pa3vuHaCHLWhaf62NW3dTfQ-R6
Content-Type: application/json

{
  "notification": {
    "title": "Portugal vs. Denmark",
    "body": "5 to 1",
    "icon": "firebase-logo.png",
    "click_action": "http://localhost:8081"
  },
  "to": "YOUR-IID-TOKEN"
}

Par de claves FCM: BALgWQbVzq62qWHC0CCmJqV7sPgljfaoT0NaYNKV3kHF48ZVLPRAQb-aTquSbCtAuqgPBf4w2SUsrE7FY2ILefY

manifest.json: {
  "gcm_sender_id": "103953800507"
}
*/