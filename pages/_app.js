import React from 'react'
import App, { Container } from 'next/app';
import Load from "../components/loadBar";
import Nav from '../components/nav'
import Footer from '../components/index/footer';
import Router from "next/router";
import Messaging from "../lib/messaging";

const messaging = new Messaging({
	apiKey: "AIzaSyAzcg06Z-3ukLDhVkvxM7V0lCNwYTwHpho",
	authDomain: "davids-devel-1565378708258.firebaseapp.com",
	databaseURL: "https://davids-devel-1565378708258.firebaseio.com",
	projectId: "davids-devel-1565378708258",
	storageBucket: "",
	messagingSenderId: "167456236988",
	appId: "1:167456236988:web:0896b0297732acc2"
});

export default class CustomApp extends App {
	constructor() {
		super();
		this.state = {
			showLoad: false
		};
	}
	static async getInitialProps({ Component, ctx }) {
		let pageProps = {}
		let referer;


		if (Component.getInitialProps)
			pageProps = await Component.getInitialProps(ctx);
	
		if (ctx.req) {
			referer = ctx.req.headers.referer;
		}

		referer = referer || "https://blog.davidsdevel.com";

		return {
			pageProps,
			referer: encodeURI(referer),
			viewUrl: pageProps.viewUrl
		};
	}
	async setView() {
		if (this.props.pageProps.hideLayout)
			return;

		try {
			const {viewUrl, referer} = this.props;

			const req = await fetch(`${process.env.ORIGIN}/posts/set-view?url=${viewUrl}&referer=${referer}`);

			await req.text();
		} catch(err) {
			console.error(err);
		}
	}
	initFB() {
		if (this.props.pageProps.hideLayout)
			return;

		var js, fjs = document.getElementsByTagName("script")[0];

		if (!document.getElementById("facebook-jssdk")) {

			js = document.createElement("script");
			js.id = "facebook-jssdk";
			js.src = "https://connect.facebook.net/es_LA/sdk.js";

			fjs.parentNode.insertBefore(js, fjs);
		}
		
		if(!window.FB) {
			window.fbAsyncInit = () => {
				FB.init({
					appId      : '337231497026333',
					xfbml      : true,
					autoLogAppEvents: true,
					version    : 'v4.0'
				});
				FB.AppEvents.logPageView();
			};
		} else {
			FB.XFBML.parse();
		}
		window.FB = {
			...window.FB,
			AppEvents:{
				logEvent: ev => console.log(ev)
			},
			XFBML: {
				parse: () => console.log("parsed") 
			}
		}
	}
	componentDidMount() {
		if (!this.props.pageProps.hideLayout)
			messaging.init();

		this.initFB();
		this.setView();

		Router.events.on("routeChangeStart", () => this.setState({
			showLoad: true
		}));

		Router.events.on("routeChangeComplete", () => {
			this.initFB();
			this.setView();

			this.setState({
				showLoad: false
			});
		});
	}
	render() {
		const { Component, pageProps } = this.props;
		const {showLoad} = this.state;

		return (
		  <Container>
		  	{
		  		(showLoad && !pageProps.hideLayout) &&
		  		<Load/>
		  	}
		  	{
		  		!pageProps.hideLayout &&
		  		<Nav/>
		  	}
			<Component {...pageProps} />
			{
				!pageProps.hideLayout &&
				<Footer/>
			}
			<style jsx global>{`
				html {
					scroll-behavior: smooth;
				}
				@font-face {
					font-family: Roboto;
					src: url(/fonts/Roboto.ttf);
				}
				button:focus {
					outline: none;
				}
				li {
					list-style: none;
				}
				a {
					text-decoration: none;
				}
				* {
					margin: 0;
					padding: 0;
					font-family: Roboto, Helvetica;
				}
				input:focus {
					outline: none;
				}
				input[type="text"],
				input[type="password"],
				input[type="email"],
				textarea,
				button.gray,
				button.black,
				button.white,
				button.circle
				{
					background: white;
				    padding: 10px 20px;
				    border: none;
				    box-shadow: grey 1px 1px 2px;
				    border-radius: 10px;
				}
				button {
					cursor: pointer;
					transition: ease .3s;
					border-radius: 5px;
				}
				button.white:hover, button.black {
					background: black;
					color: white;
				}
				button.gray {
					background: #7f7f7f;
					color: white;
				}
				button.black:hover, button.gray:hover, button.white {
					background: white;
					color: black;
				}
				button.circle {
					padding: 20px;
					border-radius: 50%;
				}
				li {
					list-style: none;
				}
			`}</style>
		  </Container>
		)
	}
}