const pgp = require("pg-promise")(/*options*/);

class DB {
	constructor(options) {
		var data;
		if (typeof options === "object") {
			const {username, password, host, port, database} = options;
			if (!username)
				throw new Error("Don't Have Username");

			if (!password)
				throw new Error("Don't Have Password");

			if (!host)
				throw new Error("Don't Have Host");

			if (!port)
				throw new Error("Don't Have Port");

			if (!database)
				throw new Error("Don't Have Database");

			data = `postgres://${username}:${password}@${host}:${port}/${database}`;
		}
		else if (typeof options === "string") {
			data = options;
		}

		this.db = pgp(data);
	}
	init() {
		return new Promise(async (resolve, reject) => {
			try {
				await this.db.none(`CREATE TABLE [IF NOT EXISTS] posts(
				    ID integer NOT NULL,
				    title VARCHAR(255),
				    description TEXT,
				    tags TEXT,
				    category VARCHAR(32) NOT NULL,
				    content MEDIUMTEXT,
				    comments integer NOT NULL,
				    created TIMESTAMP NOT NULL,
				    updated TIMESTAMP NOT NULL,
				    postStatus VARCHAR(9) NOT NULL,
				    image VARCHAR(255),
				    url VARCHAR(100),
				    views integer NOT NULL,
				    CONSTRAINT ID PRIMARY KEY (ID)
				)`);
				this.db.none(`CREATE TABLE [IF NOT EXISTS] users (
					name VARCHAR(50),
					lastname VARCHAR(50),
					username VARCHAR(50) UNIQUE,
					password VARCHAR(60),
					pic VARCHAR(50),
					fcmToken VARCHAR(152),
					fbToken VARCHAR(50),
					verified BOOL
				)`);
				this.db.none(`CREATE TABLE [IF NOT EXISTS] views (
					url VARCHAR(100),
					referer VARCHAR(255),
					os VARCHAR(20),
					browser VARCHAR(50),
					country VARCHAR(50),
					time TIMESTAMP
				)`);
				/*this.db.none(`CREATE TABLE [IF NOT EXISTS] comments (
						name VARCHAR(255),
						lastname VARCHAR(50),
						email VARCHAR(150),
						password VARCHAR(60),
						pic VARCHAR(255),
						fcmToken VARCHAR(152),
						verified BOOL
					)`);*/
				this.db.none(`CREATE TABLE [IF NOT EXISTS] files (
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
	async getPostByURL(url) {
		return new Promise(async (resolve, reject) => {
			try {
				const req = await this.db.oneOrNone("SELECT * FROM posts WHERE url = $1", url);
				resolve(req);
			} catch(err) {
				reject(err);
			}
		});
	}
	async getPostByID(id) {
		try {
			const req = await this.db.one("SELECT * FROM posts WHERE id = $1", id);
			return req;
		} catch(err) {
			reject(err);
		}
	}
	async getAllPosts() {
		try {
			const req = await this.db.any("SELECT * FROM posts");
		} catch(err) {
			reject(err);
		}
	}
	getPublishPosts() {
		return new Promise(async (resolve, reject) => {
			try {
				const req = await this.db.any("SELECT * FROM posts WHERE postStatus = $1", "published");
				resolve(req);
			} catch(err) {
				reject(err);
			}
		});
	}
	getPublishPostsByPage(index) {
		return new Promise((resolve, reject) => {
			try {
				const page = parseInt(index) * 10;

				const req = await this.db.any("SELECT * FROM posts WHERE postStatus = $1 AND (ID > $2 AND ID < $3)", ["published", page - 10, page]);

				resolve(req);	
			} catch(err) {
				reject(err);
			}
		});
	}
	getDraftPosts() {
		try {
			const req = await this.db.any("SELECT * FROM posts WHERE postStatus = $1", "draft");
			resolve(req);
		} catch(err) {
			reject(err);
		}
	}
	async setView(url, referer, userAgent) {
		return new Promise(async (resolve, reject) => {
			try {
				const post = await this.db.one("SELECT views FROM posts WHERE url = $1", url, p => p.views);
				
				await this.db.none("UPDATE posts SET views = $1 WHERE url = $2", [posts.views++, url]);

				await this.db.none("INSERT INTO views (url, referer, os, browser,country,time) value (${url}, ${referer}, ${os}, ${browser}, ${country}, to_timestamp(${time}/1000)", {
					url,
					referer,
					os: userAgent.os.name,
					browser: userAgent.browser.name,
					country: "Venezuela",
					time: Date.now()
				});
			} catch(err) {
				reject(err);
			}
		});
	}
	insertComment(url, comment) {
		return
	}
	async publishPost(data) {
		return new Promise((resolve, reject) => {
			try {
				const {title, description, tags, content, image, url, category} = data;
				
				var id;
				if (data.ID === "undefined") {

					const res = await this.db.one("INSERT INTO posts (
						title,
						description,
						tags,
						content,
						comments,
						updated,
						created,
						image,
						category,
						url,
						views,
						postStatus
					) values(
						${title},
						${description},
						${tags},
						${content},
						0,
						to_timestamp(${now}/1000),
						to_timestamp(${now}/1000),
						${image},
						${category},
						${url},
						0,
						${status}
					) RETURNING ID", {
						title,
						description,
						tags,
						content,
						now: Date.now(),
						image,
						category,
						url,
						status: "published"
					}, e => e.ID);

					id = res;
				}
				else {

					await this.db.none("UPDATE posts SET
						title = ${title},
						description = ${description},
						tags = ${tags},
						content = ${content},
						comments = 0,
						updated = to_timestamp(${now}/1000),
						image = ${image},
						category = ${category},
						url = ${url},
						views = 0,
						postStatus = ${status}
					WHERE ID = ${ID}", {
						ID: data.ID,
						title,
						description,
						tags,
						content,
						now: Date.now(),
						image,
						category,
						url,
						status: "published"
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
		return new Promise((resolve, reject) => {
			try {
				const {title, description, tags, content, image, url, category} = data;
				
				var id;
				if (data.ID === "undefined") {

					const res = await this.db.result("INSERT INTO posts (
						title,
						description,
						tags,
						content,
						comments,
						updated,
						created,
						image,
						category,
						url,
						views,
						postStatus
					}) values(
						${title},
						${description},
						${tags},
						${content},
						0,
						to_timestamp(${now}/1000),
						to_timestamp(${now}/1000),
						${image},
						${category},
						${url},
						0,
						${status}
					)", {
						title,
						description,
						tags,
						content,
						now: Date.now(),
						image,
						category,
						url,
						status: "draft"
					}, e => e.rowCount);

					id = res[0].ID;
				}
				else {

					await this.db.none("UPDATE posts SET 
						title = ${title},
						description = ${description},
						tags = ${tags},
						content = ${content},
						comments = 0,
						updated = to_timestamp(${now}/1000),
						image = ${image},
						category = ${category},
						url = ${url},
						views = 0,
						postStatus = ${status}
					WHERE ID = ${ID}", {
						ID: data.ID,
						title,
						description,
						tags,
						content,
						now: Date.now(),
						image,
						category,
						url,
						status: "draft"
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

					await this.db.none("INSERT INTO files (
						type,
						name,
						secret,
						mime,
						buffer
					) values ($1, $2, $3, $4, $5) ?", [
						type,
						name,
						secret,
						mime,
						buffer
					]);

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
				var data = {};

				const data = this.db.one("SELECT buffer, mime FROM files WHERE name = $1 AND secret = $2", [name, secret]);

				resolve(data);
			} catch(err) {
				reject(err);
			}
		});
	}
	createUser(name, lastname, email, password) {
		return new Promise(async (resolve, reject) => {
			try {
				const hash = await bcrypt.hash(password, 10);
				await this.db.none("INSERT INTO users (name,
					lastname,
					email,
					password,
					pic,
					fcmToken,
					fbToken,
					verified
				) values ($1, $2, $3, $4, $5, $7, $7, $6)",
				[name, lastname, email, hash, pic, false, undefined]);
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