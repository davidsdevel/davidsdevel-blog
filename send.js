const fetch = require("isomorphic-fetch");

fetch("https://fcm.googleapis.com/fcm/send", {
	method: "POST",
	headers: {
		Authorization: "key=AAAAJv0rZbw:APA91bGnaLO5-hPfN45LNH1xhvwUbjHHinhk-N4nA4jf1ylEyBNmvEiv2m9XAfok52CFTeKgQ7B5yC30MT8IjHtsbhfKDqZ7fcbj7MlVKZfJkafvh2pa3vuHaCHLWhaf62NW3dTfQ-R6",
		"Content-Type": "application/json"
	},
	body: JSON.stringify({
		notification: {
			title: "Portugal vs. Denmark",
			body: "5 to 1",
			icon: "/static/images/davidsdevel-black.png",
			click_action: "http://localhost:8081"
		},
		to: "cZH4p4ccCeg:APA91bFZLfQioCyTYB-62W-jxkRaz68VtRiXX73ixLE2T-T14DcTODqaRtsEIcYQL3l2ePA7wGOUpfat-hzZCau6WH2Gh1aIugyzixdfnG5VE2mNCuqeHTasMjiMW3aTTXRsdxCWPKme"
	})
})
	.then(req => req.json())
	.then(data => console.log(data));
