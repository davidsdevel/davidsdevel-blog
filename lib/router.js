const fetch = require("isomorphic-fetch");
const {parse} = require("node-html-parser");
const convert = require('xml-js');

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
				updated: Date.now(),
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
