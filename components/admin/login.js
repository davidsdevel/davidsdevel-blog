import React, {Component} from "react";

export default class Login extends Component {
	constructor() {
		super();
		this.state = {
			username: "",
			password: ""
		}
		this.login = this.login.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}
	async login(e) {
		try {
			e.preventDefault();

			const {username, password} = this.state;

			if (!username || !password)
				return alert("Ingrese los datos");

			const req = await fetch(`${process.env.ORIGIN}/admin-login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					username,
					password
				})
			});

			const {status, message} = await req.json();

			if (status === "OK")
				this.props.onLogin();
			else if (status === "Error")
				alert(message);
		} catch(err) {
			console.error(err);
		}
	}
	handleInput({target}) {
		const {name, value} = target;

		this.setState({
			[name]: value
		});
	}
	render() {
		return <div id="container">
			<img src="/images/davidsdevel-rombo.png"/>
			<form onSubmit={this.login}>
				<input type="text" name="username" placeholder="Username" onChange={this.handleInput}/>
				<input type="password" name="password" placeholder="Password" onChange={this.handleInput}/>
				<button className="black">Login</button>
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
				#container input, #container button {
				    display: block;
				    margin: 15px auto;
				}
				#container button.black {
				    padding: 10px 50px;
				}
			`}</style>
		</div>
	}
}
