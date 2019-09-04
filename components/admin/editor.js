import React, {Component} from "react";
import Head from "next/head";

export default class extends Component {
	constructor() {
		super();
		this.state = {
			title: "",
			description: "",
			tags: "",
			content: "",
			image: "",
			url: ""
		}
		this.componentDidMount = this.componentDidMount.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.save = this.save.bind(this);
		this.publish = this.publish.bind(this);
		this.update = this.update.bind(this);
	}
	componentDidMount() {

		const quill = initQuill();
		// Handlers can also be added post initialization
		var toolbar = quill.getModule('toolbar');
		toolbar.addHandler('image', () => imgHandler(react));

		quill.on('text-change', () => this.setState({
			content: quill.root.innerHTML
		}));
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
	async update() {
		try {
			const {title, description, tags, content, image, url} = this.state;
			const req = await fetch("/posts/save", {
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
	}
	render() {
		return <div>
			<Head>
				<link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet"/>
				<script src="https://cdn.quilljs.com/1.3.6/quill.js"/>
				<script src="/static/editor.js"/>
			</Head>
			<button>Guardar</button>
			<button>Publicar</button>
			<input type="text" name="title" placeholder="Titulo" onChange={this.handleInput}/>
			<input type="text" name="description" placeholder="Titulo" onChange={this.handleInput}/>
			<input type="text" name="url" placeholder="URL" onChange={this.handleInput}/>
			<input type="text" name="tags" placeholder="Etiquetas" onChange={this.handleInput}/>
			<div id="editor"/>
		</div>
	}
}