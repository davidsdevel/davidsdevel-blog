import React, {Component} from "react";
import Posts from "./posts";

export default class extends Component {
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
		var tab;
		if (this.state.tab === "posts")
			tab = <Posts/>;
		return <div>
			<aside>
				<ul>
					<li onClick={() => this.changeTab("posts")}>Posts</li>
					<li onClick={() => this.changeTab("stats")}>Stats</li>
					<li onClick={() => this.changeTab("social")}>Social Media</li>
				</ul>
			</aside>
			<div id="content">
				{tab}
			</div>
			<style jsx>{`
				aside {
					position: absolute;
					width: 25%;
					display: inline-block;
					heigth: 100%;
					left: 0;
				}
				#content {
					position: absolute;
					width: 75%;
					display: inline-block;
					heigth: 100%;
					left: 25%;
				}
			`}</style>
		</div>
	}
}