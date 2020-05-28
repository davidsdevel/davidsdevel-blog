const router = require("express").Router();

router
	.get("/config", async (req, res) => {
		try {
			const categories = await req.db.getCategories();
			const urlID = await req.db.getUrlID();
			const title = await req.db.getBlogTitle();
			const description = await req.db.getBlogDescription();

			res.json({categories, urlID, title, description});

		} catch(err) {
			console.error(err);
			res.status(500).send(err.toString());
		}
	})
	.post("/:action", async ({params, body, db}, res) => {
		try {
			const {action} = params;
			const {name, alias, cms, data} = body;

			switch(action) {
				case "add-category":
					res.send(await db.addCategory(name, alias));
					break;
				case "import-posts":
					if (cms === "blogger")
						await db.importPostsFromBlogger(data);
					else
						res.status(401);

					res.send("success");

					break;
				default:
					res.status(404);
					break;
			}
		} catch(err) {
			console.error(err);

			res.status(500).send(err.toString());
		}
	})
	.delete("/:action", async ({params, body, db}, res) => {
		try {
			const {action} = params;
			const {name, alias} = body;

			switch(action) {
				case "delete-category":
					res.send(await db.deleteCategory(name));
					break;
				default:
					res.status(404);
					break;
			}
		} catch(err) {
			console.error(err);

			res.status(500).send(err.toString());
		}
	})

module.exports = router;
