module.exports = {
	Rejections: {
		DontExists: Promise.reject({
			code: 1,
			message: "dont-exists"
		})
	}
};
