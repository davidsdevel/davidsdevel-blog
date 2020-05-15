import React, {Component} from "react";

export default class Import extends Component {
	constructor() {
		super();

		this.state = {
			data: "",
			sending: false
		};

		this.sendData  = this.sendData.bind(this);
	}
	sendData(cms) {
		var input = document.getElementById("input-data");

		if (input === null) {
			input = document.createElement("input");
			input.setAttribute('type', 'file');
			input.id = "input-data";

			input.onchange = ({target}) => {

				const {files} = target;
				const file = files[0];

				const reader = new FileReader();

				reader.readAsText(file);
				reader.onloadend = async e => {

					try {
						const formData = new FormData();
						formData.append("data", e.target.result);
						formData.append("cms", cms);

						const req = await fetch("/blog/import-posts", {
							method: "POST",
							headers: {
								"Auth": "C@mila"
							},
							body: formData
						});
					} catch(err) {
						console.error(err);
					}
				}
			}
		}

		input.click();
	}
	render() {
		const {sending} = this.state;
		return <div id="import-container">
			<span className="title">Importar Datos</span>
			<ul className="center">
				<li>
					<span>Blogger</span>
					<button className="black" disabled={sending} onClick={() => this.sendData("blogger")}>Enviar Datos</button>
				</li>
				<li>
					<span>WordPress</span>
					<button className="black" disabled={sending} onClick={() => this.sendData("wordpress")}>Enviar Datos</button>
				</li>
				<li>
					<span>CMS</span>
					<button className="black" disabled={sending} onClick={() => this.sendData("cms")}>Enviar Datos</button>
				</li>
			</ul>
			<style jsx>{`
				.title {
					display: block;
					font-size: 32px;
					width: 75%;
					right: 0;
					text-align: center;
					font-weight: bold;
					position: fixed;
				}
				.center {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 100%;
					height: 100%;
					position: absolute;
				}
				.center li {
					margin: 25px 0;
					display: flex;
					width: 250px;
					justify-content: space-between;
					align-items: center;
				}
			`}</style>
		</div>
	}
}