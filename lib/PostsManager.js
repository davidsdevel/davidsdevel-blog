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
	single(url, referer, userAgent) {
		return new Promise(async (resolve, reject) => {
			try {
				await this.db.setView(url, referer, userAgent);
				const req = await this.db.getPostByURL(url);

				const data = {
					...req,
					tags: req.tags.split(/,\s*/)
				}
				resolve(data);
			} catch(err) {
				console.error(err);
				reject(err);
			}
		});
	}
}
module.exports = PostsManager;
