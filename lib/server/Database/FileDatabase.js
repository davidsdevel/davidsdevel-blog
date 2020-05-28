const Database = require("./BlogDatabase");
const {readFileSync} = require("fs");

class FileDatabase extends Database {
	constructor(dev) {
		super(dev);
	}
	async uploadFile(type, name, mime, filepath, width) {
		try {
			var secret = "";
			for (let i = 0; i < 10; i++) {
				secret += Math.floor(Math.random() * 10);
			}
			const buffer = Buffer.from(readFileSync(filepath));

			await this.db("files").insert({
				type,
				name,
				secret,
				mime,
				buffer,
				width
			});

			return Promise.resolve({src: `/${type}/${secret}/${name}`, name, secret, width});
		} catch(err) {
			return Promise.reject(err);
		}
	}
	async getFile(secret, name) {
		try {
			const data = await this.db.where({
				name,
				secret
			}).select("buffer", "mime").from("files");

			if (data.length === 0 || !data.length)
				return Promise.reject("dont-exists");
			else
				return Promise.resolve(data[0]);
		} catch(err) {
			return Promise.reject(err);
		}
	}
	async getImages() {
		try {
			const data = await this.db.select("secret", "name", "type", "width").from("files");

			return Promise.resolve(data.reverse().map(({secret, type, name, width}) => ({
				name,
				secret,
				src: `/${type}/${secret}/${name}`,
				width
			})));
		} catch(err) {
			return Promise.reject(err);
		}
	}
	async deleteImage(name, secret) {
		try {
			await this.db("files").where({name, secret}).delete();

			return Promise.resolve({
				status: "OK"
			});
		} catch(err) {
			return Promise.reject(err);
		}
	}
}

module.exports = FileDatabase;
