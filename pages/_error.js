import React, {Component} from "react";
import Head from "next/head";
import Footer from '../components/index/footer';

class ErrorPage extends Component {
	static async getInitialProps({req, res}) {
		if (req) {
			const status = req.status;
			var message;
			if (status > 404) {
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
					<meta name="viewport" content="with=device-width, initial-scale=1"/>
					<title>Ups. Lo sentimos</title>
				</Head>
				<div>
					{status ? <span>{status}</span> : null}
					{message}
				</div>
				<Footer/>
			</div>
		)
	}
}

export default ErrorPage;
