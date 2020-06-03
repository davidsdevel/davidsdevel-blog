const Database = require("./FileDatabase");
const Mail = require("../Mail");
const Notification = require("../SendNotification");

const mailer = new Mail();

class PostsDatabase extends Database {
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
				return Promise.resolve(this._filterPosts(req[0]));
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
				return Promise.resolve(this._filterPosts(req[0]));
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

				if (year == date.getFullYear() && month == date.getMonth() + 1)
					return Promise.resolve(this._filterPosts(req[0]));
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

				if (year == date.getFullYear() && month == date.getMonth() + 1 && day == date.getDate())
					return Promise.resolve(this._filterPosts(req[0]));
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
				return Promise.resolve(this._filterPosts(req[0]));
		} catch(err) {
			return Promise.reject(err);
		}
	}
	/**
	 * Filter Posts
	 *
	 * @private
	 *
	 * @param {Array} data
	 * @param {Boolean} pagination
	 * @param {String|Number} page
	 *
	 * @return {Object}
	 */
	async _filterPosts(data, pagination, page) {

		const urlID = await this.getUrlID();

		const parseEntry = e => {
			if (e.postStatus !== "published")
				return e;

			let {url, tags} = e;

			tags = tags.split(/,\s*/)

			if (urlID == 2)
				url = `${e.category}/${e.url}`;

			if (urlID == 3 || urlID == 4) {
				const date = new Date(e.published);
				if (urlID == 3)
					url = `${date.getFullYear()}/${date.getMonth() + 1}/${e.url}`;
				if (urlID == 4)
					url = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/${e.url}`;
			}

			return {
				...e,
				url,
				tags
			};
		}

		if (!Array.isArray(data))
			return parseEntry(data);

		var postData = {};

		if (pagination) {

			page = page * 10;

			var next = false;
			var prev = false;

			if (data[page + 1])
				next = true;

			if (page - 10 > 9)
				prev = true;

			data = data.slice(page-10, page);

			postData = {
				next,
				prev
			};
		}

		postData.posts = data.map(e => parseEntry(e));

		if (!postData.posts)
			postData.posts = [];

		return postData;
	}
	/**
	 * Get All Posts
	 *
	 * @description Returns an Object with all posts in DB
	 * @public
	 *
	 * @param {Boolean} pagination
	 * @param {String|Number} page
	 *
	 * @return {Promise<Object>}
	 */
	async getAllPosts(pagination, page) {
		try {
			const req = await this.db.select("*").from("posts").orderBy("created", "desc");

			return Promise.resolve(this._filterPosts(req, pagination, page));
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
	 * @param {Boolean} pagination
	 * @param {String|Number} page
	 *
	 * @return {Promise<Object>}
	 */
	async getPublishPosts(pagination, page) {
		try {
			const req = await this.db.where({postStatus: "published"}).select("*").from("posts").orderBy("published", "desc");
			return Promise.resolve(this._filterPosts(req, pagination, page));
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
	 * @param {Boolean} pagination
	 * @param {String|Number} page
	 *
	 * @return {Promise<Object>}
	 */
	async getDraftPosts(pagination, page) {
		try {
			const req = await this.db.where("postStatus", "draft").select("*").from("posts").orderBy("published", "desc");
			return Promise.resolve(this._filterPosts(req, pagination, page));
		} catch(err) {
			return Promise.reject(err);
		}
	}
	/**
	 * Search Post
	 *
	 * @description Returns an Object with all matched posts in DB
	 * @public
	 *
	 * @param {String} query
	 * @param {Boolean} pagination
	 * @param {String|Number} page
	 *
	 * @return {Promise<Object>}
	 */
	async searchPost(query, pagination, page) {
		try {
			const req = await this.db.where({postStatus: "published"}).select("*").from("posts").orderBy("published", "desc");

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
				var data;
				if (e.content) {
					data = e.content.split("<").map(ev => ev.replace(/.*>/, "")).join(" ");

					findInContent = data.match(new RegExp(query, "i")) !== null;
				}

				if (findInContent || findInTitle || findInTags || findInCategory)
					return true;
				else
					return false;
			}).map(({description, title, image, url, comments, category}) => ({description, title, image, url, comments, category}));

			return posts.length === 0 ? Promise.reject("dont-exists") : Promise.resolve(this._filterPosts(posts, pagination, page));
		} catch (err) {
			return Promise.reject(err);
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
				url !== "search"
			))
				return Promise.reject("dont-exists");

			await this.db("posts").where({url}).increment("views", 1);

			await this.db("views").insert({
				url,
				referer,
				os: userAgent.os.name,
				browser: userAgent.browser.name,
				country: "Venezuela",
				time: Date.now()
			});
			return Promise.resolve();

		} catch(err) {
			return Promise.reject(err);
		}
	}
	/**
	 * Set Comment
	 *
	 * @description Set a comment on a single post 
	 * @public
	 *
	 * @param {String} url
	 *
	 * @return {Promise}
	 */
	async setComment(url) {
		try {
			await this.db("posts").where({url}).increment("comments", 1);
			return Promise.resolve();
		} catch(err) {
			return Promise.reject(err);
		}
	}
	/**
	 * Publish Post
	 *
	 * @description Publish a Posts into DB
	 * @public
	 *
	 * @param {Object} data
	 *
	 * @return {Promise<Number>}
	 *
	 */
	async publishPost(data) {
		try {

			var id;
			if (data.ID === "undefined" || data.ID === undefined) {
				data = {
					...data,
					comments: 0,
					updated: Date.now(),
					created: Date.now(),
					published: Date.now(),
					views: 0,
					postStatus: "published"
				};

				delete data.ID;

				const res = await this.db("posts").insert(data, "ID");

				id = res[0];
			}
			else {
				if (data.postStatus === "draft")
					data = {
						...data,
						updated: Date.now(),
						published: Date.now(),
						postStatus: "published"
					};
				else
					data = {
						...data,
						updated: Date.now(),
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
	/**
	 * Save Post
	 *
	 * @description Save a Posts into DB
	 * @public
	 *
	 * @param {Object} data
	 *
	 * @return {Promise<Number>}
	 *
	 */
	async savePost(data) {
		try {
			var id;
			if (data.ID === "undefined") {
				data = {
					...data,
					comments: 0,
					created: Date.now(),
					views: 0,
					postStatus: "draft"
				};
				delete data.ID;
				const res = await this.db("posts").returning("ID").insert(data);

				id = res;
			}
			else {
				data = {
					...data,
					postStatus: "draft"
				};
				await this.db("posts").where("ID", data.ID).update(data);

				id = data.ID;
			}
			return Promise.resolve(id);
		} catch(err) {
			return Promise.reject(err);
		}
	}
	async deletePost(ID, url) {
		try {
			await this.db("posts").where({ID}).delete();
			await this.db("views").where({url}).delete();

			return Promise.resolve({
				status: "OK"
			});
		} catch(err) {
			return Promise.reject(err);
		}
	}
	async getMostViewed() {
		try {
			const rows = await this.db("posts").where({postStatus: "published"}).select("*").orderBy("views", "desc");

			if (rows.length > 0)
				return Promise.resolve(this._filterPosts(rows[0]));
			else
				return Promise.resolve({});
		} catch(err) {
			return Promise.reject(err);
		}
	}
	async getMostCommented() {
		try {
			const rows = await this.db("posts").where({postStatus: "published"}).select("*").orderBy("comments", "desc");

			if (rows.length > 0)
				return Promise.resolve(this._filterPosts(rows[0]));
			else
				return Promise.reject();
		} catch(err) {
			return Promise.reject(err);
		}
	}
}

module.exports = PostsDatabase;
