import React, {Component} from "react";
import Link from "next/link";
import Router from "next/router";
import {string} from "prop-types";
import Share from "./shareCard";

class Card extends Component  {
	constructor() {
		super();
		this.state = {
			shareDisplay: "none",
			shareOpacity: 0,
			savedPostsIDs: [],
			isSaving: false
		};

		this.toggleShare = this.toggleShare.bind(this);
		this.savePost = this.savePost.bind(this);
		this.toggleShare = this.toggleShare.bind(this);
	}
	async savePost(ID) {
		try {
			this.setState({
				isSaving: true
			});

			var savedPosts = [];
			var ids =  [];

			if (localStorage["saved-posts"])
				savedPosts = JSON.parse(localStorage["saved-posts"]);

			if (localStorage["saved-posts-ids"])
				ids = JSON.parse(localStorage["saved-posts-ids"]);

			const req = await fetch(`${process.env.ORIGIN}/posts/single?ID=${ID}&fields=description,title,image,url,comments,category,ID`);
			const post = await req.json();

			const cache = await caches.open("offline-app");

			await cache.add(`${process.env.ORIGIN}/posts/single?ID=${ID}&fields=image,content,title,tags,updated,description,category,ID,description,published`);

			savedPosts.push(post);
			ids.push(ID);

			localStorage.setItem("saved-posts", JSON.stringify(savedPosts));
			localStorage.setItem("saved-posts-ids", JSON.stringify(ids));

			this.setState({
				savedPostsIDs: [ID],
				isSaving: false
			});

			alert("Guardado con Exito");
		} catch(err) {
			this.setState({
				isSaving: false
			});
			alert("Error al guardar la entrada");
			console.error(err);
		}
	}
	toggleShare() {
		this.setState({
			isShareOpen: !this.state.isShareOpen
		});
		if (this.state.shareDisplay === "flex") {
			this.setState({
				shareOpacity: 0
			});
			setTimeout(() => this.setState({
				shareDisplay: "none"
			}), 310);
		}
		else {	
			this.setState({
				shareDisplay: "flex"
			});
			setTimeout(() => this.setState({
				shareOpacity: 1
			}), 10);

		}
	}
	componentDidMount() {
		var ids =  [];

		if (localStorage["saved-posts-ids"])
			ids = JSON.parse(localStorage["saved-posts-ids"]);

		this.setState({
			savedPostsIDs: ids
		});
	}
	render() {
		const {image, content, title, url, comments, ID} = this.props;
		const {savedPostsIDs, isSaving} = this.state;

		return <div className="blog-card">
			<Link href={"/post?ID=" + ID} as={`/${url}`}>
				<a onClick={() => FB.AppEvents.logEvent('View Post On Image')}>
					{ image !== "null" ?
						<div className="card-header-image" style={{backgroundImage: `url(${image})`}}></div>
						:
						<div className="card-header-title">
							<h3>{title}</h3>
						</div>
					}
				</a>
			</Link>
			<div className="data-cont">
				{image !== "null" &&
					<div className="title-container">
						<h3>{title}</h3>
					</div>
				}
				<p>{content.length > 200 ? content.slice(0, 197) + "..." : content}</p>
				<div className="comment-container">
					{
						(savedPostsIDs.indexOf(ID) > -1 && !isSaving) &&
						<img src="/images/saved.png" />
					}
					{
						(savedPostsIDs.indexOf(ID) === -1 && !isSaving) &&
						<img onClick={() => this.savePost(ID)} className="download-icon" src="/images/download.png" />
					}
					{
						isSaving &&
						<img src="/assets/spinner-black.svg" style={{animation: "rotation linear 1s infinite"}}/>
					}
					<div>
						<span>{comments}</span>
						<img src="/assets/bubbles.svg" className="comment-icon"/>
					</div>
				</div>
				<div>
					<button className="view-more" onClick={() => {Router.push("/post?ID=" + ID, `/${url}`); FB.AppEvents.logEvent('View Post On Button')}}>Ver Mas</button>
					<button className="share" onFocus={this.toggleShare} onBlur={this.toggleShare}>Compartir</button>
				</div>
				<Share style={{opacity: this.state.shareOpacity, display: this.state.shareDisplay}} title={title} url={`https://blog.davidsdevel.com${url}`}/>
			</div>
			<style jsx>{`
				.comment-container {
					padding: 20px;
					display: flex;
					text-align: right;
					justify-content: space-between;
					align-items: center;
				}
				.comment-container div {
					display: flex;
					align-items: center;
				}
				.comment-container img {
					height: 18px;
				}
				.comment-container img.download-icon {
					cursor: pointer;
				}
				.comment-container div .comment-icon {
					margin: 0 10px;
				}
				.blog-card {
					width: 90%;
					margin: 50px auto;
    				position: relative;
    				border-radius: 10px;
    				overflow: hidden;
				}
				.blog-card p {
					color: #505050;
				}
				.blog-card .card-header-image {
					height: 200px;
    				background-position: center;
    				background-size: cover;
				}
				.blog-card .card-header-title {
					height: 300px;
					background: black;
					display: flex;
   					justify-content: center;
					align-items: center;
				}
				.blog-card .card-header-title h3 {
					color: white;
				}
				.blog-card .title-container {
					height: 100px;
					display: flex;
   					justify-content: center;
   					align-items: center;
				}
				.blog-card h3 {
					text-align: center;
    				padding: 10px;
				}
				.blog-card p {
					height: 100px;
					padding: 0 10px;
				}
				.blog-card div button {
					width: 50%;
					height: 35px;
					border: none;
					cursor: pointer;
				}
				.blog-card div .view-more {
					border-radius: 0 0 0 10px;
					color: white;
					font-size: 15px;
					background: #0c3052;
				}
				.blog-card div .share {
					border-radius: 0 0 10px 0;
					color: #03A9F4;
					font-size: 15px;
					background: white;
				}
				@media screen and (min-width: 480px) {
					.blog-card {
						width: 80%;
						margin: 50px auto 50px;
					}
				}
				@media screen and (min-width: 720px) {
					.blog-card {
						width: ${this.props.size === "big" ? "65%" : "45%"};
						margin: 50px ${this.props.size === "big" ? "0" : "2.5%"};
						display: inline-block;
						position: relative;
						overflow: hidden;
					}
					.blog-card > a {
						${this.props.size === "big" ? 
							`display: inline-block;
							width: 35%;
							top: 0;
							height: 100%;
							position: absolute;`: "position: relative;display: block;width: 100%;"
						}
						overflow: hidden;
					}
					.blog-card .card-header-image,
					.blog-card .card-header-title {
						${this.props.size === "big" ? 
							`display: inline-block;
							width: 100%;height:100%;`: ""
						}
					}
					.blog-card .data-cont {
						${this.props.size === "big" ? 
							`display: inline-block;
							width: 65%;margin-left: 35%;` : ""
						}
					}
					.blog-card div .view-more {
						${this.props.size === "big" ? 
							`border-radius: 0;` : ""
						}
					}
					.blog-card p {
						${this.props.size === "big" ? 
							`height: 60px;` : ""
						}
						
					}
				}
			`}</style>
		</div>
	}
};

Card.propTypes = {
	image: string,
	content: string,
	title: string,
	url: string
}

export default Card;
