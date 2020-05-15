import React, {Component} from "react";

export default class ImagesModal extends Component {
	constructor() {
		super();

		this.state = {
			data: [],
			fetching: true,
			isUploading: false,
			uploadName: "",
			display: "none",
			opacity: 0
		};

		this.componentWillUpdate = this.componentWillUpdate.bind(this);
		this.getImages = this.getImages.bind(this);
		this.upload = this.upload.bind(this);
	}
	componentWillUpdate(a, b) {
		if (a.show && b.display === "none" && b.opacity === 0) {

			this.setState({
				display: "block"
			});
			setTimeout(() => this.setState({
				opacity:1
			}), 10);

			this.getImages();
		} else if (!a.show && b.display === "block" && b.opacity === 1) {
			this.setState({
				opacity: 0
			});
			setTimeout(() => this.setState({
				display: "none"
			}), 610);
		}
	}
	async getImages() {
		try {
			this.setState({
				fetching: true
			});

			const req = await fetch("/data/images");

			const data = await req.json();

			this.setState({
				data,
				fetching: false
			});
		} catch(err) {
			alert("Error al obtener imagenes");
		}
	}
	upload() {
		let fileInput = document.querySelector('input.davidsdevel-image[type=file]');

		if (fileInput === null) {
			fileInput = document.createElement('input');		
			fileInput.setAttribute('type', 'file');
			fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
			fileInput.classList.add('davidsdevel-image');

			fileInput.onchange = ({target}) => {
				const {files} = target;

				const file = files[0];

				if (!files || !files.length) {
					console.log('No files selected');
					return;
				}

				const reader = new FileReader();

				reader.readAsDataURL(file);

				reader.onloadend = ({target: t}) => {
					const image = new Image();
					image.src = t.result;


					setTimeout(async () => {
						const formData = new FormData();

						formData.append('file', file);
						formData.append("name", file.name);
						formData.append("mime", file.type);
						formData.append("width", image.naturalWidth);

						try {
							this.setState({
								isUploading: true
							});

							const req = await fetch("/upload/image", {
								method: "POST",
								body: formData
							});

							const data = await req.json();
							const newData = Object.assign([], this.state.data);

							newData.unshift(data);

							this.setState({
								data: newData,
								isUploading: false
							});

							fileInput.value = "";
						} catch(err) {
							alert("Error al subir imagen");
							console.error(err);
						}
					}, 100);
				}
			}
		}

		fileInput.click();
	}
	appendImage(src, width, e) {
		if (e.target.tagName === "IMG")
			return;

		this.props.setImage(src, width);
	}
	async deleteImage(secret, name, e, i) {
		if (e.target.tagName === "DIV")
			return;

		try {
			const req = await fetch("/action-images/delete", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				},
				body:JSON.stringify({
					name,
					secret
				})
			});
			const data = await req.json();

			if (data.status === "OK") {
				const newData = Object.assign([], this.state.data.filter((e, ind) => ind !== i));

				this.setState({
					data: newData
				});
			} else if (data.status === "Error") {
				alert(data.message);
			}
		} catch(err) {
			console.error(err);
			alert("Error al eliminar imagen");
		}
	}
	render() {
		const {data, fetching, isUploading, uploadName, display, opacity} = this.state;

		return <div style={{display, opacity, transition: "ease .6s"}}>
			<div id="shadow">
				<div id="images-main">
					<span id="images-title">Imagenes</span>
					<img id="cross" src="/assets/cross.svg" onClick={this.props.close}/>
					<div id="images-container">
						{
							fetching ?
							<span>Obteniendo Imagenes...</span>
							:
							<div>
								<ul>
									{
										isUploading &&
										<li id="upload">
											<img src="/assets/spinner.svg" className="rotating"/>
										</li>
									}
									{	data.length > 0 || isUploading?
										data.map((e, i) => <li key={i+e.name}>
											<img src={`${e.src}?width=200`}/>
											<span>{e.name}</span>
											<div className="image-shadow" onClick={(ev) => this.appendImage(e.src, e.width, ev)}>
												<img src="/assets/cross.svg" onClick={(ev) => this.deleteImage(e.secret, e.name, ev, i)}/>
											</div>
										</li>)
										:
										<span>No hay imagenes</span>
									}
								</ul>
							</div>
						}
					</div>
					<button className="black" onClick={this.upload}>Subir</button>
				</div>
			</div>
			<style jsx>{`
				#shadow {
					position: fixed;
					width: 100%;
					height: 100%;
					background: rgba(0,0,0,.6);
					top: 0;
					left: 0;
				}
				#shadow #images-main {
					position: absolute;
					width: 60%;
					height: 80%;
					background: white;
					left: 20%;
					top: 10%;
					border-radius: 15px;
					display: flex;
					justify-content: center;
				}
				#shadow #images-main #images-title {
					font-weight: bold;
					font-size: 24px;
					margin-top: 10px;
				}
				#shadow #images-main #cross {
					position: absolute;
					right: 30px;
					top: 20px;
					width: 20px;
					cursor: pointer;
				}
				#shadow #images-main button {
					position: absolute;
					bottom: 15px;
				}
				#shadow #images-main #images-container {
					position: absolute;
					width: 100%;
					height: 70%;
					top: 10%;
					overflow-y: auto;
				}
				ul {
					display: flex;
					justify-content: space-around;
					flex-flow: wrap;
				}
				ul li {
					width: 18%;
					padding: 20px 1%;
					margin: 50px 1%;
					position: relative;
				}
				ul li div.image-shadow {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: rgba(0,0,0,.3);
					cursor: pointer;
					border-radius: 5px;

					display: none;
				}
				ul li:hover div.image-shadow {
					display: block;
				}
				ul li div.image-shadow img {
					width: 15%;
					position: absolute;
					right: 5%;
					top: 5%;
				}
				ul li img {
					width: 100%;
				}
				ul li#upload {
					background: #7f7f7f;
					border-radius: 5px;
					align-items: center;
					padding: 0;
					justify-content: center;
					display: flex;
				}
				ul li#upload img {
					width: 50%;
					animation: rotation linear infinite 1s;
				}
				@keyframes rotation {
					0% {
						transform: rotate(0deg);
					} 100% {
						transform: rotate(359deg);
					}
				}
			`}</style>
		</div>
	}
} 