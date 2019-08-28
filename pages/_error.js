import React, {Component} from "react";
import Head from "next/head";
import Footer from '../components/index/footer';
import Link from "next/link";

class ErrorPage extends Component {
	static async getInitialProps({req, res}) {
		if (req) {
			const status = res.statusCode;
			var message;
			if (status === 404) {
				message = <p>Ups. No hay nada por aqui</p>
			}
			return {message, status};
		}

		return {
			message: <p>Ha ocurrido un error, intentelo mas tarde</p>
		}
	}
	render() {
		const {status, message} = this.props;
		return (
			<div>
				<Head>
					<meta charSet="utf-8"/>
					<title>Ups. Lo sentimos</title>
					<meta name="viewport" content="with=device-width, initial-scale=1"/>
					<link rel="icon" href="/static/favicon.ico" />
				</Head>
				<div id="container">
					{status ? <span id="status">{status}</span> : null}
					{message}
					<span>¿Te perdiste? Bueno dejame llevarte hasta el <Link href="/" prefetch><a>Inicio</a></Link></span>
					
				</div>
				<Footer/>
				<style jsx>{`
					@font-face {
						font-family: Roboto;
						src: url(/static/fonts/Roboto.ttf);
					}
					* {
						font-family: Roboto;
					}
				`}</style>
				<style jsx>{`
					#container {
						text-align: center;
					}
					#container #status {
						font-size: 50px;
						display: block;
						margin: 100px auto;
						font-weight: bold;
					}
				`}</style>
			</div>
		)
	}
}

export default ErrorPage;
