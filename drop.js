const Knex = require("knex");


let db = Knex({
    client: "sqlite3",
    connection: {
		filename: "./data.db"
	}
});

async function main() {
		try {
			const rows = await db.select("ID", "title", "created", "published", "updated").from("posts");

			if (rows.length > 0)
				return Promise.resolve(rows);
			else
				return Promise.reject();
		} catch(err) {
			return Promise.reject(err);
		}
	}


main().then(e => console.log(e)).catch(err => console.error(err));