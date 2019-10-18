var mysql = require('mysql');
const {readFileSync, unlinkSync} = require("fs");
const {join} = require("path");
var {thumb} = require('node-thumbnail');

class DB {
	constructor() {
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
				this.connection.query(`CREATE TABLE IF NOT EXISTS views (
					url VARCHAR(100),
					referer VARCHAR(255),
					os VARCHAR(20),
					navigator VARCHAR(50),
					country VARCHAR(50),
					time TIMESTAMP
				)`);
				/*this.connection.query(`CREATE TABLE IF NOT EXISTS comments (
					url VARCHAR(100),
					username VARCHAR(255),
					userpic String,
					content String
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
				this.connection.query("SELECT image, content, title, tags, updated FROM posts WHERE url = ?", url, (err, res, fields) => {

					if (err) {
						reject(err);
					} else {
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

					data = fields;
				});

				
				resolve(data);
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
				const sql = this.connection.format("INSERT INTO views (url, referer, agent, time) VALUES (?, ?, ?, ?)", [url, referer, userAgent, CURRENT_TIMESTAMP])
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
				
				const sql = this.connection.format("INSERT INTO posts SET ?", {
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

				this.connection.query(sql, (err, res, fields) => {
					if (err) {
						console.log(err);
						reject(err.sqlMessage);
					} else {
						resolve();
					}
				});

			} catch(err) {
				reject(err);
			}
		})
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

				const buffer = readFileSync(filepath);
				var thumbnail;

				thumb({
				  	source: filepath, // could be a filename: dest/path/image.jpg
				  	destination: thumbFolder,
				  	concurrency: 4,
				  	width: 200
				}, () => {
					thumbnail = Buffer.from(readFileSync(thumbPath)).toString("base64");
					unlinkSync(thumbPath);
					resolve({src: `/${type}/${secret}/${name}`, thumb: `data:${mime};base64,${thumbnail}`});
				});

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
}

module.exports = DB;
