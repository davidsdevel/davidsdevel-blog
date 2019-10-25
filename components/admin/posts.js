import React, {Component} from "react";
import Editor from "./editor";
import Link from "next/link";
import Head from "next/head";

class Posts extends Component {
	constructor() {
		super();
		this.state = {
			posts: [],
			tab: "all",
			editting: false,
			fetching: true,
			editData: {}
		}
		this.componentDidMount = this.componentDidMount.bind(this);
		this.cancel = this.cancel.bind(this);
		this.fetchPosts = this.fetchPosts.bind(this);
		this.newPost = this.newPost.bind(this);
	}
	componentDidMount() {
		this.fetchPosts();
	}
	async fetchPosts() {
		try {
			this.setState({
				fetching: true
			});
			const req = await fetch("/posts/all-edit?fields=ID,title,postStatus,comments,views,updated,url");
			const posts = await req.json();
			this.setState({
				posts,
				fetching: false
			});
		} catch(err) {
			console.error(err);
		}
	}
	async newPost() {
		this.setState({editting: true, editData: undefined});
	}
	async edit(url) {
		try {
			const req = await fetch(`/posts/single-edit?url=${url}&fields=ID,title,description,image,postStatus,url,content,category,tags`);
			const editData = await req.json();
			console.log(editData);
			this.setState({
				editData,
				editting: true
			});
		} catch(err) {
			console.error(err);
		}
	}
	cancel(isSave) {
		if (!isSave) {
			if (confirm("¿Seguro que quieres salir sin guardar?"))
				this.setState({
					editData: {},
					editting: false
				});
		} else {
			this.setState({
				editData: {},
				editting: false
			});
		}
		this.fetchPosts();
	}
	render() {
		const {posts, editting, editData, fetching} = this.state;
		var ui;
		if (editting === false) {
			if (fetching)
				ui = <div>
					<span>Loading posts...</span>
				</div>
				
			else {
				if (posts.length > 0)
					ui = <ul>
					{posts.map(e => <li key={`post-${e.ID}`}>
						<span>{e.title || "Nuevo Post"}</span>
						<div>
							{
								e.postStatus === "published" &&
								<Link href={`/${e.url}`}>
									<a target="_blank">Ver</a>
								</Link>
							}
							<button onClick={() => this.edit(e.url)}>Editar</button>
							<span>Comments: {e.comments}</span>
							<span>Views: {e.views}</span>
						</div>
					</li>)}
					</ul>
				else
					ui = <div>
						<span>No hay post</span>
						<button onClick={this.newPost}>Crear Post</button>
					</div>
			}
		} else {
			ui = <Editor data={editData} cancel={this.cancel}/>
		}
		return <div>
			<Head>
				<link href="/static/quill.snow.css" rel="stylesheet"/>
				<script src="/static/quill.js"/>
				<script src="/static/editor.js"/>
			</Head>
			{
				!editting &&
				<button onClick={this.newPost}>New Post</button>
			}
			{ui}
		</div>
	}
}
export default Posts;
