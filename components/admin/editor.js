import React, {Component} from "react";
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
			postStatus: "new",
			category: "development",
			isSaved: false
		}
		this.timeout = null;
		this.componentDidMount = this.componentDidMount.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.save = this.save.bind(this);
		this.publish = this.publish.bind(this);
	}
	componentDidMount() {
		const quill = initQuill();
		if (this.props.data) {
			const {ID, title,description,image,postStatus,url,content,category,tags} = this.props.data;
			this.setState({
				ID,
				title,
				description,
				image,
				postStatus,
				url: url.match(/(\w*-)*\w*$/)[0] || "",
				content,
				category,
				tags
			});
			quill.root.innerHTML = content;
		}
		window.react = this;
		// Handlers can also be added post initialization
		var toolbar = quill.getModule('toolbar');
		toolbar.addHandler('image', imgHandler);
		console.log(quill)
		quill.on('text-change', () => {
			console.log("> Changes")
			clearTimeout(this.timeout);
			this.timeout = setTimeout(this.save, 5000);
			this.setState({
				isSaved: false,
				content: quill.root.innerHTML
			})
		});
	}
	async save() {
		try {
			const {ID, title, description, tags, content, image, url, category} = this.state;

			const urlEncoded = new URLSearchParams();

			urlEncoded.append("ID", ID);
			urlEncoded.append("title", title);
			urlEncoded.append("description", description);
			urlEncoded.append("tags", tags);
			urlEncoded.append("content", content);
			urlEncoded.append("image", image);
			urlEncoded.append("url", category+"/"+url);
			urlEncoded.append("category", category);

			const req = await fetch("/manage-post/save", {
				method: "POST",
				body: urlEncoded
			});
			const data = await req.text();
			this.setState({
				isSaved: true,
				ID: data
			});
		} catch(err) {
			console.error(err);
		}
	}
	async publish() {
		try {
			const {ID, title, description, tags, content, image, url, category} = this.state;

			const urlEncoded = new URLSearchParams();

			urlEncoded.append("title", title);
			urlEncoded.append("ID", ID);
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
			const data = await req.text();
			this.props.cancel(true);
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
			<div>
				<input type="text" name="title" value={this.state.title} placeholder="Titulo" onChange={this.handleInput}/>
				<button disabled={this.state.isSaved} onClick={this.save}>Guardar</button>
				<button onClick={this.publish}>{this.state.postStatus === "published" ? "Update": "Publicar"}</button>
				<button onClick={() => this.props.cancel(this.state.isSaved)}>Cancelar</button>
			</div>
			<div id="editor-container">
				<div id="editor"/>
			</div>
			<aside>
				<select onChange={this.handleInput} name="category" value={this.state.category}>
					<option value="development">Programacion</option>
					<option value="design">Diseño</option>
					<option value="marketing">Marketing</option>
				</select>
				<textarea type="text" name="description" value={this.state.description} placeholder="Descripcion" onChange={this.handleInput}/>
				<input type="text" name="url" placeholder="URL" onChange={this.handleInput} value={this.state.url}/>
				<input type="text" name="tags" value={this.state.tags} placeholder="Etiquetas" onChange={this.handleInput}/>
			</aside>
			<style jsx>{`
				#editor-container {
					width: 75%;
					display: inline-block;
				}
				aside {
					width: 25%;
					display: inline-block;
				}
			`}</style>
		</div>
	}
}