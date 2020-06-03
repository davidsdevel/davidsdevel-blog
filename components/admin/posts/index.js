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
			const req = await fetch(`${process.env.ORIGIN}/posts/all-edit?fields=ID,title,postStatus,comments,views,url,tags,image,category`);

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
	async edit(ID) {
		try {
			const req = await fetch(`${process.env.ORIGIN}/posts/single-edit?ID=${ID}&fields=ID,title,description,image,postStatus,url,content,category,tags`);
			const editData = await req.json();

			this.setState({
				editData,
				editting: true
			});
		} catch(err) {
			console.error(err);
		}
	}
	async delete(ID, url) {
		try {
			if (!confirm("¿Esta seguro de eliminar esta publicacion?"))
				return;

			const req = await fetch(`${process.env.ORIGIN}/posts/delete`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					ID,
					url
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
			alert("Error al obtener las entradas");
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
				ui = <div className="center">
					<span>Obteniendo Entradas...</span>
				</div>
				
			else {
				if (posts.length > 0)
					ui = <ul>
						{posts.map(e => <li className="post" key={`post-${e.ID}`}>
							{
								e.image ? 
								<div className="image" style={{backgroundImage: `url(/resize-image?url=${e.image}&height=100)`}}/>
								:
								<div className="image-title">{e.title === null ? "N" : e.title[0]}</div>
							}
							<div className="data">
								<span>{e.title || "(Nueva Entrada)"}</span>
								<div>
									{
										e.tags &&
										<span className="tags">{e.tags}</span>
									}
									<div className="align">
										<img src="/assets/bubbles.svg"/>
										<span>{e.comments}</span>
									</div>
									<div className="align">
										<img src="/assets/eye.svg"/>
										<span>{e.views}</span>
									</div>
									<div className="buttons">
										{
											e.postStatus === "published" &&
											<button className="white" onClick={() => window.open(`${e.url}`, "_blank")}>Ver</button>
										}
										<button className="gray" onClick={() => this.edit(e.ID)}>Editar</button>
										<button className="black" onClick={() => this.delete(e.ID, e.url)}>Eliminar</button>
									</div>
								</div>
							</div>
						</li>)}
						<style jsx>{`
							ul {
								margin: 75px auto 0;
							}
							ul > li.post {
								padding: 25px 5%;
								margin: 10px 0;
								width: 90%;
								background: white;
								border-radius: 10px;
								box-shadow: 1px 1px 5px gray;
								position: relative;
								display: flex;
								align-items: center;
							}
							ul li.post .image {
								background-size: cover;
								background-position: center;
								display: inline-block;
								width: 100px;
								height: 100px;
							}
							ul li.post .image-title {
								width: 100px;
								height: 100px;
								display: inline-flex;
								justify-content: center;
								align-items: center;
								background: black;
								color: white;
								font-size: 32px;
							}
							ul li.post .data {
								display: inline-block;
								margin: 0 0 0 25px;
							}
							ul li.post .buttons {
								position: absolute;
								bottom: 5%;
								right: 1%;
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
							.align {
								display: inline-flex;
								align-items: center;
							}
							.align img {
								width: 25px;
							}
						`}</style>
					</ul>;
				else
					ui = <div className="center">
						<img src="/images/posts.png"/>
						<button className="black" onClick={this.newPost}>Crear Entrada</button>
						<style jsx>{`
							.center {
								height: 80%;
							}
							img {
								margin: 50px 0 0 0;
							}
						`}</style>
					</div>
			}
		} else {
			ui = <Editor data={editData} cancel={this.cancel}/>
		}
		return <div style={{width: "90%"}}>
			<Head>
				<link href="/quill.snow.css" rel="stylesheet"/>
				<script src="/quill.js"/>
			</Head>
			{
				!editting &&
				<div className="top">
					<button className="black" onClick={this.newPost}>Nueva Entrada</button>
				</div>
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
