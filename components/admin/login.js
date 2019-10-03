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
		return <div>
			<form action="/admin-login" method="POST" encType="application/json">
				<input type="text" name="username" placeholder="Username"/>
				<input type="password" name="password" placeholder="Password"/>
				<button>Login</button>
			</form>
		</div>
	}
}