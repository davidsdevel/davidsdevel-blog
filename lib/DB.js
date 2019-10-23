const Knex = require("knex");
const {readFileSync, unlinkSync} = require("fs");
const {join} = require("path");
var {thumb} = require('node-thumbnail');
const schedule = require("node-schedule");
const bcrypt = require("bcrypt");

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
		console.log(dev)
		this.db = Knex({
		    client,
		    connection
		});
	}
	init() {
		return new Promise(async (resolve, reject) => {
			try {
				await this.db.schema.hasTable("posts", exists => {
					if (!exists)
						return this.db.schema.createTable("posts", table => {
							table.increments("ID").primary();
							table.string("title");
							table.text("description");
							table.text("tags");
							table.string("category");
							table.text("content");
							table.integer("comments");
							table.timestamp('created');
							table.timestamp('updated');
							table.string("postStatus");
							table.string("image");
							table.string("url");
							table.integer("views");
						});
				});
				await this.db.schema.hasTable("users", exists => {
					if (!exists)
						return this.db.schema.createTable("users", table => {
							table.increments("ID").primary();
							table.string("name");
							table.string("lastname");
							table.string("username");
							table.string("password");
							table.string("pic");
							table.string("fcmToken");
							table.string("fbToken");
							table.boolean("verified");
						});
				})
				await this.db.schema.hasTable("views", exists => {
					if (!exists)
						return this.db.schema.createTable("views", table => {
							table.string("url");
							table.string("referer");
							table.string("os");
							table.string("browser");
							table.string("country");
							table.timestamp("time");
						});
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
				await this.db.schema.hasTable("files", exists => {
					if (!exists)
						return this.db.schema.createTable("files", table => {
							table.string("name");
							table.string("type");
							table.string("secret");
							table.string("mime");
							table.binary("buffer");
						});
				});
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}
	async getPostByURL(url) {
		return new Promise(async (resolve, reject) => {
			try {
				const req = await this.db.where({url}).select("*").from("posts");
				resolve(req);
			} catch(err) {
				reject(err);
			}
		});
	}
	getPostByID(id) {
		return new Promise(async (resolve, reject) => {
			try {
				const req = await this.db.where({ID: id}).select("*").from("posts");

				resolve(req);
			} catch(err) {
				reject(err);
			}
		})
	}
	getAllPosts() {
		return new Promise(async (resolve, reject) => {
			try {
				const req = await this.db.select("*").from("posts");
				resolve(req);
			} catch(err) {
				reject(err);
			}
		});
	}
	getPublishPosts() {
		return new Promise(async (resolve, reject) => {
			try {
				const req = await this.db.where({postStatus: "published"}).select("*").from("posts");
				resolve(req);
			} catch(err) {
				reject(err);
			}
		});
	}
	getPublishPostsByPage(index) {
		return new Promise(async (resolve, reject) => {
			try {
				const page = parseInt(index) * 10;
				const req = await this.db.where(postStatus, "published").andWhere(() => {
					this.where("id", ">", page - 10).andWhere("id", "<", page);
				});

				resolve(req);	
			} catch(err) {
				reject(err);
			}
		});
	}
	getDraftPosts() {
		return new Promise(async (resolve, reject) => {

			try {
				const req = await this.db.where("postStatus", "draft").select("*").from("posts");
				resolve(req);
			} catch(err) {
				reject(err);
			}
		})
	}
	setView(url, referer, userAgent) {
		return new Promise(async (resolve, reject) => {
			try {
				const post = await this.db.where({url}).select("views").from("posts");

				if (post.length === 0)
					reject("dont-exists");

				await this.db("posts").where({url}).update({
					views:post[0].views+1
				});
				await this.db("views").insert({
					url,
					referer,
					os: userAgent.os.name,
					browser: userAgent.browser.name,
					country: "Venezuela",
					time: this.db.fn.now()
				});
				resolve();
			} catch(err) {
				reject(err);
			}
		});
	}
	insertComment(url, comment) {
		return
	}
	publishPost(data) {
		return new Promise(async (resolve, reject) => {
			try {
				const {title, description, tags, content, image, url, category} = data;
				
				var id;
				if (data.ID === "undefined") {
					const res = await this.db("posts").returning("ID").insert({
						title,
						description,
						tags,
						content,
						comments: 0,
						updated: this.db.fn.now(),
						created: this.db.fn.now(),
						image,
						category,
						url,
						views: 0,
						postStatus: "published"
					});

					id = res;
				}
				else {
					await this.db("posts").where("ID", data.ID)
						.update({
							title,
							description,
							tags,
							content,
							comments: 0,
							updated: this.db.fn.now(),
							image,
							category,
							url,
							views: 0,
							postStatus: "published"
							
						});

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
					const res = await this.db("posts").returning("ID").insert({
						title,
						description,
						tags,
						content,
						comments: 0,
						updated: this.db.fn.now(),
						created: this.db.fn.now(),
						image,
						category,
						url,
						views: 0,
						postStatus: "draft"
					});

					id = res;
				}
				else {
					await this.db("posts").where("ID", data.ID)
						.update({
							title,
							description,
							tags,
							content,
							comments: 0,
							updated: this.db.fn.now(),
							image,
							category,
							url,
							views: 0,
							postStatus: "draft"
							
						});

					id = data.ID;
				}
				resolve(id);
			} catch(err) {
				reject(err);
			}
		});
	}
	uploadFile(type, name, mime, filepath) {
		return new Promise(async (resolve, reject) => {
			try {
				var secret = "";
				for (let i = 0; i < 10; i++) {
					secret += Math.floor(Math.random() * 10);
				}
				const thumbFolder = join(filepath,"..");
				const thumbPath = filepath.replace(/\.(?=\w*$)/, "_thumb.");

				const buffer = Buffer.from(readFileSync(filepath));
				var thumbnail;

				thumb({
				  	source: filepath, // could be a filename: dest/path/image.jpg
				  	destination: thumbFolder,
				  	concurrency: 4,
				  	width: 50
				}, async () => {
					thumbnail = Buffer.from(readFileSync(thumbPath)).toString("base64");
					await this.db("files").insert({
						type,
						name,
						secret,
						mime,
						buffer
					});

					unlinkSync(thumbPath);
					unlinkSync(filepath);
					resolve({src: `/${type}/${secret}/${name}`, thumb: `data:${mime};base64,${thumbnail}`});
				});
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

				resolve(data);
			} catch(err) {
				reject(err);
			}
		});
	}
	createUser(name, lastname, email, password, pic) {
		return new Promise(async (resolve, reject) => {
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
		})
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
}
module.exports = DB;
