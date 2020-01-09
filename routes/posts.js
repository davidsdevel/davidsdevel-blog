const router = require("express").Router();

router
	.get("/:action", async (req, res) => {
		try {
			const {action} = req.params;
			const {page, url, referer, fields, ID, category} = req.query;

			var data;

			switch(action) {
			case "all":
				data = await req.posts.all(page);
				break;
			case "all-edit":
				data = await req.posts.allEdit();
				break;
			case "single":
				data = await req.posts.single(category, url);
				break;
			case "single-edit":
				data = await req.posts.singleEdit(ID);
				break;
			case "set-view":
				if (req.session.adminAuth)
					return res.send("success");

				try {
					await req.posts.setView(url, referer, req.userAgent);
				} catch(err) {
					if (err === "dont-exists")
						return res.status(404).send(err);
					else
						return res.status(500).send(err);
				}

				return res.send("success");
			case "most-viewed":
				data = await req.db.getMostViewed();
				break;
			case "search":
				break;
			default: break;
			}

			if (fields) {
				const parse = postData => {
					var newData = {};

					const parsedFields = fields.split(",");

					Object.entries(postData).forEach(e => {
						for (let i = 0; i < parsedFields.length; i++) {
							if (e[0] === parsedFields[i]) {
								newData[e[0]] = e[1];
							}
						}
					});
					return newData;
				}
				if (action === "all-edit" ||
					action === "all" ||
					action === "find" ||
					action === "category" ||
					action === "category-edit"
				)
					data = {
						...data,
						posts: data.posts.map(e => parse(e))
					};

				else
					data = parse(data);
			}
			res.json(data);
		} catch(err) {
			console.error(err);
			if (err === "dont-exists")
				res.status(404).send(err);
			else
				res.status(500).send(err);
		}
	})
	.delete("/:action", async (req, res) => {
		try {
			const {action} = req.params;
			const {ID} = req.body;

			switch(action) {
				case "delete":
					res.json(await req.db.deletePost(ID));
					break;
				default:
					res.sendStatus(404);
					break;
			}
		} catch(err) {
			res.status(500).send(err.toString());
		}
	})
	.post("/:action", async (req, res) => {
		try {
			const {action} = req.params;
			var id;
			if (action === "publish") {
				id = await req.db.publishPost(req.body);
			} else if (action === "save") {
				id = await req.db.savePost(req.body);
			}

			res.status(200).send(id.toString());
		} catch(err) {
			console.error(err)
			res.status(500).send(err);
		}
	});

module.exports = router;
