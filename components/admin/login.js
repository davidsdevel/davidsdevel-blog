import React, {Component} from "react";

export default class extends Component {
	constructor() {
		super();
		this.state = {
			username: "",
			password: ""
		}
		this.login = this.login.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}
	async login() {
		try {
			const url = new URLSearchParams();
			url
			const req = await fetch("http://localhost:8080/admin-login", {
				method: "POST",

			})
		} catch(err) {
			console.error(err);
		}
	}
	handleInput({target}) {
		const {name, type} = target;
		const value = type === "checkbox" ? target.checked : target.value;
		this.setState({
			[name]: value
		});
	}
	render() {
		return <div id="container">
			<img src="/static/images/davidsdevel-rombo.png"/>
			<form action="/admin-login" method="POST" encType="application/json">
				<input type="text" name="username" placeholder="Username"/>
				<input type="password" name="password" placeholder="Password"/>
				<button>Login</button>
			</form>
			<style jsx>{`
				#container {
					position: absolute;
    				width: 100%;
    				height: 100%;
    				background: #f7f7f7;
				}
				#container img {
					width: 10%;
					margin: 50px auto 80px;
					display: block;
				}
				#container input {
					background: white;
				    padding: 10px 20px;
				    border: none;
				    display: block;
				    margin: 15px auto;
				    box-shadow: grey 1px 1px 2px;
				    border-radius: 10px;
				}
			`}</style>
		</div>
	}
}
