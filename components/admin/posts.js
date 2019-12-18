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
			const req = await fetch(`${process.env.ORIGIN}/posts/all-edit?fields=ID,title,postStatus,comments,views,url,tags`);

			const {posts} = await req.json();

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
			const req = await fetch(`${process.env.ORIGIN}/posts/single-edit?url=${url}&fields=ID,title,description,image,postStatus,url,content,category,tags`);
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
	async delete(ID) {
		try {
			if (!confirm("¿Esta seguro de eliminar esta publicacion?"))
				return;

			const req = await fetch(`${process.env.ORIGIN}/manage-post/delete`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					ID
				})
			});

			const {status, message} = await req.json();

			if (status === "OK") {
				alert("Eliminado con Exito");
				this.fetchPosts();
			}
			else if (status === "Error")
				alert(message);

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
						{posts.map(e => <li className="post" key={`post-${e.ID}`}>
							<span>{e.title || "Nuevo Post"}</span>
							<div>
								{
									e.tags &&
									<span className="tags">{e.tags}</span>
								}
								<span>Comments: {e.comments}</span>
								<span>Views: {e.views}</span>
								<div className="buttons">
									{
										e.postStatus === "published" &&
										<button className="white" onClick={() => window.open(`/${e.url}`, "_blank")}>Ver</button>
									}
									<button className="gray" onClick={() => this.edit(e.url)}>Editar</button>
									<button className="black" onClick={() => this.delete(e.ID)}>Eliminar</button>
								</div>
							</div>
						</li>)}
						<style jsx>{`
							ul {
								margin: 15px auto 0;
							}
							ul > li.post {
								padding: 25px 5%;
								margin: 10px 0;
								width: 80%;
								background: white;
								border-radius: 10px;
								box-shadow: 1px 1px 5px gray;
							}
							ul li.post .buttons {
								float: right;
							}
							ul li.post .buttons button {
								margin: 0 10px
							}
							ul li.post span {
								margin: 5px;
								display: inline-block;
							}
							ul li.post span.tags {
								display: block;
								color: #7f7f7f;
								font-size: 14px;
								margin: 10px;
							}
						`}</style>
					</ul>;
				else
					ui = <div>
						<span>No hay post</span>
						<button className="black" onClick={this.newPost}>Crear Post</button>
					</div>
			}
		} else {
			ui = <Editor data={editData} cancel={this.cancel}/>
		}
		return <div>
			<Head>
				<link href="/static/quill.snow.css" rel="stylesheet"/>
				<script src="/static/quill.js"/>
			</Head>
			{
				!editting &&
				<button className="black" onClick={this.newPost}>Nuevo Posts</button>
			}
			{ui}
			<style jsx>{`
				button.black {
					margin: 20px 0;
				}
			`}</style>
		</div>
	}
}
export default Posts;
