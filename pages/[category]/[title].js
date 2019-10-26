import React, {Component} from "react";
import Head from "../../components/postHead";
import Nav from "../../components/nav";
import Footer from '../../components/index/footer';
import Share from '../../components/post/share';
import About from '../../components/post/about';
import Link from "next/link";
import {setBanner} from "../../lib/banners";
import fetch from "isomorphic-fetch";

class Post extends Component {
	static async getInitialProps({query, req, asPath}) {
		try {
			var origin;
			var referer;

			if (req) {
				origin = req.headers["host"];
				referer = req.headers.referer;
			}
			else {
				origin = location.host;
				referer = "https://blog.davidsdevel.com";
			}

			const r = await fetch(`${origin.match(/localhost|127\.0\.0\.1|::1/) !== null ? "http:" : "https:"}//${origin}/posts/single?url=${query.category}/${query.title}&fields=image,content,title,tags,updated,description,category`);

			query = await r.json();

			query = {
				...query,
				pathname: asPath,
				referer: encodeURI(referer),
				viewUrl: asPath.slice(1),
			}

			return query;
		} catch(err) {
			console.log(err);
		}
	}
	async componentDidMount() {
		try {
			const req = await fetch(`/set-view?url=${this.props.viewUrl}&referer=${this.props.referer}`);
			await req.text();
		} catch(err) {
			console.error(err);
		}

		initializeFB();

		let lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
		let active = false;

		const lazyLoad = () => {
			if (active === false) {
				active = true;
		
				setTimeout(() => {
					lazyImages.forEach(lazyImage => {
						if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {
							lazyImage.src = lazyImage.dataset.src;
							
							setTimeout(() => lazyImage.classList.remove("lazy"), 1000);
		
							lazyImages = lazyImages.filter(function(image) {
								return image !== lazyImage;
							});
		
							if (lazyImages.length === 0) {
								document.removeEventListener("scroll", lazyLoad);
								window.removeEventListener("resize", lazyLoad);
								window.removeEventListener("orientationchange", lazyLoad);
							}
						}
					});
					active = false;
				}, 200);
			}
		};
		
		document.addEventListener("scroll", lazyLoad);
		window.addEventListener("resize", lazyLoad);
		window.addEventListener("orientationchange", lazyLoad);
	}
	render() {
		const {pathname, image, content, title, tags, updated, description, category} = this.props;

		return <div>
			<Head url={pathname} category={category} published={updated} title={title} tags={tags} image={image} description={description}/>
			<Nav/>
			<header>
				<div id="header-shadow">
					<h1>{title}</h1>
				</div>
				<img src="/static/images/davidsdevel-rombo.png"/>
			</header>
			<div>
				<div className="banner-container">
				  {setBanner()}
				</div>
				<main dangerouslySetInnerHTML={{__html: content}}/>
				<aside>
					<a href="https://share.payoneer.com/nav/8KWKN89znbmVoxDtLaDPDhoy-Hh5_0TAHI8v5anfhDJ6wN3NOMMU3rpV5jk6FSfq9t5YNnTcg-XSxqiV1k7lwA2" target="_blank" onClick={() => FB.AppEvent.logEvent("Click on Payoneer Banner")}>
					  <img src="/static/images/payoneer.png" />
					</a>
					<a href="https://platzi.com/r/davidsdevel/" target="_blank" onClick={() => FB.AppEvent.logEvent("Click on Platzi Banner")}>
					  <img src="/static/images/platzi.png" />
					</a>
				</aside>
			</div>
			<ul id="tags">
				{tags.map(e => (
					<li  key={`tag-${e}`}>
						<Link href={`/search?q=${e}`}>
							<a>{e}</a>
						</Link>
					</li>
				))}
			</ul>
			<Share url={pathname} title={title}/>
			<div className="banner-container">
				{setBanner()}
			</div>
			<About/>
			<h4>Comentarios</h4>
			<div id="comments-container" dangerouslySetInnerHTML={{__html: `<div
			 class="fb-comments"
			 data-href="https://blog.davidsdevel.com${pathname}"
			 data-width="100%"
			 data-numposts="20"
			></div>`}}/>
			<Footer/>
			<script src='https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js?skin=sunburst'/>
			<style jsx>{`
				header {
					background-image: url(${image});
					height: 600px;
					width: 100%;
					background-position: center;
					background-size: cover;
					overflow: hidden;
				}
				header img {
					position: absolute;
					width: 30%;
					top: 100px;
					left: 35%;
				}
				h1 {
					color: white;
					width: 90%;
					margin: 300px auto 0;
					text-align: center;
				}
				header #header-shadow {
					overflow: hidden;
					width: 100%;
					height: 100%;
					background: rgba(0, 0, 0, .5)
				}
				main {
					padding: 0 5%;
					margin-bottom: 20px;
				}
				#tags {
					margin: 0 0 20px;
					padding: 0 0 0 5%;
				}
				#tags li {
					font-size: 12px;
					margin: 5px 0;
				}
				.banner-container {
					margin 50px 0;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				#comments-container {
					width: 90%;
					margin: auto;
				}
				aside {
					display: none;
				}
				@media screen and (min-width: 720px) {
					main {
						width: 60%;
						display: inline-block;
					}
					aside {
            			float: right;
            			margin-right: 5%;
            			display: flex;
            			justify-content: center;
            			float: right;
            			flex-direction: column;
            			margin-top: 50px;
            		}
					aside a {
						display: block;
					}
					header img {
						position: absolute;
						width: 20%;
						top: 100px;
						left: 40%;
					}
					#comments-container {
						width: 60%;
					}
				}
				@media screen and (min-width: 960px) {
					header img {
						width: 10%;
						top: 200px;
						left: 45%;
					}
					h1 {
						margin: 400px auto 0;
					}
				}
			`}</style>
			<style global jsx>{`
				h1, h2, h3, h4 {
					text-align: center;
					margin: 30px 0 50px;
				}
				b {
					color: black;
				}
				main img {
					max-width: calc(100% - 32px);
					height: auto;
				}
				main img.lazy {
					filter: blur(8px)
				}
				main ul {
					padding: 0 0 0 20px;
					margin: 10px 0;
				}
				main ul li {
					margin: 5px 0;
					list-style: initial;
				}
				blockquote {
					font-style: italic;
					color: gray;
					font-size: 18px;
					margin: 15px auto;
				}
				@media screen and (min-width: 960px) {
					blockquote {
						font-size: 24px;
					}
				}
			`}</style>
		</div>
	}
}
export default Post;
