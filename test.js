//Server
const express = require('express');
const server = express();

//Express Middlewares
const session = require('express-session');
const fileUpload = require('express-fileupload');

//APIS
const fetch = require("isomorphic-fetch");
const router = require("./lib/router");

//Native Modules
const {existsSync, mkdirSync} = require("fs");
const {join} = require("path");

const dev = process.env.NODE_ENV !== 'production';

const DB = dev ? require("./lib/TestDB") : require("./lib/DB");
const PostsManager = require("./lib/PostsManager");

const PORT = process.env.PORT || 3000;

var sess = {
  	secret: 'keyboard cat',
  	resave: false,
  	saveUninitialized: true,
	cookie: {}
}

if (!dev) {
	server.set('trust proxy', 1) // trust first proxy
	sess.cookie.secure = true
}

const deviceMiddleware = (req, res, next) => {
	const userAgent = req.headers["user-agent"];
	var os;
	if (/Windows NT/.test(userAgent))
		os = "Windows";
	else if (/Macintosh/.test(userAgent))
		os = "MacOS";
	else if (/iPhone/.test(userAgent))
		os = "iPhone";
	else if (/iPad/.test(userAgent))
		os = "iPad";
	else if (/Android/.test(userAgent))
		os = "Android";
	else if (/Linux/.test(userAgent))
		os = "Linux";
	else 
		os = "Unknown";


	var navigator;
	if (/Chrome/.test(userAgent))
		navigator = "Chrome";
	else if (/Firefox/.test(userAgent))
		navigator = "Firefox";
	else if (/rv:11|MSIE/.test(userAgent))
		navigator = "Internet Explorer";
	else if (/Opera/.test(userAgent))
		navigator = "Opera";
	else if (/KHTML,* Like Gecko.*Safari/i.test(userAgent))
		navigator = "Safari";
	else if (/Edge/.test(userAgent))
		navigator = "Edge";
	else 
		navigator = "Unknown";

	req.device = {
		os,
		navigator
	};

	next();
}

const db = new DB();
const posts = new PostsManager(db);
server
	.use(express.urlencoded())
	.use(session(sess))
	.use(fileUpload(sess))
	.use(deviceMiddleware)


async function Init() {
	try {
		await db.init(dev);

		server
		.get("/", (req, res) => {
			console.log(req.device);
			res.send("<div></div>");
		})
		.get("/sitemap", (req, res) => router.sitemap({req, res}))
		.get("/feed", (req, res) => router.feed({req, res}))

		/*----------API----------*/
		.post("/admin-login", (req, res) => {
			console.log(req.body)
			const {username, password} = req.body;
			if (username === "davidsdevel" && password == 1234) {
				req.session.adminAuth = true;
				res.redirect(302, "http://localhost:3000/admin");
			} else {
				res.redirect(302, "http://localhost:3000/admin");
			}
		})
		.get("/is-auth", (req, res) => {
			if (req.session) {
				if (req.session.adminAuth)
					res.send("auth");
				else
					res.send("no-auth");
			} else {
				res.status(403).send("bad-request")
			}
		})
		.get("/posts/:action", async (req, res) => {
			try {
				const {action} = req.params;
				const {page, url, referer, userAgent} = req.query;
				var data;
				if (action === "all")
					data = await posts.all(page);
				else if (action === "single")
					data = await posts.single(url, referer, userAgent);
				else if (action === "find") {
					//TODO
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
				console.log(req.body);
				const {action} = req.params;
				if (action === "publish") {
					await db.publishPost(req.body);
				}

				res.status(200).send("success");
			} catch(err) {
				res.status(500).send(err);
			}
		})
		.get("/:type/:secret/:name", async (req, res, next) => {
			try {
				const {type, secret, name} = req.params;

				if (!/^\d\d\d\d\d\d\d\d\d\d$/.test(secret)) return next();
				const file = await db.getFile(type, secret, name);

				console.log(file)
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
					const url = await db.uploadFile(type, name, mime, filepath);
					res.send(url);
				} catch(err) {
					console.log(err);
					res.status(500).json({
						status:err
					});
				}
			});
		})
		.listen(8080, err => {
			if (err) throw new Error(err);
			console.log(`> App Listen on Port: ${8080}`);
		});

	} catch(err) {
		throw new Error(err);
	}
}

Init();