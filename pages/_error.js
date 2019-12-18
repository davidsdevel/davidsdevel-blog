import React, {Component} from "react";
import Head from "next/head";
import Link from "next/link";

class ErrorPage extends Component {
	static async getInitialProps({req, res}) {
		if (req) {
			const status = res.statusCode;
			var message;
			if (status === 404) {
				message = <div><p>Ups. No hay nada por aqui</p><span>¿Te perdiste? Bueno dejame llevarte hasta el <Link href="/" prefetch><a>Inicio</a></Link></span></div>
			} else if (status === 500) {
				message = <div>¡Lo sentimos!<br/>Hubo un error en el servidor<br/><Link href="/" prefetch><a>Inicio</a></Link></div>
			}
			return {
				message,
				status,
				hideLayout: true
			};
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
				</div>
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
