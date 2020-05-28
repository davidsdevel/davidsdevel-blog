const fetch = require("node_fetch");

class FacebookAPI {
	constructor(data) {
		this.appID;
		this.appSecret;
	}
	async getLongLivedAccessToken(short_live_access_token) {
		try {
			const req = await fetch(`https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${this.appID}&client_secret=${this.appSecret}&fb_exchange_token=${short_live_access_token}`);
			
			if (req.status >= 400)
				return Promise.reject("fetch-error");
			else {
				const {access_token} = await req.json();

				return Promise.resolve(access_token);
			}
		} catch(err) {
			return Promise.reject(err);
		}
	}
	async getPageAccessToken(accessToken, pageID) {
		try {
			const req = await fetch(`https://graph.facebook.com/${pageID}?fields=access_token&access_token=${accesToken}`);
			
			if (req.status >= 400)
				return Promise.reject("fetch-error");
			else {
				const {access_token} = await req.json();

				return Promise.resolve(access_token);
			}
		} catch(err) {
			return Promise.reject(err);
		}
	}
	/**
	 *
	 * Return {
	 *		data: [
	 *			{
     *				"name": "Facebook Page 1",
     *				"access_token": "{page-access-token-for-Page-1}",
     *				"id": "{page-1-id}"
     *			}
	 *		]
	 *	}
	 */
	async getUserPages(accessToken, userID) {
		try {
			const req = await fetch(`https://graph.facebook.com/${userID}/accounts?fields=name,access_token&access_token=${accesssToken}`);
			
			if (req.status >= 400)
				return Promise.reject("fetch-error");
			else {
				const {access_token} = await req.json();

				return Promise.resolve(access_token);
			}
		} catch(err) {
			return Promise.reject(err);
		}
	}
	async publishOnPage(pageAccessToken, pageID, {message, link}) {
		try {
			const req = await fetch(`https://graph.facebook.com/${pageID}/feed`, {
				method: "POST",
				body: `message=${message}${link ? "&link=" + link : ""}&access_token=${pageAccessToken}`
			});
			
			if (req.status >= 400)
				return Promise.reject("fetch-error");
			else {
				const {id} = await req.json();
				if (id)
					return Promise.resolve("success");
				else
					return Promise.reject();
			}
		} catch(err) {
			return Promise.reject(err);
		}
	}
	async schedulePost(pageAccessToken, pageID, {message, date, link}) {
		try {
			const req = await fetch(`https://graph.facebook.com/${pageID}/feed`, {
				method: "POST",
				body: `published=false&message=${message}${link ? "&link=" + link : ""}&access_token=${pageAccessToken}&scheduled_publish_time=${date}`
			});
			
			if (req.status >= 400)
				return Promise.reject("fetch-error");
			else {
				const {id} = await req.json();
				if (id)
					return Promise.resolve("success");
				else
					return Promise.reject();
			}
		} catch(err) {
			return Promise.reject(err);
		}
	}

}