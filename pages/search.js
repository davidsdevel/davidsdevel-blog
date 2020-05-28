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
			posts: [],
			actualSearch: ""
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

		console.log(">", search)
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
			const req = await fetch(`/posts/search?q=${this.props.search}&page=${this.state.next}`);
			const data = await req.json();

			this.setState({
				posts: Object.assign([], this.state.posts, data.posts),
				next: data.next
			});
		} catch(err) {
			console.log(err);
		}
	}
	async componentDidMount() {
		try {
			const req = await fetch(`/posts/search?q=${this.props.search}`);
			const data = await req.json();

			this.setState({
				posts: data.posts,
				next: data.next,
				actualSearch: this.props.search
			});
		} catch(err) {
			console.log(err);
		}
	}
	async componentDidUpdate(props, state) {
		if (this.state.actualSearch !== props.search) {
			try {
				const req = await fetch(`/posts/search?q=${this.props.search}`);
				const data = await req.json();

				console.log(data)
				this.setState({
					posts: Object.assign([], data.posts),
					next: data.next,
					actualSearch: this.props.search
				});
			} catch(err) {
				this.setState({
					posts: []
				})
				console.error(err);
			}
		}
	}
	render() {
		const {search, pathname} = this.props;
		const {posts, next} = this.state;
		return (
			<div>
				<Head title="David's Devel" url={pathname}/>
				<span id="title">Busquedas para el termino: <b>{decodeURI(search)}</b></span>
				<div className="banner-container">
				  {setBanner()}
				</div>
				<div id="posts-container">
					<span style={{marginLeft: "5%", display: "block"}}>Entradas</span>
					{	posts.lenght > 0 ?
						
						posts.map(({description, title, image, url, comments, category}, i) => {

							return <Card
    		    		        title={title}
        		    		    content={description}
								url={url}
								image={image}
								comments={comments}
								category={category}
							/>
						})
						:
						<div>
							<span>No hay entradas con el termino: <b>{search}</b></span>
						</div>

					}
				</div>
				<aside className="banners">
					<a href="https://share.payoneer.com/nav/8KWKN89znbmVoxDtLaDPDhoy-Hh5_0TAHI8v5anfhDJ6wN3NOMMU3rpV5jk6FSfq9t5YNnTcg-XSxqiV1k7lwA2" target="_blank" onClick={() => FB.AppEvent.logEvent("Click on Payoneer Banner")}>
						<img src="/images/payoneer.png"/>
					</a>
					{
						posts.lenght > 2 && 
						<a href="https://platzi.com/r/davidsdevel/" target="_blank" onClick={() => FB.AppEvent.logEvent("Click on Platzi Banner")}>
							<img src="/images/platzi.png"/>
						</a>
					}
				</aside>
				{
					!!next &&
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
					@media screen and (min-width: 720px) {
						h2 {
							width: 60%;
						}
						#posts-container {
							display: inline-block;
							width: 75%;
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
