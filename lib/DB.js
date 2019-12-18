const Knex = require("knex");
const {readFileSync, unlinkSync} = require("fs");
const {join} = require("path");
const {thumb} = require('node-thumbnail');
const schedule = require("node-schedule");
//const bcrypt = require("bcrypt");

class DB {
	constructor(dev) {
		var connection;
		var client;

		if (dev) {
			client = "mysql";
			connection = {
				host: 'localhost',
				user: 'root',
				password: '',
				database: 'node_blog'
			}
		} else {
			client = "pg";
			connection = process.env.DATABASE_URL;
		}

		this.db = Knex({
		    client,
		    connection
		});
		this.client = client;
	}
	async init() {
		try {
			var createPostPromise;
			var createUsersPromise;
			var createViewsPromise;
			var createFilesPromise;

			const existsPosts = await this.db.schema.hasTable("posts");
			const existsUsers = await this.db.schema.hasTable("users");
			const existsViews = await this.db.schema.hasTable("views");
			const existsFiles = await this.db.schema.hasTable("files");

			if (!existsPosts)
				createPostPromise = this.db.schema.createTable("posts", table => {
					table.increments("ID").primary();
					table.string("title");
					table.text("description");
					table.text("tags");
					table.string("category");
					table.text("content");
					table.integer("comments").defaultTo(0);
					table.dateTime("created");
					table.dateTime('published');
					table.dateTime('updated');
					table.string("postStatus");
					table.string("image");
					table.string("url");
					table.integer("views").defaultTo(0);
				});

			if (!existsUsers)
				createUsersPromise = this.db.schema.createTable("users", table => {
					table.increments("ID").primary();
					table.string("name");
					table.string("lastname");
					table.string("email");
					table.string("fcmToken");
					table.boolean("verified");
				});

				if (!existsViews)
					createViewsPromise = this.db.schema.createTable("views", table => {
						table.string("url");
						table.string("referer");
						table.string("os");
						table.string("browser");
						table.string("country");
						table.timestamp("time");
					});
				/*this.db.none(`CREATE TABLE IF NOT EXISTS comments (
					name VARCHAR(255),
					lastname VARCHAR(50),
					email VARCHAR(150),
					password VARCHAR(60),
					pic VARCHAR(255),
					fcmToken VARCHAR(152),
					verified BOOL
				)`);*/
				if (!existsFiles)
					createFilesPromise = this.db.schema.createTable("files", table => {
						table.string("name");
						table.string("type");
						table.string("secret");
						table.string("mime");
						table.string("width", 4);

						if (this.client === "mysql")
							table.specificType("buffer", "mediumblob");
						else
							table.binary("buffer");
					});
			
			return Promise.all([createPostPromise, createUsersPromise, createViewsPromise, createFilesPromise]);
		} catch(err) {
			console.error(err);
			return Promise.reject(err);
		}

	}
	getPostByURL(url) {
		return new Promise(async (resolve, reject) => {
			try {
				const req = await this.db.where({url}).select("*").from("posts");
				if (req.length === 0)
					reject("dont-exists");
				else
					resolve(req[0]);
			} catch(err) {
				reject(err);
			}
		});
	}
	getPostByID(id) {
		return new Promise(async (resolve, reject) => {
			try {
				const req = await this.db.where({ID: id}).select("*").from("posts");

				resolve(req[0]);
			} catch(err) {
				reject(err);
			}
		})
	}
	getAllPosts() {
		return new Promise(async (resolve, reject) => {
			try {
				const req = await this.db.select("*").from("posts").orderBy("published", "desc");
				resolve({posts: req});
			} catch(err) {
				reject(err);
			}
		});
	}
	getPublishPosts() {
		return new Promise(async (resolve, reject) => {
			try {
				const req = await this.db.where({postStatus: "published"}).select("*").from("posts").orderBy("published", "desc");
				resolve({posts: req});
			} catch(err) {
				reject(err);
			}
		});
	}
	getPublishPostsByPage(index) {
		return new Promise(async (resolve, reject) => {
			try {
				const page = parseInt(index) * 10;

				const req = await this.db.where({postStatus: "published"}).select("*").from("posts").orderBy("published", "desc");

				var next = false;
				var prev = false;

				if (req[page +1])
					next = true;

				if (page - 10 > 9)
					prev = true;

				resolve({posts:req.slice(page-10, page), next, prev});
			} catch(err) {
				reject(err);
			}
		});
	}
	getDraftPosts() {
		return new Promise(async (resolve, reject) => {

			try {
				const req = await this.db.where("postStatus", "draft").select("*").from("posts").orderBy("published", "desc");
				resolve(req);
			} catch(err) {
				reject(err);
			}
		})
	}
	async setView(url, referer, userAgent) {
		try {
			const post = await this.db.where({url: url.slice(1)}).select("views").from("posts");

			if (post.length === 0 && (
				url !== "/" ||
				url !== "/privacidad" ||
				url !== "/search" ||
				url !== "/acerca" ||
				url !== "/terminos"
				))
				return Promise.reject("dont-exists");

			await this.db("posts").where({url: url.slice(1)}).increment("views", 1);

			await this.db("views").insert({
				url,
				referer,
				os: userAgent.os.name,
				browser: userAgent.browser.name,
				country: "Venezuela",
				time: this.db.fn.now()
			});
			return Promise.resolve();

		} catch(err) {
			return Promise.reject(err);
		}
	}
	setComment(url) {
		return new Promise(async (resolve, reject) => {
			try {
				await this.db("posts").where({url}).increment("comments", 1);
				resolve();
			} catch(err) {
				reject(err);
			}
		});
	}
	publishPost(data) {
		return new Promise(async (resolve, reject) => {
			try {
				const {title, description, tags, content, image, url, category} = data;
				
				var id;
				if (data.ID === "undefined" || data.ID === undefined) {
					data = {
						...data,
						comments: 0,
						updated: this.db.fn.now(),
						created: this.db.fn.now(),
						published: this.db.fn.now(),
						views: 0,
						postStatus: "published"
					}
					const res = await this.db("posts").insert(data, "ID");

					id = res[0];
				}
				else {
					data = {
						...data,
						updated: this.db.fn.now(),
						postStatus: "published"

					}
					await this.db("posts").where("ID", data.ID).update(data);

					id = data.ID;
				}
				resolve(id);
			} catch(err) {
				reject(err);
			}
		});
	}
	savePost(data) {
		return new Promise(async (resolve, reject) => {
			try {
				const {title, description, tags, content, image, url, category} = data;
				
				var id;
				if (data.ID === "undefined") {
					data = {
						...data,
						comments: 0,
						created: this.db.fn.now(),
						views: 0,
						postStatus: "draft"
					}
					const res = await this.db("posts").returning("ID").insert(data);

					id = res;
				}
				else {
					data = {
						...data,
						postStatus: "draft"
					}
					await this.db("posts").where("ID", data.ID).update(data);

					id = data.ID;
				}
				resolve(id);
			} catch(err) {
				reject(err);
			}
		});
	}
	async deletePost(ID) {
		try {
			const row = await this.db("posts").where({ID}).delete();

			return Promise.resolve({
				status: "OK"
			});
		} catch(err) {
			console.error(err);
			return Promise.reject();
		}
	}
	uploadFile(type, name, mime, filepath, width) {
		return new Promise(async (resolve, reject) => {
			try {
				var secret = "";
				for (let i = 0; i < 10; i++) {
					secret += Math.floor(Math.random() * 10);
				}
				const buffer = Buffer.from(readFileSync(filepath));

				await this.db("files").insert({
					type,
					name,
					secret,
					mime,
					buffer,
					width
				});

				resolve({src: `/${type}/${secret}/${name}`, name, secret, width});
			} catch(err) {
				reject(err);
			}
		})
	}
	getFile(secret, name) {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await this.db.where({
					name,
					secret
				}).select("buffer", "mime").from("files");

				if (data.length === 0 || !data.length)
					reject("dont-exists");
				else
					resolve(data[0]);
			} catch(err) {
				reject(err);
			}
		});
	}
	async getImages() {
		try {
			const data = await this.db.select("secret", "name", "type", "width").from("files");

			return Promise.resolve(data.reverse().map(({secret, type, name, width}) => ({
				name,
				secret,
				src: `/${type}/${secret}/${name}`,
				width
			})));
		} catch(err) {
			return Promise.reject(err);
		}
	}
	async deleteImage(name, secret) {
		try {
			await this.db("files").where({name, secret}).delete();

			return Promise.resolve({
				status: "OK"
			});
		} catch(err) {
			return Promise.reject(err);
		}
	}
	createUser(name, lastname, email, password, pic) {
		/* return new Promise(async (resolve, reject) => {
			try {
				const hash = await bcrypt.hash(password, 10);
				await this.db("users").returning("ID").insert({
					name,
					lastname,
					email,
					password: hash,
					pic,
					fcmToken: null,
					fbToken: null,
					verified: false
				});
				//TODO: Send Mail
				let startTime = new Date(Date.now() + (60000 * 30));
				this.jobs[email] = schedule.scheduleJob(startTime, function(){
					this.removeUser(email);
				});
			} catch(err) {
				console.error(err);
			}
		})*/
	}
	removeUser(username) {
		return new Promise(async (resolve, reject) => {
			/*this.connection.query("DELETE FROM users WHERE username = ?", username, (err, res, fields) => {

			});	*/		
		})
	}
	cancelRemoveJob(username) {
		this.jobs[username].cancel();
	}
	importPostsFromJson(data) {
		return new Promise((resolve, reject) => {
			data.forEach(async (e) => {
				try {
					const rows = await this.db('posts').select("*").where('url', e.url || "").orWhere("title", e.title).orWhere("published", e.published);

    				if (rows.length === 0)
            			await this.db('posts').insert(e);

				} catch(err) {
					console.log(err);
					reject(err);
				}
			});
			resolve();
		});
	}
	async getStats() {
		try {
			var general = {
				hours: {},
				days: {},
				locations: {},
				os: {},
				browsers: {},
				origins: {},
				subscriptors: 0
			};

			const views = await this.db("views").select("*");
			var posts = await this.db("posts").where({status: "published"}).select("views", "image", "comments", "url", "title", "tags", "description");
			const users = await this.db("users").select("email");

			views.forEach(({time, url, referer, os, browser, country}) => {
				let urlRegExp = /https?:\/\/(\w*\.)*\w*/;
				//Set General Time Views
				let hour = time.getHours();

				if (hour < 12)
					hour = `${hour}AM`;
				else if (hour === 12)
					hour = `${hour}M`;
				else if (hour > 12)
					hour = `${hour - 12}PM`;
				else if (hour === 0)
					hour = "12AM";

				let origin = urlRegExp.test(referer) ? referer.match(urlRegExp)[0] : "desconocido";

				let dayIndex = time.getDay();

				let day;

				switch(dayIndex) {
					case 0:
						day = "Domingo";
						break;
					case 1:
						day = "Lunes";
						break;
					case 2:
						day = "Martes";
						break;
					case 3:
						day = "Miercoles";
						break;
					case 4:
						day = "Jueves";
						break;
					case 5:
						day = "Viernes";
						break;
					case 6:
						day = "Sábado";
						break;
				}

				let generalHour = general.hours[hour];
				let generalLocation = general.locations[country];
				let generalOS = general.os[os];
				let generalOrigin = general.origins[referer];
				let generalBrowser = general.browsers[browser];
				let generalDay = general.days[day];

				if (!generalHour)
					general.hours[hour] = 1;
				else
					general.hours[hour] = generalHour + 1;

				//Set General Location Views

				if (!generalLocation)
					general.locations[country] = 1;
				else
					general.locations[country] = generalLocation + 1;

				//Set General OS Views

				if (!generalOS)
					general.os[os] = 1;
				else
					general.os[os] = generalOS + 1;

				if (!generalBrowser)
					general.browsers[browser] = 1;
				else
					general.browsers[browser] = generalBrowser + 1;

				//Set General Origin Views

				if (!generalOrigin)
					general.origins[origin] = 1;
				else
					general.origins[origin] = generalOrigin + 1;

				//Set General Day Views
				if (!generalDay)
					general.days[day] = 1;
				else
					general.days[day] = generalDay + 1;
			});
			users.forEach(({email}) => {
				let subscriptors = general.subscriptors;

				if (email)
					general.subscriptors = subscriptors + 1;
			});

			return Promise.resolve({
				general,
				posts
			});
		} catch(err) {
			console.error(err);
			return Promise.reject(err);
		}
	}
}
module.exports = DB;
