const fetch = require("isomorphic-fetch");
const {parse} = require("node-html-parser");
const convert = require('xml-js');

/*

function getPostImage(e, type) {
	const html = parse(e.content);
	const img = html.querySelector("img");

	var image = img ? img.attributes.src.replace("s640", "s1024") : undefined;
	const content = type === "post" ? e.content : html.text.slice(0, 100) + "...";
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

class Router {
	static async index({req, res}, app) {
		try {
			var queryData;
			const {page} = req.query;
			if (page) {
				queryData = await getFeedsPages(page);
			} else {
				queryData = await getFeeds();
			}
			if (!app) res.json(queryData);
		} catch(err) {
			console.error(err);
			if (!app) res.status(500).send(err);
		}
		if (app)
			return app.render(req, res, "/", queryData);
		
	}
	static async post({req, res, next}, app) {
		if (app) {
			if (!/\d\d\d\d/.test(req.params.year)) return next();
		}
				
		var queryData;
		try {
			const {year, month, title} = req.params;
			const {url} = req.query;

			var request;
			if (!app) request = await fetch(`https://www.googleapis.com/blogger/v3/blogs/7044473803573631794/posts/bypath?path=${url}.html&key=${API_KEY}&fields=published,title,content,labels,images&fetchImages=true`)
			else request = await fetch(`https://www.googleapis.com/blogger/v3/blogs/7044473803573631794/posts/bypath?path=/${year}/${month}/${title}.html&key=${API_KEY}&fields=published,title,content,labels,images&fetchImages=true`)

			const data = await request.json();

			const html = parse(data.content);
			const img = html.querySelector("img");
					
			var image = img ? img.attributes.src.replace("s640", "s1024") : undefined;
			data.image = image;
			queryData = {
				...data,
				pathname: `/${year}/${month}/${title}`
			}
			if (!app) res.json(queryData);

		} catch(err) {
			console.error(err);
			if (!app) res.status(500).send(err);
		}
		if (app) return app.render(req, res, "/post", queryData);
	}
	static async sitemap({req, res}) {
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
			console.error(err);
			res.status(500).send(err);
		}
	}
	static async feed({req, res}) {
		try {
			const preq = await fetch("https://davidsdevel.blogspot.com/atom.xml?redirect=false&start-index=1&max-results=500");
			const xml = await preq.text();
			const json = convert.xml2json(xml, {compact: true, spaces: 4});
			const parsed = JSON.parse(json);
			const feed = new Feed({
				title: "David's Devel - Blog",
				description: "JavaScript, tecnología, informática y mas JavaScript en este blog. Un simple blog de un desarrollador JavaScript Venezolano.",
				id: "https://blog.davidsdevel.com/",
				link: "https://blog.davidsdevel.com/",
				language: "es", 
				image: "https://blog.davidsdevel.com/static/images/og.jpg",
				favicon: "https://blog.davidsdevel.com/static/favicon.ico",
				copyright: "Todos los derechos reservados 2019, David's Devel",
				updated: new Date(),
				generator: "Express",
				feedLinks: {
					atom: "https://blog.davidsdevel.com/feed"
				},
				author: {
					name: "David González",
					email: "davidsdevel@gmail.com",
					link: "https://www.davidsdevel.com"
				}
			});
	
			const mapped = parsed.feed.entry.forEach(e => {
				const html = parse(e.content._text);
				const img = html.querySelector("img");
				const description = html.text.slice(0, 150) + "...";
				var image = img ? img.attributes.src.replace("s640", "s1024") : "https://blog.davidsdevel.com/static/images/og.jpg";

				const split = e.updated._text.match(/\s* /g).filter(e => e);
				const year = split[0];
				const month = split[1];
				const day = split[2];
				const hour = split[3];
				const minutes = split[4];
				const seconds = split[5];
	
				feed.addItem({
					title: e.title._text,
					id: e.link[3]._attributes.href.replace("davidsdevel.blogspot.com", "blog.davidsdevel.com").replace(/\.html$/, ""),
					link: e.link[3]._attributes.href.replace("davidsdevel.blogspot.com", "blog.davidsdevel.com").replace(/\.html$/, ""),
					description,
					content: e.content._text,
					author: [
						{
							name: "David González",
							email: "davidsdevel@gmail.com",
							link: "https://www.davidsdevel.com"
						}
					],
					contributor: [
						{
							name: "David González",
							email: "davidsdevel@gmail.com",
							link: "https://www.davidsdevel.com"
						}
					],
					date: new Date(year, month, day, hour, minutes, seconds),
					image
				});
			});

			const rss = feed.rss2();
			res.set({
				"Content-Type": "application/rss+xml; charset=UTF-8"
			})
			res.send(rss);
		} catch(err) {
			console.error(err);
			res.status(500).send(err);
		}
	}
}
*/

