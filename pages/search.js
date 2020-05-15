import React, {Component} from "react";
import fetch from "isomorphic-fetch";
import Router from "next/router";
import Link from 'next/link';
import Head from '../components/head'
import Landing from '../components/index/landing';
import Card from '../components/index/card';
import {setBanner} from "../lib/banners";
import {string} from "prop-types";

class Search extends Component {
	constructor() {
		super();
		this.state = {
			items: []
		}
		this.viewMore = this.viewMore.bind(this);
		this.componentDidUpdate = this.componentDidUpdate.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
	}
	static async getInitialProps({req, res, asPath, pathname}) {
		if (/\/?q=.*/.test(asPath)) {
			var search;
			if (!req)
				search = asPath.match(/=.*(?=&|$)/)[0].replace("=", "");
			else
				search = req.query.q;

			return {
				search,
				pathname
			};

		} else {
			if (!req)
				Router.push("/");
			else
				res.redirect(301, "/");
		}
	}
	async viewMore() {
		try {
			const req = await fetch(`${location.origin}/find-post?q=${this.props.search}&pageToken=${this.state.nextPageToken}`);
			const data = await req.json();

			this.setState({
				items: Object.assign([], this.state.items, data.items),
				nextPageToken: data.nextPageToken
			});
		} catch(err) {
			console.log(err);
		}
	}
	async componentDidMount() {
		try {
			const req = await fetch(`${location.origin}/find-post?q=${this.props.search}`);
			const data = await req.json();

			this.setState({
				items: data.items,
				nextPageToken: data.nextPageToken,
				actualSearch: this.props.search
			});
		} catch(err) {
			console.log(err);
		}
	}
	async componentDidUpdate(a, b) {
		if (this.state.actualSearch !== a.search) {

			try {
				const req = await fetch(`${location.origin}/find-post?q=${this.props.search}`);
				const data = await req.json();
	
				this.setState({
					items: data.items,
					nextPageToken: data.nextPageToken
				});
			} catch(err) {
				console.log(err);
			}
		}
	}
	render() {
		const {search, pathname} = this.props;
		const {items, nextPageToken} = this.state;
		return (
			<div>
				<Head title="David's Devel" url={pathname}/>
				<span id="title">Busquedas para el termino: <b>{decodeURI(search)}</b></span>
				<div className="banner-container">
				  {setBanner()}
				</div>
				<div id="posts-container">
					<span style={{marginLeft: "5%", display: "block"}}>Entradas</span>
					{items.map(({content, title, image, url}, i) => {
					url = url.replace("http://davidsdevel.blogspot.com", "").replace(".html", "");
					return <Card
						 key={`blog-index-${i}`}
						 title={title}
						 content={content}
						 url={url}
						 image={image}
						/>
					})}
				</div>
				<aside>
					<a href="https://share.payoneer.com/nav/8KWKN89znbmVoxDtLaDPDhoy-Hh5_0TAHI8v5anfhDJ6wN3NOMMU3rpV5jk6FSfq9t5YNnTcg-XSxqiV1k7lwA2" target="_blank" onClick={() => FB.AppEvent.logEvent("Click on Payoneer Banner")}>
						<img src="/images/payoneer.png"/>
					</a>
					{
						items.lenght > 2 && 
						<a href="https://platzi.com/r/davidsdevel/" target="_blank" onClick={() => FB.AppEvent.logEvent("Click on Platzi Banner")}>
							<img src="/images/platzi.png"/>
						</a>
					}
				</aside>
				{
					!!nextPageToken &&
					<button onClick={this.viewMore}>Ver Más</button>
				}
				<div className="banner-container">
				  {setBanner()}
				</div>
				<style jsx>{`
					#title {
						margin: 100px 0 20px;
						text-align: center;
						display: block;
						font-size: 28px;
					}
					.banner-container {
						margin 50px 0;
						display: flex;
						justify-content: center;
						align-items: center;
					}
					aside {
						display: none;
					}
					#pagination-container {
						width: 80%;
						background: #ccc;
						margin: auto;
						padding: 5px;
						border-radius: 50px;
						display: flex;
						justify-content: space-between;
					}
					:global(#pagination-container a) {
						background: #ccc;
						color: white;
						padding: 10px 15px;
						border-radius: 50%;
						display: inline-block;
						font-weight: bold;
					}
					:global(#pagination-container a.page-active) {
						background: white;
						color: #03A9F4;
					}
					@media screen and (min-width: 720px) {
						h2 {
							width: 60%;
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
						aside iframe {
							margin 20px 0;
						}
						#posts-container {
							display: inline-block;
							width: 75%;
						}
						#pagination-container {
							width: 50%;
							background: #ccc;
							margin: 5% 0 0 0;
							padding: 5px;
							border-radius: 50px;
							display: flex;
							justify-content: space-between;
						}
					}
				`}</style>
			</div>
		)
	}
}


Search.propTypes = {
	search: string,
	pathname: string
}

export default Search;
