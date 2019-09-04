import React, {Component} from "react";
import Editor from "./editor";

export default class extends Component {
	constructor() {
		super();
		this.state = {
			tab: "editor"
		}
	}
	render() {
		var tab;
		if (this.state.tab === "editor")
			tab = <Editor/>;
		return <div>{tab}</div>
	}
}