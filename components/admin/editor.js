import React, {Component} from "react";
import Head from "next/head";
import fetch from "isomorphic-fetch";

export default class extends Component {
	constructor() {
		super();
		this.state = {
			title: "",
			description: "",
			tags: "",
			content: "",
			image: "",
			url: "",
			category: "development"
		}
		this.componentDidMount = this.componentDidMount.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.save = this.save.bind(this);
		this.publish = this.publish.bind(this);
		this.update = this.update.bind(this);
	}
	componentDidMount() {
		window.react = this;
		const quill = initQuill();
		// Handlers can also be added post initialization
		var toolbar = quill.getModule('toolbar');
		toolbar.addHandler('image', imgHandler);

		quill.on('text-change', () => {
			console.log("changed")
			this.setState({
				content: quill.root.innerHTML
			})
		});
	}
	async save() {
		try {
			const {title, description, tags, content, image, url} = this.state;
			const req = await fetch("/posts/save", {
				method: "POST",
				header: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					title,
					description,
					tags,
					content,
					image,
					url
				})
			});
			const data = await req.json();
		} catch(err) {
			console.error(err);
		}
	}
	async publish() {
		try {
			const {title, description, tags, content, image, url, category} = this.state;

			const urlEncoded = new URLSearchParams();

			urlEncoded.append("title", title);
			urlEncoded.append("description", description);
			urlEncoded.append("tags", tags);
			urlEncoded.append("content", content);
			urlEncoded.append("image", image);
			urlEncoded.append("url", category+"/"+url);
			urlEncoded.append("category", category);

			const req = await fetch("/manage-post/publish", {
				method: "POST",
				body: urlEncoded
			});
			const data = await req.json();
			console.log(data);
		} catch(err) {
			console.error(err);
		}
	}
	async update() {
		try {
			const {title, description, tags, content, image, url} = this.state;
			const req = await fetch("/manage-posts/update", {
				method: "POST",
				header: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					id: this.props.postID,
					title,
					description,
					tags,
					content,
					image,
					url
				})
			});
			const data = await req.json();
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
		if (name === "title") {
			this.setState({
				url: value.toLowerCase().split(" ").slice(0, 8).join("-")
			})
		}
	}
	render() {
		return <div>
			<Head>
				<link href="/static/quill.snow.css" rel="stylesheet"/>
				<script src="/static/quill.js"/>
				<script src="/static/editor.js"/>
			</Head>
			<button>Guardar</button>
			<button onClick={this.publish}>Publicar</button>
			<input type="text" name="title" placeholder="Titulo" onChange={this.handleInput}/>
			<textarea type="text" name="description" placeholder="Descripcion" onChange={this.handleInput}/>
			<input type="text" name="url" placeholder="URL" onChange={this.handleInput} value={this.state.url}/>
			<input type="text" name="tags" placeholder="Etiquetas" onChange={this.handleInput}/>
			<select onChange={this.handleInput} name="category">
				<option value="development">Programacion</option>
				<option value="design">Diseño</option>
				<option value="marketing">Marketing</option>
			</select>
			<div id="editor"/>
		</div>
	}
}