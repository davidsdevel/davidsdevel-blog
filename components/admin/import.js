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
		return <div>
			<ul>
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
		</div>
	}
}