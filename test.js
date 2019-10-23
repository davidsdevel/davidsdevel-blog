//Server
const express = require('express');
const server = express();

//Express Middlewares
const session = require('express-session');
const fileUpload = require('express-fileupload');
const userAgent = require("express-ua-middleware");

//APIS
const fetch = require("isomorphic-fetch");
const router = require("./lib/router");

//Native Modules
const {existsSync, mkdirSync} = require("fs");
const {join} = require("path");

const dev = process.env.NODE_ENV !== 'production';

const DB = require("./lib/TestDB");
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

const db = new DB();
const posts = new PostsManager(db);
server
	.use(express.urlencoded())
	.use(session(sess))
	.use(fileUpload(sess))
	.use(userAgent)
	.use(express.static(join(__dirname, "static")))


async function Init() {
	try {
		await db.init(dev);

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
							console.log(e)
						});
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
				console.log(req.body);
				const {action} = req.params;
				var id;
				if (action === "publish") {
					id = await db.publishPost(req.body);
				} else if (action === "save") {
					id = await db.savePost(req.body);
				}

				res.status(200).send(id);
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
		.get("/admin", (req, res) => {
			res.sendFile(join(__dirname, "editor.html"))
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