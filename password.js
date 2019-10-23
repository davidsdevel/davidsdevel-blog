const bcrypt = require("bcrypt");

bcrypt.hash("password", 10, (err, hash) => {
	console.log(hash);
	console.log(hash.length);
})