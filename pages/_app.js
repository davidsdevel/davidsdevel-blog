import React from 'react'
import App, { Container } from 'next/app';

export default class extends App {
	componentDidMount() {
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
	}
	render() {
		const { Component, pageProps } = this.props

		return (
		  <Container>
			<Component {...pageProps} />
		  </Container>
		)
	}
}