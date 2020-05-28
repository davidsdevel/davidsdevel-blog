import React, {Component} from "react";
import fetch from "isomorphic-fetch";
import ImagesModal from "./imagesModal";

export default class Editor extends Component {
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
			category: "",
			categories: [],
			isSaved: false,
			isPublished: false,
			showImagesModal: false,
			sending: false
		};

		this.timeout = null;
		this.quill = null;

		this.componentDidMount = this.componentDidMount.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.save = this.save.bind(this);
		this.publish = this.publish.bind(this);
		this.imageHandler = this.imageHandler.bind(this);
		this.setImage = this.setImage.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	async componentDidMount() {
		try {
			const req = await fetch("/blog/categories");
			const data = await req.json();

			this.setState({
				categories: data,
				category: data[0]
			});
		} catch(err) {
			console.error(err);
			alert("Error al obtener las categorías");
		}
		const toolbarOptions = [
			['bold', 'italic', 'underline', 'strike'],
			['blockquote', 'code-block'],
			[{ 'header': 3 }, { 'header': 4 }],
			[{ 'list': 'ordered'}, { 'list': 'bullet' }],
			[{ 'script': 'sub'}, { 'script': 'super' }],
			[{ 'indent': '-1'}, { 'indent': '+1' }],
			[{ 'direction': 'rtl' }],
			[{ 'size': ['small', false, 'large', 'huge'] }],
			[{ 'header': [3, 4, 5, 6, false] }],
			[ 'link', 'image', 'video', 'formula' ],
			[{ 'color': [] }, { 'background': [] }],
			[{ 'font': [] }],
			[{ 'align': [] }],
			['clean']
		];

		const codeBlock = Quill.import('formats/code-block');
		const AlignStyle = Quill.import('attributors/style/align');
		const BackgroundStyle = Quill.import('attributors/style/background');
		const ColorStyle = Quill.import('attributors/style/color');
		const DirectionStyle = Quill.import('attributors/style/direction');
		const FontStyle = Quill.import('attributors/style/font');
		const SizeStyle = Quill.import('attributors/style/size');
		const InlineBlot = Quill.import('blots/block');

		codeBlock.className = "prettyprint";

		var _this = this;
		class ImageBlot extends InlineBlot {
			static create(data) {
				const node = super.create(data);

				node.setAttribute('data-src', data.src);
				node.setAttribute('src', `/image?url=${data.src}?width=50`);
				node.setAttribute('alt', _this.state.title + " - David's Devel");
				node.setAttribute('title', _this.state.title + " - David's Devel");
				node.setAttribute('style', `width: ${data.width}px;`);

				return node;
			}
			static value(domNode) {
				const { src, custom } = domNode.dataset;
				return { src, custom };
			}
		}
		ImageBlot.blotName = 'imageBlot';
		ImageBlot.className = 'lazy';
		ImageBlot.tagName = 'img';

		Quill.register({ 'formats/imageBlot': ImageBlot });
		Quill.register(AlignStyle, true);
		Quill.register(BackgroundStyle, true);
		Quill.register(ColorStyle, true);
		Quill.register(DirectionStyle, true);
		Quill.register(FontStyle, true);
		Quill.register(SizeStyle, true);
		Quill.register(codeBlock, true);

		var quill = new Quill('#editor', {
			modules: {
				toolbar: toolbarOptions
			},
			theme: 'snow',
			debug: "info"
		});

		if (this.props.data) {
			const {ID, title,description,image,postStatus,url,content,category,tags,isPublished} = this.props.data;

			this.setState({
				ID,
				title,
				description,
				image,
				postStatus,
				url: /(\w*-)*/.test(url) && url !== "null" ? url : "",
				content,
				category: category === "null" ? "" : category,
				tags,
				isPublished
			});

			quill.clipboard.dangerouslyPasteHTML(0, content);
		}

		// Handlers can also be added post initialization
		var toolbar = quill.getModule('toolbar');
		toolbar.addHandler('image', this.imageHandler);

		quill.on('text-change', () => {
			if (this.state.postStatus !== "published") {
				clearTimeout(this.timeout);
				this.timeout = setTimeout(this.save, 5000);
			}
			this.setState({
				isSaved: false,
				content: quill.root.innerHTML
			})
		});

		this.quill = quill;
	}
	setImage(src, width) {
		const q = this.quill;
		const range = q.getSelection(true);

		q.editor.insertEmbed(range.index, 'imageBlot', {
			src: src,
			width
		});

		q.setSelection(range.index + 1, Quill.sources.SILENT);

		q.enable(true);

		this.setState({
			showImagesModal: false,
			content: this.quill.root.innerHTML
		});

		if (!this.state.image)
			this.setState({
				image: src
			});
	}
	imageHandler() {
		this.quill.enable(false);

		this.setState({
			showImagesModal: true
		});
	}
	async save() {
		try {
			this.setState({
				sending: true
			});

			const {ID, title, description, tags, content, image, url, category} = this.state;

			const urlEncoded = new URLSearchParams();

			urlEncoded.append("ID", ID);
			urlEncoded.append("title", title);
			urlEncoded.append("description", description);
			urlEncoded.append("tags", tags);
			urlEncoded.append("content", content);
			urlEncoded.append("image", image);
			urlEncoded.append("url", url);
			urlEncoded.append("category", category);

			const req = await fetch("/posts/save", {
				method: "POST",
				body: urlEncoded
			});
			const data = await req.text();
			this.setState({
				postStatus: "saved",
				isSaved: true,
				ID: data,
				sending: false
			});
		} catch(err) {
			console.error(err);
		}
	}
	async publish() {
		try {
			this.setState({
				sending: true
			});

			const {ID, title, description, tags, content, image, url, category, postStatus} = this.state;

			const urlEncoded = new URLSearchParams();

			urlEncoded.append("title", title);
			urlEncoded.append("ID", ID);
			urlEncoded.append("description", description);
			urlEncoded.append("tags", tags);
			urlEncoded.append("content", content);
			urlEncoded.append("image", image);
			urlEncoded.append("url", url);
			urlEncoded.append("category", category);
			urlEncoded.append("postStatus", postStatus);

			const req = await fetch("/posts/publish", {
				method: "POST",
				body: urlEncoded
			});
			const data = await req.text();

			this.setState({
				sending: false
			});

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
		if (name === "title" && !this.state.isPublished) {
			this.setState({
				url: value.toLowerCase()
					.split(" ")
					.slice(0, 8)
					.join("-")
					.replace(/ñ/g, "n")
					.replace(/á|à|â|ä/g, "a")
					.replace(/é|è|ê|ë/g, "e")
					.replace(/í|ì|î|ï/g, "i")
					.replace(/ó|ò|ô|ö/g, "n")
					.replace(/ú/g, "n")
			})
		}
	}
	closeModal() {
		this.setState({
			showImagesModal: false
		});
		this.quill.enable(true);
	}
	render() {
		const {categories, sending, showImagesModal, title, category, description, tags, url, postStatus, isSaved, ID, isPublished} = this.state;

		return <div id="main-container">
			<div id="editor-head">
				<input type="text" name="title" value={title} placeholder="Titulo" onChange={this.handleInput}/>
			</div>
			<div id="editor-container">
				<div id="editor"/>
			</div>
			<aside>
				{
					categories.length > 0 &&
					<select onChange={this.handleInput} name="category" value={category}>
						{
							categories.map(e => <option value={e.name}>{e.alias}</option>)

						}
					</select>

				}
				<textarea type="text" name="description" value={description} placeholder="Descripcion" onChange={this.handleInput}/>
				<input type="text" name="url" placeholder="URL" onChange={this.handleInput} value={url} disabled={isPublished}/>
				<input type="text" name="tags" value={tags} placeholder="Etiquetas" onChange={this.handleInput}/>
				<button className="white" disabled={isSaved || sending} onClick={this.save}>{postStatus === "published" ? "Cambiar a Borrador": "Guardar"}</button>
				<button className="gray" disabled={sending} onClick={this.publish}>{postStatus === "published" ? "Actualizar": "Publicar"}</button>
				<button className="gray" disabled={sending} onClick={() => window.open(`/preview/${process.env.AUTH_TOKEN}/${ID}`)}>Vista Previa</button>
				<button className="black" disabled={sending} onClick={() => this.props.cancel(isSaved)}>Cancelar</button>
			</aside>
			<ImagesModal show={showImagesModal} setImage={this.setImage} close={this.closeModal}/>
			<style jsx>{`
				#main-container {
					position: absolute;
					height: 100%;
					width: 90%;
				}
				#editor-head {
					height: 10%;
					display: flex;
					align-items: center;
					justify-content: center;
					width: 75%;
				}
				#editor-head input {
					width: 30%;
				}
				#editor-container {
					width: 75%;
					height: 80%;
					position: absolute;
					display: inline-block;
					left: 0;	
				}
				#editor {
					background: white;
				}
				aside {
					width: 25%;
					height: 80%;
					position: absolute;
					right: 0;	
					display: inline-block;
				}
				aside input,
				aside select,
				aside button,
				aside textarea {
					width: 70%;
					margin: 15px auto;
					display: block;
				}
				aside textarea {
					resize: none;
					height: 150px;
					overflow-y: auto;
				}
				aside button {
					display: inline-block;
					width: 40%;
					margin: 15px 5% 0 5%;
				}
			`}</style>
		</div>
	}
}