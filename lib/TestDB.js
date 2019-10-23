var mysql = require('mysql');
const {readFileSync, unlinkSync} = require("fs");
const {join} = require("path");
var {thumb} = require('node-thumbnail');
const schedule = require("node-schedule");
const bcrypt = require("bcrypt");

class DB {
	constructor() {
		this.jobs = {};
		this.connection = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: '',
			database: 'node_blog'
		});
		this.connection.connect();
		this.connection.on("error", (err) => {
			console.error("> Error on Connection");
			console.error(err);
			this.connection.end();	
		})
	}
	init() {
		return new Promise(async (resolve, reject) => {
			try {

				this.connection.query(`CREATE TABLE IF NOT EXISTS posts(
				    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
				    title VARCHAR(255),
				    description TEXT,
				    tags TEXT,
				    category VARCHAR(32) NOT NULL,
				    content MEDIUMTEXT,
				    comments INT NOT NULL,
				    created TIMESTAMP NOT NULL,
				    updated TIMESTAMP NOT NULL,
				    postStatus VARCHAR(9) NOT NULL,
				    image VARCHAR(255),
				    url VARCHAR(100),
				    views INT NOT NULL
				)`);
				this.connection.query(`CREATE TABLE IF NOT EXISTS users (
					name VARCHAR(50),
					lastname VARCHAR(50),
					username VARCHAR(50) UNIQUE,
					password VARCHAR(60),
					pic VARCHAR(50),
					fcmToken VARCHAR(152),
					fbToken VARCHAR(50),
					verified BOOL
				)`);
				this.connection.query(`CREATE TABLE IF NOT EXISTS views (
					url VARCHAR(100),
					referer VARCHAR(255),
					os VARCHAR(20),
					browser VARCHAR(50),
					country VARCHAR(50),
					time TIMESTAMP
				)`);
				/*this.connection.query(`CREATE TABLE IF NOT EXISTS comments (
						name VARCHAR(255),
						lastname VARCHAR(50),
						email VARCHAR(150),
						password VARCHAR(60),
						pic VARCHAR(255),
						fcmToken VARCHAR(152),
						verified BOOL
					)`);*/
				this.connection.query(`CREATE TABLE IF NOT EXISTS files (
					name VARCHAR(255) NOT NULL,
					type VARCHAR(20),
					secret VARCHAR(10) NOT NULL,
					mime VARCHAR(10) NOT NULL,
					buffer MEDIUMBLOB NOT NULL
				)`);
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}
	getPostByURL(url) {
		return new Promise((resolve, reject) => {
			try {
				var data;
				this.connection.query("SELECT * FROM posts WHERE url = ?", url, (err, res, fields) => {
					console.log(err, res, fields)
					if (err) {
						reject(err);
					} else {
						if (res.length === 0)
							reject("dont-exists");
						else
							resolve(res[0]);
					}
				});
			} catch(err) {
				reject(err);
			}
		});
	}
	getPostByID(id) {
		return new Promise((resolve, reject) => {
			try {
				var data;
				
				this.connection.query("SELECT * FROM posts WHERE id = ?", [id], (err, res, fields) => {
					if (err) reject(err);

					data = fields[0];
				});

				
				resolve(data);
			} catch(err) {
				reject(err);
			}
		});
	}
	getAllPosts() {
		return new Promise((resolve, reject) => {
			try {
				var data;
				
				this.connection.query("SELECT * FROM posts", (err, res, fields) => {
					if (err) reject(err);
					else resolve(res);
				});
			} catch(err) {
				reject(err);
			}
		});
	}
	getPublishPosts() {
		return new Promise((resolve, reject) => {
			try {
				this.connection.query("SELECT * FROM posts WHERE postStatus = ?", ["published"], (err, res, fields) => {
					if (err) reject(err);
					else resolve(res);
				});
			} catch(err) {
				reject(err);
			}
		});
	}
	getPublishPostsByPage(index) {
		return new Promise((resolve, reject) => {
			try {
				const page = parseInt(index) * 10;

				this.connection.query("SELECT * FROM posts WHERE postStatus = ? AND (ID > ? AND ID < ?)", ["published", page - 10, page], (err, res, fields) => {
					console.log(err, res, fields)
					if (err) reject(err);
					else resolve(res);
				});				
			} catch(err) {
				reject(err);
			}
		});
	}
	getDraftPosts() {
		return new Promise((resolve, reject) => {
			try {
				var data;
				
				this.connection.query("SELECT * FROM posts WHERE postStatus = ?", ["draft"], (err, res, fields) => {
					if (err) reject(err);

					data = fields;
				});

				
				resolve(data);
			} catch(err) {
				reject(err);
			}
		});
	}
	setView(url, referer, userAgent) {
		return new Promise((resolve, reject) => {
			try {
				console.log(url, referer, userAgent)
				var views;
				const CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };

				this.connection.query("SELECT views FROM posts WHERE url = ?", [url], (err, res, fields) => {
					if (err) reject(err);
					views = fields[0] + 1;
				});
				this.connection.query("UPDATE posts SET views = ? WHERE url = ?", [views, url], (err, res, fields) => {
					if (err) reject(err);
				});
				
				const sql = this.connection.format("INSERT INTO views SET ? ", {
					url,
					referer,
					os: userAgent.os.name,
					browser: userAgent.browser.name,
					country: "Venezuela",
					time: CURRENT_TIMESTAMP
				});

				this.connection.query(sql, (err, res, fields) => {
					if (err) reject(err);
				});
				

				resolve();
			} catch(err) {
				reject(err);
			}
		});
	}
	insertComment(url, comment) {

	}
	publishPost(data) {
		return new Promise((resolve, reject) => {
			try {
				const {title, description, tags, content, image, url, category} = data;
				const CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };
				
				var sql;
				if (data.ID === "undefined")
					sql = this.connection.format("INSERT INTO posts SET ?", {
						title,
						description,
						tags,
						content,
						comments: 0,
						created: CURRENT_TIMESTAMP,
						updated: CURRENT_TIMESTAMP,
						image,
						category,
						url,
						views: 0,
						postStatus: "published"
					});
				else
					sql = this.connection.format("UPDATE posts SET ? WHERE ID = ?", [{
						title,
						description,
						tags,
						content,
						comments: 0,
						updated: CURRENT_TIMESTAMP,
						image,
						category,
						url,
						views: 0,
						postStatus: "published"
					},
					data.ID]);
				this.connection.query(sql, (err, res, fields) => {
					if (err) {
						console.log(err);
						reject(err.sqlMessage);
					} else {
						if (data.ID === "undefined")
							resolve(res.insertId);
						else
							resolve(data.ID);
					}
				});

			} catch(err) {
				reject(err);
			}
		});
	}
	savePost(data) {
		return new Promise((resolve, reject) => {
			try {
				const {title, description, tags, content, image, url, category} = data;
				const CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };
				
				var sql;
				if (data.ID === "undefined")
					sql = this.connection.format("INSERT INTO posts SET ?", {
						title,
						description,
						tags,
						content,
						comments: 0,
						created: CURRENT_TIMESTAMP,
						updated: CURRENT_TIMESTAMP,
						image,
						category,
						url,
						views: 0,
						postStatus: "draft"
					});
				else
					sql = this.connection.format("UPDATE posts SET ? WHERE ID = ?", [{
						title,
						description,
						tags,
						content,
						comments: 0,
						updated: CURRENT_TIMESTAMP,
						image,
						category,
						url,
						views: 0,
						postStatus: "draft"
					},
					data.ID]);
				this.connection.query(sql, (err, res, fields) => {
					if (err) {
						console.log(err);
						reject(err.sqlMessage);
					} else {
						if (data.ID === "undefined")
							resolve(res.insertId);
						else
							resolve(data.ID);
					}
				});

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
				}, () => {
					thumbnail = Buffer.from(readFileSync(thumbPath)).toString("base64");
					unlinkSync(thumbPath);

					this.connection.query("INSERT INTO files SET ?", {
						type,
						name,
						secret,
						mime,
						buffer
					}, (err, res, fields) => {
						if (err) {
							console.log("> ", err)
							reject(err);
						}
						unlinkSync(filepath);
						resolve({src: `/${type}/${secret}/${name}`, thumb: `data:${mime};base64,${thumbnail}`});
					});
				});
			} catch(err) {
				reject(err);
			}
		})
	}
	getFile(type, secret, name) {
		return new Promise(async (resolve, reject) => {
			try {
				var data = {};
				this.connection.query("SELECT buffer, mime FROM files WHERE name = ? AND secret = ?", [name, secret], (err, res, fields) => {
					if (err) {
						reject(err);
					}
					else {
						resolve(res[0]);
					}
				});
			} catch(err) {
				reject(err);
			}
		});
	}
	updatePost(id) {
		return new Promise(async(resolve, reject) => {
			try {
				await this.db.none("UPDATE posts SET title,description, tags, content, updated,url, image, status WHERE url = $id")
			} catch(err) {

			}
		})
	}
	createUser(name, lastname, username, password) {
		return new Promise(async (resolve, reject) => {
			try {
				const hash = await bcrypt.hash(password, 10);
				this.connection.query("INSERT INTO users SET ?", {name, lastname, username, password: hash}, (err, res, fields) => {
					//TODO: Send Mail

					let startTime = new Date(Date.now() + (60000 * 30));
					this.jobs[username] = schedule.scheduleJob(startTime, function(){
						this.removeUser(username);
					});
				});
			} catch(err) {
				console.error(err);
			}
		})
	}
	removeUser(username) {
		return new Promise(async (resolve, reject) => {
			this.connection.query("DELETE FROM users WHERE username = ?", username, (err, res, fields) => {

			});			
		})
	}
	cancelRemoveJob(username) {
		this.jobs[username].cancel();
	}
}

module.exports = DB;
