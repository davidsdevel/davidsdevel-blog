const {writeFileSync, readFileSync, existsSync, mkdirSync} = require("fs");
const {join} = require("path");

class DB {
	init() {
		return new Promise(async (resolve, reject) => {
			try {
				const dataFolder = join(__dirname, "..", "data");
				if (!existsSync(dataFolder)) {
					mkdirSync(dataFolder);
					writeFileSync(join(dataFolder, "posts.json"), "[]");
					writeFileSync(join(dataFolder, "views.json"), "[]");
					writeFileSync(join(dataFolder, "comments.json"), "[]");
					writeFileSync(join(dataFolder, "files.json"), "[]");
				}
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}
	getPostByURL(url) {
		return new Promise((resolve, reject) => {
			try {
				const data = require("../data/posts.json");

				const req = data.filter(e => e.url === url);

				if (req.length === 0)
					reject("dont-exists");
				else if(req.length === 1)
					resolve(req[0]);
			} catch(err) {
				reject(err);
			}
		});
	}
	getPostByID(id) {
		return new Promise((resolve, reject) => {
			try {
				const data = require("../data/posts.json");

				const req = data.filter((e, i) => i === id);

				if (req.length === 0)
					reject("dont-exists");
				else if(req.length === 1)
					resolve(req[0]);
			} catch(err) {
				reject(err);
			}
		});
	}
	getAllPosts() {
		return new Promise((resolve, reject) => {
			try {
				const data = require("../data/posts.json");

				resolve(data);
			} catch(err) {
				reject(err);
			}
		});
	}
	getPublishPosts() {
		return new Promise((resolve, reject) => {
			try {
				const data = require("../data/posts.json");

				const req = data.filter(e => e.status === "published");

				if (req.length === 0)
					resolve([]);
				else
					resolve(req);
			} catch(err) {
				reject(err);
			}
		});
	}
	getDraftPosts() {
		return new Promise((resolve, reject) => {
			try {
				const data = require("../data/posts.json");

				const req = data.filter(e => e.status === "draft");

				if (req.length === 0)
					reject("dont-exists");
				else
					resolve(req);
			} catch(err) {
				reject(err);
			}
		});
	}
	setView(url, referer, userAgent) {
		return new Promise((resolve, reject) => {
			try {
				const posts = require("../data/posts.json");
				const views = require("../data/views.json");
				var postID;
				var viewID;
				for (let i = 0; i < posts.length; i++) {
					if (posts[i].url === url) {
						postID = i;
						break;
					}
				}
				for (let i = 0; i < views.length; i++) {
					if (views[i].url === url) {
						viewID = i;
						break;
					}
				}

				posts[postID] = {
					...posts[postID],
					views: posts[postID].views + 1
				}
				views.push({
					url,
					referer,
					agent: userAgent
				})

				writeFileSync(join(__dirname, "..", "data", "posts.json"), JSON.stringify(posts));
				writeFileSync(join(__dirname, "..", "data", "views.json"), JSON.stringify(views));

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
				const posts = require("../data/posts.json");
				const {title, description, tags, content, image, url} = data;

				posts.push({
					title,
					description,
					tags,
					content,
					comments: 0,
					created: new Date().toISOString(),
					updated: new Date().toISOString(),
					image,
					url,
					views: 0,
					status: "published"
				});
				writeFileSync(join(__dirname, "..", "data", "posts.json"), JSON.stringify(posts));
				resolve();
			} catch(err) {
				reject(err);
			}
		})
	}
	uploadFile(type, name, mime) {
		return new Promise(async (resolve, reject) => {
			try {
				const files = require("../data/files");
				var secret = "";
				for (let i = 0; i < 10; i++) {
					secret += Math.floor(Math.random() * 10);
				}
				files.push({
					type,
					name,
					secret,
					mime
				});
				writeFileSync(join(__dirname, "..", "data", "files.json"), JSON.stringify(files));
				resolve(`/${type}/${secret}/${name}`);
			} catch(err) {
				reject(err);
			}
		})
	}
	getFile(type, secret, name) {
		return new Promise(async (resolve, reject) => {
			try {
				const files = require("../data/files");
				const file = files.filter(e => (e.secret === secret && e.name === name && e.type === type));
				console.log(file);
				if (file.length > 0)
					resolve({
						buffer: readFileSync(join(__dirname, "..", "files", name)),
						mime: file[0].mime
					});
				else
					reject("dont-exists");
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
