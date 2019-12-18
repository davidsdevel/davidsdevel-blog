import React, {Component} from "react";
import Posts from "./posts";
import Stats from "./stats";
import Import from "./import";

export default class Dashboard extends Component {
	constructor() {
		super();
		this.state = {
			tab: "posts"
		}
		this.changeTab = this.changeTab.bind(this);
	}
	changeTab(tab) {
		this.setState({
			tab
		})
	}
	render() {
		var {tab} = this.state;
		var UI;

		if (tab === "posts")
			UI = <Posts/>;
		else if (tab === "stats")
			UI = <Stats/>
		else if (tab === "import")
			UI = <Import/>;

		return <div>
			<aside>
				<ul>
					<li onClick={() => this.changeTab("posts")}>Posts</li>
					<li onClick={() => this.changeTab("stats")}>Stats</li>
					<li onClick={() => this.changeTab("social")}>Social Media</li>
					<li onClick={() => this.changeTab("import")}>Import</li>
				</ul>
			</aside>
			<div id="content">
				{UI}
			</div>
			<style jsx>{`
				aside {
					position: fixed;
					width: 25%;
					display: inline-block;
					height: 100%;
					left: 0;
				}
				#content {
					position: absolute;
					width: 75%;
					display: inline-block;
					height: 100%;
					left: 25%;
				}
			`}</style>
		</div>
	}
}