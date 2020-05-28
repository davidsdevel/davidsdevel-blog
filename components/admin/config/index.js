import React, {Component} from "react";

class Config extends Component {
	constructor() {
		super();

		this.state = {
			categoryName: "",
			categoryAlias: "",
			categories: [],
			urlID: "",
			title: "",
			description: ""
		}

		this.addCategory = this.addCategory.bind(this);
		this.deleteCategory = this.deleteCategory.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}
	async addCategory() {
		try {
			const {categoryName: name, categoryAlias: alias} = this.state;
			const req = await fetch("/blog/add-category", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					name,
					alias
				})
			});

			if (req.status >= 400)
				alert("Error al añadir la categoría");
			else {
				const data = await req.text();

				if (data === "success") {
					const {categories} = this.state;

					categories.push({
						name,
						alias
					});

					this.setState({
						categories,
						categoryAlias: "",
						categoryName: ""
					});
				}
			}
		} catch(err) {
			console.error(err);
		}
	}
	async deleteCategory(name) {
		try {
			if (!confirm("¿Estás seguro de eliminar esta categoría?"))
				return;

			const req = await fetch("/blog/delete-category", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					name
				})
			});

			if (req.status >= 400)
				alert("Error al eliminar la categoría");
			else {
				const data = await req.text();

				if (data === "success") {
					var {categories} = this.state;

					categories = categories.filter(e => e.name !== name);

					this.setState({
						categories
					});
				}
			}
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
	async componentDidMount() {
		try {
			const req = await fetch("/blog/config");

			const {categories, urlID, title, description} = await req.json();

			this.setState({
				categories,
				urlID,
				title,
				description
			});
		} catch(err) {
			alert("Error al obtener las categorías");
			console.error(err);
		}
	}
	render() {
		const {categories, categoryName, categoryAlias, urlID, title, description} = this.state;

		const Categories = () => <ul id="categories">
			{categories.map(({name, alias}) => <li key={name}>
				<img src="/assets/cross.svg" onClick={() => this.deleteCategory(name)}/>
				<span className="alias">{alias}</span>
				<span className="name">{name}</span>
			</li>)}
			<style jsx>{`
				#categories li {
					background: white;
					box-shadow: 1px 1px 3px gray;
					border-radius: 5px;
					margin: 10px 0;
					padding: 10px 0;

					display: flex;
					align-items: center;
				}
				#categories li img {
					width: 15px;
					cursor: pointer;
					margin: 0 5px;
				}
				#categories li .alias {
					width: 40%;
					font-weight: bold;
					font-size: 20px;
				}
				#categories li .name {
					color: gray;
				}
			`}</style>
		</ul>
		return <div>
			<div className="top">
				<button className="black">Guardar</button>
				<span className="title">Configuración</span>
			</div>
			<ul>
				<li>
					<span className="sub-title">Título</span>
					<input onChange={this.handleInput} placeholder="Título" type="text" name="title" value={title}/>
				</li>
				<li>
					<span className="sub-title">Descripción</span>
					<textarea onChange={this.handleInput} placeholder="Descripción" name="description" value={description}/>
				</li>
				<li>
					<span className="sub-title">Categorías</span>
					<label htmlFor="categoryName">Nombre</label>
					<input onChange={this.handleInput} type="text" name="categoryName" placeholder="development" value={categoryName}/>
					<label htmlFor="categoryAlias">Alias</label>
					<input onChange={this.handleInput} type="text" name="categoryAlias" placeholder="Programación" value={categoryAlias}/>
					<button onClick={this.addCategory} className="black">Añadir</button>
					{
						categories.length > 0 &&
						<Categories/>
					}
				</li>
				<li>
					<span className="sub-title">Ruta de las entradas</span>
					<div className="selection">
						<input type="radio" onChange={this.handleInput} name="urlID" value="1" id="1" checked={urlID == 1}/>
						<label htmlFor="1" className="url">/:title</label>
					</div>
					<div className="selection">
						<input type="radio" onChange={this.handleInput} name="urlID" value="2" id="2" checked={urlID == 2}/>
						<label htmlFor="2" className="url">/:category/:title</label>
					</div>
					<div className="selection">
						<input type="radio" onChange={this.handleInput} name="urlID" value="3" id="3" checked={urlID == 3}/>
						<label htmlFor="3" className="url">/:year/:month/:title</label>
					</div>
					<div className="selection">
						<input type="radio" onChange={this.handleInput} name="urlID" value="4" id="4" checked={urlID == 4}/>
						<label htmlFor="4" className="url">/:year/:month/:day/:title</label>
					</div>
				</li>
			</ul>
			<style jsx>{`
				ul {
					display: flex;
					flex-direction: column;
					padding: 50px 0;
				}
				ul li {
					display: flex;
					flex-direction: column;
					max-width: 400px;
					margin: 25px 0 0;
				}
				ul li span,
				ul li > label,
				ul li button {
					margin: 15px 0;
				}
				input[type=radio] {
					display: none;
				}
				input[type=radio]:checked + label.url::before {
					width: 15px;
					height: 15px;
					border: 5px solid #f0f0f0;
					background: #555;
				}
				label.url {
					display: flex;
					align-items: center;
					position: relative;
					background: white;
					padding: 8px 16px;
					box-shadow: 1px 1px 5px rgba(0,0,0,.3);
					margin: 5px 0;
					border-radius: 5px;
					max-width: 400px;
					cursor: pointer;

					transition: ease .3s;
				}
				label.url:hover {
					background: #f0f0f0;
				}
				label.url::before {
					content: "";
					width: 25px;
					height: 25px;
					margin: 0 16px 0 0;
					background: rgb(243, 245, 247);
					border-radius: 5px;
					display: inline-block;
				}
			`}</style>
		</div>
	}
}

export default Config;
