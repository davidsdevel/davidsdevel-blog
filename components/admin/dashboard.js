import React, {Component} from "react";
import Editor from "./editor";

export default class extends Component {
	constructor() {
		super();
		this.state = {
			tab: "editor"
		}
		this.changeTab = this.changeTab.bind(this);
	}
	changeTab(tab) {
		this.setState({
			tab
		})
	}
	render() {
		var tab;
		if (this.state.tab === "editor")
			tab = <Editor/>;
		return <div>
			<aside>
				<ul>
					<li onClick={() => this.changeTab("editor")}>Editor</li>
					<li onClick={() => this.changeTab("stats")}>Stats</li>
					<li onClick={() => this.changeTab("social")}>Social Media</li>
				</ul>
			</aside>
			{tab}
		</div>
	}
}