const app = require("express")();

app.get("/admin", (req, res, next) => {
	return next("no-id");
}, (err, req, res) => {
	console.log(err)
}).listen(3000)