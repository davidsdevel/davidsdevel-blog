//const bcrypt = require("bcrypt");
const Database = require("./UsersDatabase");

class DB extends Database {
	/**
	 * Init
	 * 
	 * @public
	 *
	 * @return {Promise}
	 */
	async init() {
		try {
			const promisesArray = [];

			const existsBlog = await this.db.schema.hasTable("blog");
			const existsPosts = await this.db.schema.hasTable("posts");
			const existsUsers = await this.db.schema.hasTable("users");
			const existsViews = await this.db.schema.hasTable("views");
			const existsFiles = await this.db.schema.hasTable("files");

			if (!existsBlog) {

				promisesArray.push(this.db.schema.createTable("blog", table => {
					table.string("key").unique();
					table.text("value");
				}));

				promisesArray.push(this.db("blog").insert({key: "url", value: "1"}));
				promisesArray.push(this.db("blog").insert({key: "categories", value: "[]"}));
				promisesArray.push(this.db("blog").insert({key: "title", value: "Nuevo Blog de Ejemplo"}));
				promisesArray.push(this.db("blog").insert({key: "description", value: "Este se supone que es la descripción de tu blog"}));
			}

			if (!existsPosts)
				promisesArray.push(this.db.schema.createTable("posts", table => {
					table.increments("ID").primary();
					table.string("title");
					table.text("description");
					table.text("tags");
					table.string("category");
					table.text("content");
					table.integer("comments").defaultTo(0);
					table.dateTime("created");
					table.dateTime("published");
					table.dateTime("updated");
					table.string("postStatus");
					table.string("image");
					table.string("url");
					table.integer("views").defaultTo(0);
				}));

			if (!existsUsers)
				promisesArray.push(this.db.schema.createTable("users", table => {
					table.increments("ID").primary();
					table.string("name");
					table.string("lastname");
					table.string("email").unique();
					table.string("feed");
					table.string("fcmToken");
					table.boolean("verified").defaultTo(false);
				}));

			if (!existsViews)
				promisesArray.push(this.db.schema.createTable("views", table => {
					table.string("url");
					table.string("referer");
					table.string("os");
					table.string("browser");
					table.string("country");
					table.dateTime("time");
				}));

			if (!existsFiles)
				promisesArray.push(this.db.schema.createTable("files", table => {
					table.string("name");
					table.string("type");
					table.string("secret");
					table.string("mime");
					table.string("width", 4);

					if (this.client === "mysql")
						table.specificType("buffer", "mediumblob");
					else
						table.binary("buffer");
				}));
			
			return Promise.all(promisesArray);
		} catch(err) {
			console.error(err);
			return Promise.reject(err);
		}
	}
}

module.exports = DB;