class Router {
	constructor(db) {
		this.db = db;
	}
	static async sitemap({req, res}) {
		try {
			const posts = await this.db.getPublishPosts();

			const mapped = posts.map(({url, updated}) => `<url><changefreq>monthly</changefreq><loc>https://blog.davidsdevel.com/${url}</loc><lastmod>${updated}</lastmod><priority>1</priority></url>`)
			
			const finalXML = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://blog.davidsdevel.com</loc><changefreq>monthly</changefreq><priority>1</priority></url><url><loc>https://blog.davidsdevel.com/search</loc><changefreq>monthly</changefreq><priority>0.2</priority></url><url><loc>https://blog.davidsdevel.com/terminos</loc><changefreq>monthly</changefreq><priority>0.6</priority></url><url><loc>https://blog.davidsdevel.com/privacidad</loc><changefreq>monthly</changefreq><priority>0.6</priority></url><url><loc>https://blog.davidsdevel.com/acerca</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>${mapped.join("")}</urlset>`
			
			res.set({
				"Content-Type": "application/xml"
			})
			res.send(finalXML);
		} catch(err) {
			console.error(err);
			res.status(500).send(err);
		}
	}
	static async feed({req, res}) {
		try {
			const posts = await this.db.getPublishPosts();

			const feed = new Feed({
				title: "David's Devel - Blog",
				description: "JavaScript, tecnología, informática y mas JavaScript en este blog. Un simple blog de un desarrollador JavaScript Venezolano.",
				id: "https://blog.davidsdevel.com/",
				link: "https://blog.davidsdevel.com/",
				language: "es", 
				image: "https://blog.davidsdevel.com/static/images/og.jpg",
				favicon: "https://blog.davidsdevel.com/static/favicon.ico",
				copyright: "Todos los derechos reservados 2019, David's Devel",
				updated: new Date(),
				generator: "Express",
				feedLinks: {
					atom: "https://blog.davidsdevel.com/feed"
				},
				author: {
					name: "David González",
					email: "davidsdevel@gmail.com",
					link: "https://www.davidsdevel.com"
				}
			});
	
			posts.forEach(({title, url, description, content, updated}) => {
	
				feed.addItem({
					title,
					id: `https://davidsdevel.blogspot.com${url}`,
					link: `https://davidsdevel.blogspot.com${url}`,
					description,
					content,
					author: [
						{
							name: "David González",
							email: "davidsdevel@gmail.com",
							link: "https://www.davidsdevel.com"
						}
					],
					contributor: [
						{
							name: "David González",
							email: "davidsdevel@gmail.com",
							link: "https://www.davidsdevel.com"
						}
					],
					date: updated,
					image
				});
			});

			const rss = feed.rss2();
			res.set({
				"Content-Type": "application/rss+xml; charset=UTF-8"
			})
			res.send(rss);
		} catch(err) {
			console.error(err);
			res.status(500).send(err);
		}
	}
}

module.exports = Router;
