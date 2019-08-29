const {Feed} = require("feed");
const server = require("express")();
const fetch = require("isomorphic-fetch");
const convert = require('xml-js');
const {parse} = require("node-html-parser");

server
	.get("/feed", async (req, res) => {
		try {
			const preq = await fetch("https://davidsdevel.blogspot.com/atom.xml?redirect=false&start-index=1&max-results=500");
			const xml = await preq.text();
			const json = convert.xml2json(xml, {compact: true, spaces: 4});
			const parsed = JSON.parse(json);
			const feed = new Feed({
				title: "David's Devel - Blog",
				description: "JavaScript, tecnología, informática y mas JavaScript en este blog. Un simple blog de un desarrollador JavaScript Venezolano.",
				id: "http://blog.davidsdevel.com/",
				link: "http://blog.davidsdevel.com/",
				language: "es", 
				image: "http://blog.davidsdevel.com/static/images/og.jpg",
				favicon: "http://blog.davidsdevel.com/static/favicon.ico",
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

				const split = e.updated._text.match(/\s*/g).filter(e => e);
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
			console.log(err);
			res.status(500).send(err);
		}
	})
	.listen(2001, () => console.log("listen"));