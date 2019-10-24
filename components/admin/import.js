import React, {Component} from "react";

export default class extends Component {
	constructor() {
		super();
		this.state = {
			data: "",
			readyToSend: false
		}
		this.sendData  = this.sendData.bind(this);
		this.getData  = this.getData.bind(this);
	}
	getData({target}) {
		const {files} = target;
		const file = files[0];

		const reader = new FileReader();
		reader.readAsText(file);
		reader.onloadend = e => {
			this.setState({
				data: e.target.result,
				readyToSend: true
			});
		}
	}
	async sendData() {
		try {
			const formData = new FormData();
			formData.append("data", this.state.data);

			const req = await fetch("/import-posts", {
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
	render() {
		return <div>
			<input type="file" onChange={this.getData}/>
			<button disabled={!this.state.readyToSend} onClick={this.sendData}>Enviar Datos</button>
		</div>
	}
}