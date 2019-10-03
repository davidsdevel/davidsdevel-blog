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
		else if (typeof === "string") {
			data = options;
		}

		this.db = pgp(data);
	}
	init(isDev) {
		return new Promise(async (resolve, reject) => {
			try {
				if (isDev) {
					await this.db.none("DROP TABLE [IF EXISTS] post");
					await this.db.none("DROP TABLE [IF EXISTS] views");
					await this.db.none("DROP TABLE [IF EXISTS] comments");
					await this.db.none("DROP TABLE [IF EXISTS] images");
				}
				await this.db.none("CREATE TABLE")
			} catch (err) {
				reject(err)
			}
	}
	async getPostByURL(url) {
		try {
			const req = await this.db.one("SELECT * FROM posts WHERE url = $1", url);
			return req;
		} catch(err) {
			reject(err);
		}
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
	async getPublishPosts() {
		try {
			const req = await this.db.any("SELECT * FROM posts WHERE status = $1", "publish");
		} catch(err) {
			reject(err);
		}
	}
	async getDraftPosts() {
		try {
			const req = await this.db.any("SELECT * FROM posts WHERE status = $1", "draft");
		} catch(err) {
			reject(err);
		}
	}
	async setView(url, referer, userAgent) {
		try {
			const post = await this.db.one("SELECT views(*) FROM posts WHERE url = $1", url, p => p.views);
			await this.db.none("UPDATE posts SET view = $1 WHERE url = $2", [posts.views++, url]);
			await this.db.none("UPDATE views SET view = $2, referer = $3, agent = $4 WHERE url = $1", [url, posts.views++, referer, userAgent]);
		} catch(err) {
			reject(err);
		}
	}
	async insertComment(url, comment) {

	}
	async createPost(data) {
		const {title, description, tags, content, image, url} = data;
		this.db.none("INSERT INTO posts(
			title,
			description,
			tags,
			content,
			created,
			image,
			url,
			status
		) values($1, $2, $3, $4, $5, $6, $7)", [title, description, JSON.stringify(tags), content, new Date().toISOString(), image, url, "published"])
	}
	async updatePost(id) {
		try {
			await this.db.none("UPDATE posts SET title,description, tags, content, updated,url, image, status WHERE url = $id")
		} catch(err) {

		}
	}
}