const express = require('express');
const next = require('next');
const fetch = require("isomorphic-fetch");
const {parse} = require("node-html-parser");
const convert = require('xml-js');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();
const PORT = process.env.PORT || 3000;
const API_KEY = "AIzaSyD9FkcifZlREnl8pdaRZN5YTq8ZtEFK-Qs";
const BLOG_URL = `https://www.googleapis.com/blogger/v3/blogs/7044473803573631794?key=${API_KEY}`;
const POST_URL = `https://www.googleapis.com/blogger/v3/blogs/7044473803573631794/posts?key=${API_KEY}`;
const SEARCH_URL = `https://www.googleapis.com/blogger/v3/blogs/7044473803573631794/posts/search?&key=${API_KEY}`;

function getPostImage(e, type) {
	const html = parse(e.content);
	const img = html.querySelector("img");

	var image = img ? img.rawAttrs.match(/src=".*(\\.*)*\.\w*/)[0].replace("src=\"", "") : undefined;
	const content = type === "post" ? e.content : e.content.replace(/<\w*\s*(\w*(-\w*)*=".*"\s*)*\/*>|<\/\w*>/g, "").slice(0, 100)+"...";
	return {
		...e,
		content,
		image
	}
}
function getFeeds() {
	return new Promise(async (resolve, reject) => {
		try {

			const postsReq = await fetch(`${POST_URL}&fields=items(published,url,title,content,labels)`);
			var data = await postsReq.json();
			const blogReq = await fetch(`${BLOG_URL}&fields=posts/totalItems`);
			const {posts} = await blogReq.json();

			data.items = data.items.map(e => getPostImage(e, "feed"));
			resolve({
				...data,
				totalItems: posts.totalItems
			});
		} catch(err) {
			reject(err);
		}
	})
}
function getFeedsPages(page) {
	return new Promise(async (resolve, reject) => {
		try {

			const request = await fetch(`${POST_URL}&fields=nextPageToken`);
			const data = await request.json();

			var token = data.nextPageToken;
			const pageNum = parseInt(page);
			if (pageNum > 2) {
				for (let i = 1; i <= pageNum; i++) {
					const r = await fetch(`${POST_URL}&fields=nextPageToken&pageToken=${token}`);
					const d = await r.json();
					token = d.nextPageToken;
				}
			}
			const postsReq = await fetch(`${POST_URL}&fields=items(published,url,title,content,labels)&pageToken=${token}`);
			const postData = await postsReq.json();
			const blogReq = await fetch(`${BLOG_URL}&fields=posts/totalItems`)
			const {posts} = await blogReq.json();

			postData.items = postData.items.map(e => getPostImage(e, "feed"));

			resolve({
				...postData,
				totalItems: posts.totalItems
			});
		} catch(err) {
			reject(err);
		}
	})
}
async function Init() {
	try {
		console.log("Preparing...");

		await app.prepare();
		console.log("Prepared");

		server
		/*--------ROUTES------------*/
		.get("/", async (req, res) => {
			try {

				var queryData;
				const {page} = req.query;
				if (page) {
					queryData = await getFeedsPages(page);
				} else {
					queryData = await getFeeds();
				}
			} catch(err) {
				console.log(err);
			}
			return app.render(req, res, "/", queryData);
		})
		.get("/:year/:month/:title", async (req, res, next) => {

			if (!/\d\d\d\d/.test(req.params.year)) return next();
			
			var queryData;
			try {
				const {year, month, title} = req.params;
				const request = await fetch(`https://www.googleapis.com/blogger/v3/blogs/7044473803573631794/posts/bypath?path=/${year}/${month}/${title}.html&key=${API_KEY}&fields=published,title,content,labels,images&fetchImages=true`)
				const data = await request.json();

				const html = parse(data.content);
				const img = html.querySelector("img");
				
				var image = img ? img.rawAttrs.match(/src=".*(\\.*)*\.\w*/)[0].replace("src=\"", "") : undefined;
				data.image = image;
				queryData = {
					...data,
					pathname: `/${year}/${month}/${title}`
				}
			} catch(err) {
				console.log(err);
			}
			return app.render(req, res, "/post", queryData);
		})

		/*-------FILES----------*/
		.get("/manifest.json", (req, res) => {
			res.json({
				gcm_sender_id: "103953800507"
			})
		})
		.get("/sitemap.xml", async (req, res) => {
			try {
				const preq = await fetch("https://davidsdevel.blogspot.com/atom.xml?redirect=false&start-index=1&max-results=500");
				const xml = await preq.text();
				const json = convert.xml2json(xml, {compact: true, spaces: 4});
				const parsed = JSON.parse(json);
				const mapped = parsed.feed.entry.map(({title, link, updated}) => {
					return `<url><changefreq>monthly</changefreq><loc>${link[3]._attributes.href.replace("davidsdevel.blogspot.com", "blog.davidsdevel.com").replace(/\.html$/, "")}</loc><lastmod>${updated._text}</lastmod><priority>1</priority></url>`;
				});
				const finalXML = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://blog.davidsdevel.com</loc><changefreq>monthly</changefreq><priority>1</priority></url><url><loc>https://blog.davidsdevel.com/search</loc><changefreq>monthly</changefreq><priority>0.2</priority></url><url><loc>https://blog.davidsdevel.com/terminos</loc><changefreq>monthly</changefreq><priority>0.6</priority></url><url><loc>https://blog.davidsdevel.com/privacidad</loc><changefreq>monthly</changefreq><priority>0.6</priority></url><url><loc>https://blog.davidsdevel.com/acerca</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>${mapped.join("")}</urlset>`
				res.set({
					"Content-Type": "application/xml"
				})
				res.send(finalXML);
			} catch(err) {
				res.status(500).send(err);
			}
		})
		.get("/robots.txt", (req, res) => {
			res.set({
				"Content-Type": "text/plain"
			})
			res.send(`User-agent: *
Disallow: /privacidad
Disallow: /terminos
Disallow: /search

Allow: /

Sitemap: https://blog.davidsdevel.com/sitemap.xml
`)
		})

		/*----------API----------*/
		.get("/client-posts", async ({query}, res) => {
			try {

				var queryData;
				const {page} = query;
				if (page) {
					queryData = await getFeedsPages(page);
				} else {
					queryData = await getFeeds();
				}
			} catch(err) {
				console.log(err);
			}
			res.json(queryData);
		})
		.get("/client-single-post", async ({query}, res) => {
			const {url} = query;

			var queryData;
			try {
				const request = await fetch(`https://www.googleapis.com/blogger/v3/blogs/7044473803573631794/posts/bypath?path=/${year}/${month}/${title}.html&key=${API_KEY}&fields=published,title,content,labels,images&fetchImages=true`)
				const data = await request.json();

				const html = parse(data.content);
				const img = html.querySelector("img");
				
				var image = img ? img.rawAttrs.match(/src=".*(\\.*)*\.\w*/)[0].replace("src=\"", "") : undefined;
				data.image = image;
				queryData = {
					...data,
					pathname: `/${year}/${month}/${title}`
				}
			} catch(err) {
				console.log(err);
			}
			res.json(queryData);
		})
		.get("/find-post", async ({query}, res) => {
			try {
				const {q, pageToken} = query;
				var searchRequest;
				if (pageToken)
					searchRequest = await fetch(`${SEARCH_URL}&q=${q}&pageToken=${pageToken}`);
				else
					searchRequest = await fetch(`${SEARCH_URL}&q=${q}`);

				const data = await searchRequest.json();

				data.items = data.items.map(e => getPostImage(e, "feed"));

				res.json(data);
			} catch(err) {
				console.log(err);
			}
		})
		.get("*", (req, res) => handle(req, res))
		.listen(PORT, err => {
			if (err) throw new Error(err);
			console.log(`> App Listen on Port: ${PORT}`);
		});

	} catch(err) {
		throw new Error(err);
	}
}

Init();

/*
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
		to: "YOUR-IID-TOKEN"
	})
})

POST /fcm/send HTTP/1.1
Host: fcm.googleapis.com
Authorization: key=AAAAJv0rZbw:APA91bGnaLO5-hPfN45LNH1xhvwUbjHHinhk-N4nA4jf1ylEyBNmvEiv2m9XAfok52CFTeKgQ7B5yC30MT8IjHtsbhfKDqZ7fcbj7MlVKZfJkafvh2pa3vuHaCHLWhaf62NW3dTfQ-R6
Content-Type: application/json

{
  "notification": {
    "title": "Portugal vs. Denmark",
    "body": "5 to 1",
    "icon": "firebase-logo.png",
    "click_action": "http://localhost:8081"
  },
  "to": "YOUR-IID-TOKEN"
}

Par de claves FCM: BALgWQbVzq62qWHC0CCmJqV7sPgljfaoT0NaYNKV3kHF48ZVLPRAQb-aTquSbCtAuqgPBf4w2SUsrE7FY2ILefY

manifest.json: {
  "gcm_sender_id": "103953800507"
}
*/