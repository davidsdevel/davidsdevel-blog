import React, {Component} from "react";
import store from "../store";
import {hideAlert} from "../store/actions";

export default class Alert extends Component {
	constructor() {
		super();

		this.state = {
			message: "Mensaje de Prueba",
			show: false,
			left: "-100%"
		};

		this.setClose = this.setClose.bind(this);
		this.clearClose = this.clearClose.bind(this);

		this.timeout = null;

		store.subscribe((() => {
			const {message, show} = store.getState().alert;
			console.log(message, show)
			this.setState({
				message,
				show
			});

		})).bind(this);
	}
	setClose() {
		console.log("Error")
		this.timeout = window.setTimeout(store.dispatch(hideAlert()), 5000);
	}
	clearClose() {
		window.clearTimeout(this.timeout);
	}
	render() {
		const {message, show} = this.state;

		return <div id="alert" style={{left: show ? 0 : "-100%"}} onMouseOver={this.clearClose} onMouseOut={this.setClose}>
				<span>{message}</span>
			<style jsx>{`
				#alert {
					position: fixed;
					padding: 15px 25px;
					background: #505050;
					bottom: 5%;
					color: white;
					box-shadow: 1px 1px 3px rgba(0,0,0,.3);
					border-radius: 0 5px 5px 0;
					display: flex;
					transition: ease .3s;
				}
				#alert img {
					width: 25px;
					margin: 0 0 0 10px;
				}
			`}</style>
		</div>
	}
}