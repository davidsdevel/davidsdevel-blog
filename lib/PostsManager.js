class PostsManager {
	constructor(db) {
		this.db = db;
	}
	all(page) {
		return new Promise(async (resolve, reject) => {
			try {
				const posts = await this.db.getPublishPosts();

				var data;
				if (page) {
					const pageNumber = parseInt(page) * 10;
					data = posts.slice(pageNumber - 10, pageNumber);
				} else
					data = posts.slice(0, 10);
				
				console.log(data);
				resolve(data);
			} catch(err) {
				console.log(err);
				reject(err);
			}
		})
	}
	single(url) {
		return new Promise(async (resolve, reject) => {
			try {
				console.log(url);
				const req = await this.db.getPostByURL(url);
				console.log(req);

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
