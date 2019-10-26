//Server
const express = require('express');
const server = express();
const Knex = require('knex');

//Express Middlewares
const session = require('express-session');
const fileUpload = require('express-fileupload');
const userAgent = require("express-ua-middleware");
const KnexSessionStore = require('connect-session-knex')(session);

//APIS
const fetch = require("isomorphic-fetch");
const Router = require("./lib/router");

//Native Modules
const {existsSync, mkdirSync, readFile} = require("fs");
const {join} = require("path");

const dev = process.env.NODE_ENV !== 'production';

const DB = require("./lib/DB");
const PostsManager = require("./lib/PostsManager");

const PORT = process.env.PORT || 3000;

const db = new DB(dev);
const posts = new PostsManager(db);
const router = new Router(db);

var sess = {
  	secret: 'keyboard cat',
  	resave: false,
  	saveUninitialized: true,
	cookie: {}
}

if (!dev) {
	sess.store = new KnexSessionStore({
	    knex: db.db
	});
	server.set('trust proxy', 1) // trust first proxy
	sess.cookie.secure = true
}

server
	.use(express.json())
	.use(express.urlencoded({extended: true}))
	.use(session(sess))
	.use(fileUpload())
	.use(userAgent)
	.use(express.static(join(__dirname, "static")))


async function Init() {
	try {
		console.log("Initializing...")
		await db.init();
		console.log("Initialized")

		server
		.get("/", (req, res) => {
			res.sendFile(join(__dirname, "image.html"));
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
				const {page, url, referer, userAgent, fields} = req.query;
				var data;
				if (action === "all")
					data = await posts.all(page);

				else if (action === "all-edit")
					data = await posts.allEdit();

				else if (action === "single")
					data = await posts.single(url);

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
						data = {
							...data,
							posts: data.posts.map(e => parse(e))
						};

					else
						data = parse(data)
					
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
				console.error(err)
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
		.get("/set-view", async (req, res) => {
			try {
				const {url, referer} = req.query;

				await posts.setView(url, "https://www.google.com", req.userAgent);

				res.send("success");
			} catch(err) {
				if (err === "dont-exists")
					res.status(404).send(err);
				else
					res.status(500).send(err);
			}
		})
		.post("/import-posts", async (req, res) => {
			if (!req.headers["auth"] === "C@mila") {
				res.status(401).send("no-auth");
			}
			else {
				try {
					await db.importPostsFromJson(JSON.parse(req.body.data));
					res.send("success");
				} catch(err) {
					console.log(err);
					res.status(500).send(err);
				}
			}
		})
		.post("/test-json", (req, res) => {
			console.log(req.body);
			res.send()
		})
		.get("/admin", (req, res) => {
			res.sendFile(join(__dirname, "comment.html"))
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