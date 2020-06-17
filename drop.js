const Knex = require("knex");


let db = Knex({
	client: "mysql",
	connection: {
		user: "root",
		server: "127.0.0.1",
		port:"3306",
		password: "",
		database: "blog"
	},
	useNullAsDefault: true
});

async function main() {
	try {
		const rows = await db.truncate("posts");

		if (rows.length > 0)
			return Promise.resolve(rows);
		else
			return Promise.reject();
	} catch(err) {
		return Promise.reject(err);
	}
}


main().then(e => console.log(e)).catch(err => console.error(err));
