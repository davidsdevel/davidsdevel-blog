var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://username:password@host:port/database");



class DB {
	static async Init() {
		db.none("SELECT $1 AS value", 123)
    		.then(function (data) {
    		    console.log("DATA:", data.value);
    		})
    		.catch(function (error) {
    		    console.log("ERROR:", error);
    		});
	}
	static async getPostByURL(url) {
		try {
			const req = await db.one("SELECT * FROM posts WHERE url = $1", url);
			return req;
		} catch(err) {
			reject(err);
		}
	}
	static async getPostByID(id) {
		try {
			const req = await db.one("SELECT * FROM posts WHERE id = $1", id);
			return req;
		} catch(err) {
			reject(err);
		}
	}
	static async getAllPosts() {
		try {
			const req = await db.any("SELECT * FROM posts");
		} catch(err) {
			reject(err);
		}
	}
	static async getPublishPosts() {
		try {
			const req = await db.any("SELECT * FROM posts WHERE status = $1", "publish");
		} catch(err) {
			reject(err);
		}
	}
	static async getDraftPosts() {
		try {
			const req = await db.any("SELECT * FROM posts WHERE status = $1", "draft");
		} catch(err) {
			reject(err);
		}
	}
	static async setView(url, referer, userAgent) {
		try {
			const post = await db.one("SELECT views(*) FROM posts WHERE url = $1", url, p => p.views);
			await db.none("UPDATE posts SET view = $1 WHERE url = $2", [posts.views++, url]);
			await db.none("UPDATE views SET view = $2, referer = $3, agent = $4 WHERE url = $1", [url, posts.views++, referer, userAgent]);
		} catch(err) {
			reject(err);
		}
	}
	static async insertComment(url, comment) {

	}
	static async createPost(data) {
		const {title, description, tags, content, image, url} = data;
		db.none("INSERT INTO posts(
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
	static async updatePost
}