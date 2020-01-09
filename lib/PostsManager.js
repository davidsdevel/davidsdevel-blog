class PostsManager {
	constructor(db) {
		this.db = db;
	}
	all(page) {
		return new Promise(async (resolve, reject) => {
			try {
				var posts;
				if (page)
					posts = await this.db.getPublishPostsByPage(page);
				else
					posts = await this.db.getPublishPosts(page);

				resolve(posts);
			} catch(err) {
				console.log(err);
				reject(err);
			}
		})
	}
	single(category, url) {
		return new Promise(async (resolve, reject) => {
			try {
				const req = await this.db.getPostByURL(category, url);

				if (req.postStatus !== "published")
					reject({status: "dont-exists"});

				else {
					const data = {
						...req,
						tags: req.tags.split(/,\s*/)
					}
					resolve(data);
				}
			} catch(err) {
				console.error(err);
				reject(err);
			}
		});
	}
	allEdit() {
		return new Promise(async (resolve, reject) => {
			try {
				var posts = await this.db.getAllPosts();
				resolve(posts);
			} catch(err) {
				console.log(err);
				reject(err);
			}
		});
	}
	singleEdit(ID) {
		return new Promise(async (resolve, reject) => {
			try {
				const req = await this.db.getPostByID(ID);

				const data = {
					...req,
					tags: req.tags.split(/,\s*/),
					isPublished: req.published !== null
				};
				resolve(data);
			} catch(err) {
				console.error(err);
				reject(err);
			}
		});
	}
	setView(url, referer, userAgent) {
		return new Promise(async (resolve, reject) => {
			try {
				await this.db.setView(url, referer, userAgent);
				resolve();
			} catch(err) {
				reject(err);
			}

		})
	}
}
module.exports = PostsManager;
