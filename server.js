//Server
const express = require('express');
const server = express();
const next = require('next');
const Knex = require('knex');

//Express Middlewares
const session = require('express-session');
const fileUpload = require('express-fileupload');
const userAgent = require("express-ua-middleware");
const KnexSessionStore = require('connect-session-knex')(session);
const {renderPost} = require('./middlewares/posts');

//APIS
const Router = require("./lib/router");
const DB = require("./lib/server/Database");
const PostsManager = require("./lib/PostsManager");

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

const db = new DB(dev);
const posts = new PostsManager(db);
const router = new Router(db);

const fbClientID = "337231497026333";
const fbClientSecret = "d381bb7dcf6bd6c6adb0806985de7d49";

var sess = {
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 3600000 * 24 
	},
	store: new KnexSessionStore({
		knex: db.db
	})
}

if (!dev) {
	sess.cookie.secure = true;
	server.set('trust proxy', 1) // trust first proxy
}

server
	.use(express.json())
	.use(express.urlencoded({extended: true}))
	.use(fileUpload())
	.use(userAgent)
	.use(session(sess))
	.use((req, res, next) => {
		req.db = db;
		req.posts = posts;
		req.router = router;

		return next();
	});

var listen;
async function Init() {
	try {
		console.log("Preparing...");
		await app.prepare();
		await db.init();
		console.log("Prepared");

		server
			.use("/", require("./routes/root"))
			.use("/posts", require("./routes/posts"))
			.use("/users", require("./routes/users"))
			.use("/blog", require("./routes/blog"))

			.get("/:title", renderPost(app), (pass, req, res, next) => {
				if (pass) {
					req = err;
					res = pass;
				} else
					return next();

				if (req.urlID == 1)
					app.render(req, res, "/post", req.data);
				else
					app.render(req, res, "/404", {});
			})
			.get("/:category/:title", renderPost(app), async (req, res, next) => {
				try {
					const {category} = req.params;

					const categories = await req.db.getCategories();
					var sameCategory = false;

					for (var i = categories.length - 1; i >= 0; i--) {
						if (categories[i] == category) {
							sameCategory = true;
							break;
						}
					}
				} catch(err) {
					console.error(err);
					return res.status(500).send(err.toString());
				}

				if (!sameCategory)
					return next();

				if (req.urlID == 2)
					app.render(req, res, "/post", req.data);
				else
					app.render(req, res, "/404", {});
			})
			.get("/:year/:month/:title", renderPost(app), (req, res, next) => {
				
				const {year} = req.params;

				if (!/\d\d\d\d/.test(year))
					return next();

				if (req.urlID == 3)
					app.render(req, res, "/post", req.data);
				else
					app.render(req, res, "/404", {});
			})
			.get("/:year/:month/:day/:title", renderPost(app), (req, res, next) => {
				const {year} = req.params;

				if (!/\d\d\d\d/.test(year))
					return next();

				if (req.urlID == 4)
					app.render(req, res, "/post", req.data);
				else
					app.render(req, res, "/404", {});
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
