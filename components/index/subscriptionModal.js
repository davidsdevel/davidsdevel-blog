import React, {Component} from "react";
import {bool} from "prop-types";

class Modal extends Component {
	constructor() {
		super();

		this.state = {
			name: "",
			lastname: "",
			email: "",
			token:"",
			display: "none",
			opacity: 0,
			invalidEmail: false,
			existsUsername: false,
			existsEmail: false,
			categories: [],
			feed: [],
			step: 0
		};

		this.checkUsername = this.checkUsername.bind(this);
		this.checkEmail = this.checkEmail.bind(this);
		this.getToken = this.getToken.bind(this);
		this.createUser = this.createUser.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.exit = this.exit.bind(this);
		this.next = this.next.bind(this);
		this.prev = this.prev.bind(this);
	}
	async checkUsername(e) {
		try {
			e.preventDefault();

			const {name, lastname} = this.state;

			if (!name || !lastname)
				return alert("Ingresa tus datos");

			const req = await fetch(`/users/check-username?name=${name}&lastname=${lastname}`);
			const data = await req.json();

			if (data.exists)
				this.setState({
					existsUsername: true
				});

			this.setState({
				step: 1
			});
		} catch(err) {
			console.error("Error checking username - " + err);
		}
	}
	async checkEmail(e) {
		try {
			e.preventDefault();

			const {email, name, lastname, invalidEmail} = this.state;

			if (!email)
				return alert("Ingresa el email");

			if (invalidEmail)
				return;

			const req = await fetch(`/users/check-email?email=${email}`);
			const data = await req.json();

			if (data.exists) {
				if (window.fcm.isTokenSentToServer) {
					this.createUser();
					this.exit();
				} else {
					this.setState({
						step: 2,
						existsEmail: true
					});
				}
			}
			else {
				this.setState({
					step: 2
				});
				 /*else {
					const res = await fetch("/users/create-user", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							name,
							lastname,
							email
						})
					})
				}*/
			}
			localStorage.setItem("email", email);
		}	catch(err) {
			console.error("Error checking username - " + err);
		}
	}
	async getToken() {
		try {
			const token = await window.fcm.getToken();

			this.setState({
				token
			});

			const req = await fetch("/blog/categories");
			const data = await req.json();

			if (data.categories.lenght > 0) {
				this.setState({
					step: 3,
					categories: data.categories
				});
			} else {
				this.createUser();
				this.exit();
			}
		} catch(err) {
			console.error("Error Getting FCM Token" + err);
		}
	}
	async createUser() {
		try {
			const {feed, email, name, lastname, token} = this.state;

			const req = await fetch("/users/create-user", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					name,
					lastname,
					email,
					token,
					feed: feed.join(",")
				})
			});
			const data = await req.json();
			if (data.status === "OK") {
				if (data.success) {
					localStorage.setItem("userID", data.ID);
					this.exit();
				}
			}
		} catch(err) {
			console.error("Error Setting feed, " + err);
		}
	}
	handleInput({target}) {
		const {name, type} = target;

		if (type === "email") {
			this.setState({
				invalidEmail: !/(\w|\d|-|_)*@(\w|\d|-|_)*\.\w\w*/.test(target.value)
			});
		}

		if (type !== "checkbox")
			this.setState({
				[name]: target.value
			});
		else {
			var feed = Object.assing([], this.state.feed);
			if (target.checked)
				feed.push(name);
			else
				feed = feed.filter(e => e !== name);

			this.setState({
				feed
			});
		}
	}
	exit() {
		this.setState({
			step: 4
		});
	}
	next() {
		const {step} = this.state;

		this.setState({
			step: step++
		});
	}
	prev() {
		const {step} = this.state;

		this.setState({
			step: step--
		});
	}
	render() {
		const {display, opacity, step, existsUsername, existsEmail, name, categories, invalidEmail} = this.state;
		var ui;

		//Get Username
		if (step === 0) {
			ui = <form onSubmit={this.checkUsername}>
				<span>Díme, ¿Cómo te llamas?</span>
				<input onChange={this.handleInput} type="text" name="name" placeholder="Nombre" value={this.state.name}/>
				<input onChange={this.handleInput} type="text" name="lastname" placeholder="Apellido" value={this.state.lastname}/>
				<button className="black">Siguiente</button>
			</form>;
		}
		//Get Email
		else if (step === 1) {
			ui = <form onSubmit={this.checkEmail}>
				{
					existsUsername ?
					<span>Parece que ya estas suscrito, ingresa tu email para verificar</span> :
					<span>Hola <b>{name}</b>, ¿nos podrías dar tu email?</span>
				}
				<input className={invalidEmail ? "invalid" : ""} onChange={this.handleInput} type="email" name="email" placeholder="Email" value={this.state.email}/>
				<button className="black">Siguiente</button>
			</form>
		}
		//Get notifications
		else if (step === 2) {
			ui = <div>
				<span>{existsEmail ? "Ya recibes nuestros posts por email, " : ""}¿Deseas recibir notificaciones cuando haya nuevos posts?</span>
				<button className="gray" onClick={this.getToken}>Recibir</button>
				<button className="black" onClick={this.exit}>No Recibir</button>
			</div>;
		}
		//Select feed if categories
		else if (step === 3) {
			ui = <div>
				{categories.map(cat => (<div>
					<label htmlFor={cat}>{cat[0].toUpperCase() + cat.slice(1)}</label>
					<input onChange={this.handleInput} type="checkbox" name={cat}/>
				</div>))}
				<button className="black" onClick={this.createUser}>Enviar</button>
			</div>;
		}
		//Finish
		else if (step === 4) {
			ui = <div>
				<span>¡Hurra! Ya estas suscrito</span>
			</div>;
		}
		return <div>
			<div id="shadow" style={{display, opacity}}>
				<div id="subscription-main">
					<img src="/assets/arrow.svg"/>
					{ui}
				</div>
			</div>
			<style jsx>{`
				#shadow {
					top: 0;
					left: 0;
					background: rgba(0,0,0,.5);
					position: fixed;
					display: flex;
					width: 100%;
					height: 100%;
					justify-content: space-around;
					align-items: center;
					z-index: 1;
				}
				#shadow #subscription-main {
					position: relative;
					width: 80%;
					height: 80%;
					max-width: 400px;
					background: #f7f7f7;
					border-radius: 5px;
				}
				:global(#shadow #subscription-main form,
				#shadow #subscription-main div) {
					display: flex;
					flex-direction: column;
					position: absolute;
					justify-content: space-around;
					align-items: center;
					width: 100%;
					height: 80%;
					top: 10%;
				}
				:global(input[type="email"].invalid) {
					border: #F44336 solid 2px;
				}
			`}</style>
		</div>;
	}
}

Modal.propTypes = {
	view: bool
};

export default Modal;
