const Knex = require("knex");
const convert = require("xml-js");

class BlogDatabase {
	constructor(dev) {
		var client = dev ? "sqlite3" : "pg";
		var knexConfig;

		if (dev) {
			knexConfig = {
				client,
				connection: {
					filename: "./data.db"
				},
				useNullAsDefault: true
			}
		} else {
			knexConfig = {
				client,
				connection: process.env.DATABASE_URL
			}
		}

		this.db = Knex(knexConfig);
		this.jobs = {};
		this.client = client;
	}
	async addCategory(name, alias) {
		try {
			const rows = await this.db.select("*").from("blog").where({key:"categories"});

			if (rows.length === 0) {
				await this.db("blog").insert({
					key: "categories",
					value: JSON.stringify([{name, alias}])
				});
			} else {
				let data = JSON.parse(rows[0].value);

				data.push({name, alias});

				await this.db("blog").update({
					value: JSON.stringify(data)
				}).where({key: "categories"});
			}
			return Promise.resolve("success");
		} catch(err) {
			console.error(err);
			return Promise.reject(err);
		}
	}
	async deleteCategory(name) {
		try {
			const rows = await this.db.select("*").from("blog").where({key:"categories"});

			if (rows.length === 0) {
				return Promise.reject("no-categories");
			} else {
				let data = JSON.parse(rows[0].value);

				data = data.filter(e => e.name !== name);

				await this.db("blog").update({
					value: JSON.stringify(data)
				}).where({key: "categories"});
			}

			return Promise.resolve("success");
		} catch(err) {
			console.error(err);
			return Promise.reject(err);
		}
	}
	async getCategories() {
		try {
			const rows = await this.db.select("*").from("blog").where({key: "categories"});

			if (rows.length === 0)
				return Promise.resolve({});
			else
				return Promise.resolve(JSON.parse(rows[0].value));
		} catch(err) {
			return Promise.reject(err);
		}
	}
	importPostsFromJson(data) {
		return new Promise((resolve, reject) => {
			data.forEach(async (e) => {
				try {
					const rows = await this.db('posts').select("*").where('url', e.url || "").orWhere("title", e.title).orWhere("published", e.published);

    				if (rows.length === 0)
            			await this.db('posts').insert(e);

				} catch(err) {
					console.log(err);
					reject(err);
				}
			});
			resolve();
		});
	}
	async importPostsFromBlogger(xml) {
		try {
			const data = convert.xml2js(xml, {compact: true});

			const promises = data.feed.entry.map(async e => {
				if (!/\.post-/.test(e.id._text))
					return undefined;

				var tags = [];
				var url = null;
				var image = null;

				if (Array.isArray(e.category))
					tags = e.category
						.map(cat => /https?:\/\/schemas\.google\.com\//.test(cat._attributes.scheme) ? [] : cat._attributes.term.replace(/,/g, ""))
						.filter(a => a);

				e.link.forEach(link => {
					if (link._attributes.rel === "alternate")
						url = link._attributes.href.replace(/https?:\/\/\w*\.blogspot\.com(\/\d*)*\//, "").replace(".html", "");
				});

				if (e.content) {
					if (e.content._text) {
						let match = e.content._text.match(/<img.*=.*\/><\/a/);

						if (match) {
							let matchImage = convert.xml2js(match[0].split("/></a")[0] + "/>");
							image = matchImage.elements[0].attributes.src;
						}
					}
				}

				var data = {
					title: e.title._text,
					image,
					comments: 0,
					views: 0,
					published: !e["app:control"] ? new Date(e.published._text) : null,
					created: new Date(e.published._text),
					updated: new Date(e.updated._text),
					content: e.content._text || null,
					tags: tags.join(", "),
					url,
					postStatus: !e["app:control"] ? "imported" : "draft"
				};

				const rows = await this.db.where({created: new Date(e.published._text)}).orWhere({title: e.title._text || ""}).orWhere({url: url || ""}).select("title").from("posts");

				if (rows.length === 0)
					return this.db("posts").insert(data);
				else
					return null;
			});

			return Promise.all(promises);
		} catch(err) {
			console.log(err);
			return Promise.reject(err);
		}
	}

	async getStats() {
		try {
			var general = {
				hours: {},
				days: {},
				locations: {},
				os: {},
				browsers: {},
				origins: {},
				subscriptors: 0
			};

			const views = await this.db("views").select("*");
			if (views.length === 0)
				return Promise.resolve({});

			var posts = await this.db("posts").where({postStatus: "published"}).select("views", "image", "comments", "url", "title", "tags", "description");
			const users = await this.db("users").select("email");

			views.forEach(({time, url, referer, os, browser, country}) => {
				let urlRegExp = /https?:\/\/(\w*\.)*\w*/;
				//Set General Time Views
				if (typeof time === "string")
					time = new Date(time);

				let hour = time.getHours();

				if (hour < 12)
					hour = `${hour}AM`;
				else if (hour === 12)
					hour = `${hour}M`;
				else if (hour > 12)
					hour = `${hour - 12}PM`;
				else if (hour === 0)
					hour = "12AM";

				let origin = urlRegExp.test(referer) ? referer.match(urlRegExp)[0] : "desconocido";

				let dayIndex = time.getDay();

				let day;

				switch(dayIndex) {
					case 0:
						day = "Domingo";
						break;
					case 1:
						day = "Lunes";
						break;
					case 2:
						day = "Martes";
						break;
					case 3:
						day = "Miercoles";
						break;
					case 4:
						day = "Jueves";
						break;
					case 5:
						day = "Viernes";
						break;
					case 6:
						day = "Sábado";
						break;
				}

				let generalHour = general.hours[hour];
				let generalLocation = general.locations[country];
				let generalOS = general.os[os];
				let generalOrigin = general.origins[referer];
				let generalBrowser = general.browsers[browser];
				let generalDay = general.days[day];

				if (!generalHour)
					general.hours[hour] = 1;
				else
					general.hours[hour] = generalHour + 1;

				//Set General Location Views

				if (!generalLocation)
					general.locations[country] = 1;
				else
					general.locations[country] = generalLocation + 1;

				//Set General OS Views

				if (!generalOS)
					general.os[os] = 1;
				else
					general.os[os] = generalOS + 1;

				if (!generalBrowser)
					general.browsers[browser] = 1;
				else
					general.browsers[browser] = generalBrowser + 1;

				//Set General Origin Views

				if (!generalOrigin)
					general.origins[origin] = 1;
				else
					general.origins[origin] = generalOrigin + 1;

				//Set General Day Views
				if (!generalDay)
					general.days[day] = 1;
				else
					general.days[day] = generalDay + 1;
			});
			users.forEach(({email}) => {
				let subscriptors = general.subscriptors;

				if (email)
					general.subscriptors = subscriptors + 1;
			});

			const mostView = await this.getMostViewed();
			const mostCommented = await this.getMostCommented();

			return Promise.resolve({
				general,
				posts,
				mostView,
				mostCommented
			});
		} catch(err) {
			console.error(err);
			return Promise.reject(err);
		}
	}
	async getUrlID() {
		try {
			const rows = await this.db.select("value").from("blog").where({key: "url"});

			return Promise.resolve(rows[0].value);
		} catch(err) {
			return Promise.reject(err);
		}
	}
	async getBlogTitle() {
		try {
			const rows = await this.db.select("value").from("blog").where({key: "title"});

			return Promise.resolve(rows[0].value);
		} catch(err) {
			return Promise.reject(err);
		}
	}
	async getBlogDescription() {
		try {
			const rows = await this.db.select("value").from("blog").where({key: "description"});

			return Promise.resolve(rows[0].value);
		} catch(err) {
			return Promise.reject(err);
		}
	}
}

module.exports = BlogDatabase;
