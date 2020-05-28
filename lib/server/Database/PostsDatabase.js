const Database = require("./FileDatabase");
const Mail = require("../Mail");
const Notification = require("../SendNotification");

const mailer = new Mail();

class PostsDatabase extends Database {
	constructor(dev) {
		super(dev);
	}
	/**
	 * Get Post By Title
	 *
	 * @public
	 *
	 * @param {String} url
	 *
	 * @return {Promise<Object|String>}
	 *
	 */
	async getPostByTitle(url) {
		try {
			const req = await this.db.where({url}).select("*").from("posts");
			if (req.length === 0)
				return Promise.reject("dont-exists");
			else
				return Promise.resolve(req[0]);
		} catch(err) {
			return Promise.reject(err);
		}
	}
	/**
	 * Get Post By Category
	 *
	 * @public
	 *
	 * @param {String} category
	 * @param {String} url
	 *
	 * @return {Promise<Object|String>}
	 *
	 */
	async getPostByCategory(category, url) {
		try {
			const req = await this.db.where({category, url}).select("*").from("posts");
			if (req.length === 0)
				return Promise.reject("dont-exists");
			else
				return Promise.resolve(req[0]);
		} catch(err) {
			return Promise.reject(err);
		}
	}
	/**
	 * Get Post By Year Month
	 *
	 * @public
	 *
	 * @param {String|Number} year
	 * @param {String|Number} month
	 * @param {String} url
	 *
	 * @return {Promise<Object|String>}
	 *
	 */
	async getPostByYearMonth(year, month, url) {
		try {

			const req = await this.db.where({url}).select("*").from("posts");
			if (req.length === 0)
				return Promise.reject("dont-exists");
			else {
				const post = req[0];
				const date = new Date(post.published);

				if (year == date.getFullYear() && month == date.getMont() * 1)
					return Promise.resolve(req[0]);
				else
					return Promise.reject("no-exists");
			}
		} catch(err) {
			return Promise.reject(err);
		}
	}
	/**
	 * Get Post By Year Month Day
	 *
	 * @public
	 *
	 * @param {String|Number} year
	 * @param {String|Number} month
	 * @param {String|Number} day
	 * @param {String} url
	 *
	 * @return {Promise<Object|String>}
	 *
	 */
	async getPostByYearMonthDay(year, month, day, url) {
		try {

			const req = await this.db.where({url}).select("*").from("posts");
			if (req.length === 0)
				return Promise.reject("dont-exists");
			else {
				const post = req[0];
				const date = new Date(post.published);

				if (year == date.getFullYear() && month == date.getMont() * 1 && day == date.getDate())
					return Promise.resolve(req[0]);
				else
					return Promise.reject("no-exists");
			}
		} catch(err) {
			return Promise.reject(err);
		}
	}
	/**
	 * Get Post By ID
	 *
	 * @public
	 *
	 * @param {String} ID
	 *
	 * @return {Promise<Object|String>}
	 *
	 */
	async getPostByID(ID) {
		try {
			const req = await this.db.where({ID}).select("*").from("posts");

			if (req.length === 0)
				return Promise.reject("dont-exists");
			else
				return Promise.resolve(req[0]);
		} catch(err) {
			return Promise.reject(err);
		}
	}
	/**
	 * Get All Posts
	 *
	 * @description Returns an Object with all posts in DB
	 * @public
	 *
	 * @return {Promise<Object>}
	 */
	async getAllPosts() {
		try {
			const req = await this.db.select("*").from("posts").orderBy("created", "desc");
			const urlID = await this.getUrlID();

			return Promise.resolve({posts: req.map(e => {
				if (e.postStatus !== "published")
					return e;

				let url = e.url;

				if (urlID == 2)
					url = `${e.category}/${e.url}`;


				if (urlID == 3 || urlID == 3) {
					const date = new Date(e.published)
					if (urlID == 3)
						url = `${date.getFullYear()}/${date.getMonth()}/${e.url}`;
					if (urlID == 4)
						url = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}/${e.url}`;
				}

				return {
					...e,
					url
				}
			})});
		} catch(err) {
			return Promise.reject(err);
		}
	}
	/**
	 * Get Publish Posts
	 *
	 * @description Returns an Object with all published posts in DB
	 * @public
	 *
	 * @return {Promise<Object>}
	 */
	async getPublishPosts() {
		try {
			const req = await this.db.where({postStatus: "published"}).select("*").from("posts").orderBy("published", "desc");
			return Promise.resolve({posts: req.map(e => {
				let url = e.url;

				if (urlID == 2)
					url = `${e.category}/${e.url}`;


				if (urlID == 3 || urlID == 3) {
					const date = new Date(e.published)
					if (urlID == 3)
						url = `${date.getFullYear()}/${date.getMonth()}/${e.url}`;
					if (urlID == 4)
						url = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}/${e.url}`;
				}

				return {
					...e,
					url
				}
			})});
		} catch(err) {
			return Promise.reject(err);
		}
	}
	/**
	 * Get Publish Posts by Page
	 *
	 * @description Returns an Object with all published posts, 10 by page
	 * @public
	 *
	 * @param {String|Number} index
	 *
	 * @return {Promise<Object>}
	 */
	async getPublishPostsByPage(index) {
		try {
			const page = index * 10;

			const req = await this.db.where({postStatus: "published"}).select("*").from("posts").orderBy("published", "desc");

			var next = false;
			var prev = false;

			if (req[page +1])
				next = true;

			if (page - 10 > 9)
				prev = true;

			return Promise.resolve({posts:req.slice(page-10, page), next, prev});
		} catch(err) {
			return Promise.reject(err);
		}
	}
	/**
	 * Get Draft Posts
	 *
	 * @description Returns an Object with all draft posts in DB
	 * @public
	 *
	 * @return {Promise<Object>}
	 */
	async getDraftPosts() {
		try {
			const req = await this.db.where("postStatus", "draft").select("*").from("posts").orderBy("published", "desc");
			return Promise.resolve(req);
		} catch(err) {
			return Promise.reject(err);
		}
	}
	async searchPost(query, index) {
		try {
			console.log(query);
			const page = index ? index * 10 : 10;

			const req = await this.db.where({postStatus: "published"}).select("description", "content", "title", "tags", "category", "image", "url", "comments").from("posts").orderBy("published", "desc");

			var next = false;
			var prev = false;

			if (req[page +1])
				next = true;

			const posts = req.filter(e => {
				var findInTags = false;
				var findInTitle = false;
				var findInContent = false;
				var findInCategory = false;


				if (e.category) {
					findInCategory = e.category.match(new RegExp(query, "i")) !== null;
				}
				if (e.tags) {
					findInTags = e.tags.match(new RegExp(query, "i")) !== null;
				}
				if (e.title) {
					findInContent = e.title.match(new RegExp(query, "i")) !== null;
				}
				var data
				if (e.content) {
					data = e.content.split("<").map(ev => ev.replace(/.*>/, "")).join(" ");

					findInContent = data.match(new RegExp(query, "i")) !== null;
				}
				console.log(findInContent, findInTitle, findInTags, findInCategory)

				if (findInContent || findInTitle || findInTags || findInCategory) return true;
				else return false;
			}).map(({description, title, image, url, comments, category}) => ({description, title, image, url, comments, category}));

			return posts.length === 0 ? Promise.reject("dont-exists") : Promise.resolve({posts: posts.slice(page-10, page), next});
		} catch (err) {
			return Promise.reject(err);
			console.error(err);
		}
	}
	/**
	 * Set View
	 *
	 * @description Set a view on a single post 
	 * @public
	 *
	 * @param {String} url
	 * @param {String} referer
	 * @param {String} userAgent
	 *
	 * @return {Promise}
	 */
	async setView(url, referer, userAgent) {
		try {
			const post = await this.db.where({url}).select("views").from("posts");
			
			if (post.length === 0 && (
				url !== "/" ||
				url !== "/privacidad" ||
				url !== "/search" ||
				url !== "/acerca" ||
				url !== "/terminos"
				))
				return Promise.reject("dont-exists");

			await this.db("posts").where({url}).increment("views", 1);

			await this.db("views").insert({
				url,
				referer,
				os: userAgent.os.name,
				browser: userAgent.browser.name,
				country: "Venezuela",
				time: this.db.fn.now()
			});
			return Promise.resolve();

		} catch(err) {
			return Promise.reject(err);
		}
	}
	async setComment(url) {
		try {
			await this.db("posts").where({url}).increment("comments", 1);
			return Promise.resolve();
		} catch(err) {
			return Promise.reject(err);
		}
	}
	async publishPost(data) {
		try {

			var id;
			if (data.ID === "undefined" || data.ID === undefined) {
				data = {
					...data,
					comments: 0,
					updated: this.db.fn.now(),
					created: this.db.fn.now(),
					published: this.db.fn.now(),
					views: 0,
					postStatus: "published"
				}

				delete data.ID;

				const res = await this.db("posts").insert(data, "ID");

				id = res[0];
			}
			else {
				if (data.postStatus === "draft")
					data = {
						...data,
						updated: this.db.fn.now(),
						published: this.db.fn.now(),
						postStatus: "published"
					};
				else
					data = {
						...data,
						updated: this.db.fn.now(),
						postStatus: "published"
					};

				await this.db("posts").where("ID", data.ID).update(data);

				id = data.ID;
			}
			return Promise.resolve(id);
		} catch(err) {
			return Promise.reject(err);
		}
	}
	async savePost(data) {
		try {
			const {title, description, tags, content, image, url, category} = data;
			var id;
			if (data.ID === "undefined") {
				data = {
					...data,
					comments: 0,
					created: this.db.fn.now(),
					views: 0,
					postStatus: "draft"
				}
				delete data.ID;
				const res = await this.db("posts").returning("ID").insert(data);

				id = res;
			}
			else {
				data = {
					...data,
					postStatus: "draft"
				}
				await this.db("posts").where("ID", data.ID).update(data);

				id = data.ID;
			}
			return Promise.resolve(id);
		} catch(err) {
			return Promise.reject(err);
		}
	}
	async deletePost(url) {
		try {
			await this.db("posts").where({url}).delete();
			await this.db("views").where({url}).delete();

			return Promise.resolve({
				status: "OK"
			});
		} catch(err) {
			console.error(err);
			return Promise.reject();
		}
	}
	async getMostViewed() {
		try {
			const rows = await this.db("posts").where({postStatus: "published"}).select("title", "views", "comments", "description", "image", "url", "ID").orderBy("views", "desc");

			if (rows.length > 0)
				return Promise.resolve(rows[0]);
			else
				return Promise.resolve({});
		} catch(err) {
			return Promise.reject(err);
		}
	}
	async getMostCommented() {
		try {
			const rows = await this.db("posts").where({postStatus: "published"}).select("title", "views", "comments", "description", "image", "url", "ID").orderBy("comments", "desc");

			if (rows.length > 0)
				return Promise.resolve(rows[0]);
			else
				return Promise.reject();
		} catch(err) {
			return Promise.reject(err);
		}
	}
}

module.exports = PostsDatabase;
