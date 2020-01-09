const router = require("express").Router();

router
	.get("/categories", async (req, res) => {
		try {
			res.json(["development"]);
		} catch(err) {
			console.error(err);
			res.status(500).send(err.toString());
		}
	})
	.post("/import-posts", async (req, res) => {
		if (!req.headers["auth"] === "C@mila") {
			res.status(401).send("no-auth");
		}
		else {
			const {cms, data} = req.body;
			try {
				switch(cms) {
					case "blogger":
						await req.db.importPostsFromBlogger(data);
						res.json("success");
					break;
					default:
						res.status(401);
						break;
				}
			} catch(err) {
				console.log(err);
				res.status(500).send(err.toString());
			}
		}
	})

module.exports = router;
