const router = require("express").Router();

router
	.get("/:action", async (req, res) => {
		try {
			const {action} = req.params;
			const {name, lastname, email} = req.query;
			switch (action) {
				case "check-username":
					res.json(await req.db.checkUsername(name, lastname));
					break;
				case "check-email":
					res.json(await req.db.checkEmail(email));
					break;
				default:
					// code...
					break;
			}
		} catch(err) {
			console.error(err);
			res.status(500).send(err.toString());
		}
	})
	.post("/:action", async (req, res) => {
		const {action} = req.params;
		const {token, name, lastname, email, feed, ID} = req.body;

		try {
			switch(action) {
				case "add-fcm-token":
					await req.db.addFCMToken(token, ID);
					res.json({
						status: "OK"
					});
					break;
				case "create-user":
					res.json(await req.db.createUser(name, lastname, email, feed, token));
					break;
				default:
					return res.status(404);
			}
		} catch(err) {
			res.status(500);
		}
	})

module.exports = router;