const renderPost = () => {
	return async function(req, res, next) {
		switch(req.params.title) {
		case "feed":
		case "terminos":
		case "privacidad":
		case "search":
		case "acerca":
		case "resize-image":
		case "admin":
		case "logout":
		case "fb-webhook":
		case "favicon.ico":
		case "touch-icon.png":
			return next(false);

		default: break;
		}

		if (/.*\.\w\w*$/ig.test(req.url) || /^_|webpack|next|react-refresh|main\.js/.test(req.params.title))
			return next(false);

		try {
			const {title, year, month, day, category} = req.params;

			var ID = await req.db.getUrlID();
			var data;
			var url = title;

			if (ID == "1")
				data = await req.db.getPostByTitle(url);

			if (ID == "2") {
				if (!category)
					return next(false);

				data = await req.db.getPostByCategory(category, url);
				url = `${category}/${url}`;
			}
			if (ID == "3") {
				if (day)
					return next(false);

				data = await req.db.getPostByYearMonth(year, month, url);
				url = `${year}/${month}/${url}`;
			}
			if (ID == "4") {
				if (!day)
					return next(false);

				data = await req.db.getPostByYearMonthDay(year, month, day, url);
				url = `${year}/${month}/${day}/${url}`;
			}

			req.data = {
				...data,
				url
			};
			req.urlID = ID;

			next(true);
		} catch(err) {
			console.log(err);

			if (err === "dont-exists")
				return next(false);

		}
	};
};

module.exports = {
	renderPost
};
