import React, {Component} from "react";
import Posts from "./posts";
import Stats from "./stats";
import SocialMedia from "./social";
import Import from "./import";
import Config from "./config";
import Router from "next/router";

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
		});
	}
	async logout() {
		try {
			const req = await fetch("/logout");

			if (req.status >= 400)
				alert("Error al cerrar la sesión");
			else {
				const data = await req.text();

				if (data === "success")
					Router.reload();
			}
		} catch(err) {
			alert("Error al cerrar la sesión");
			console.error(err);
		}
	}
	render() {
		var {tab} = this.state;
		var UI;

		if (tab === "posts")
			UI = <Posts/>;
		else if (tab === "stats")
			UI = <Stats/>;
		else if (tab === "social")
			UI = <SocialMedia/>;
		else if (tab === "import")
			UI = <Import/>;
		else if (tab === "config")
			UI = <Config/>;

		return <div>
			<aside>
				<ul>
					<li onClick={() => this.changeTab("posts")}>
						<img src="/images/posts-menu.png"/>
					</li>
					<li onClick={() => this.changeTab("stats")}>
						<img src="/images/stats-menu.png"/>
					</li>
					{/*
						<li onClick={() => this.changeTab("social")}>Social Media</li>
						<li onClick={() => this.changeTab("email")}>
							<img src="/images/email-menu.png"/>
						</li>
					*/}
					<li onClick={() => this.changeTab("import")}>Manejo de datos</li>
					<li onClick={() => this.changeTab("config")}>
						<img src="/images/config.png"/>
					</li>
					<li onClick={this.logout}>
						<img src="/images/logout.png"/>
					</li>
				</ul>
			</aside>
			<div id="content">
				{UI}
			</div>
			<style jsx>{`
				:global(.top) {
					display: flex;
					align-items: center;
					justify-content: space-evenly;
					position: fixed;
					top: 0;
					left: 70px;
					width: calc(100% - 70px);
					background: #f7f7f7;
					padding: 10px 0;
					z-index: 1;
				}
				:global(.top button) {
					position: absolute;
					left: 5%;
				}
				:global(.center) {
					display: flex;
					flex-direction: column;
					justify-content: space-evenly;
					align-items: center;
					height: 100%;
					position: relative;
				}
				:global(.center img) {
					width: 150px;
					display: block;
				}
				:global(.center span) {
					margin-bottom: 20px;
				}
				aside {
					position: fixed;
					width: 70px;
					display: inline-block;
					height: 100%;
					left: 0;
					background: black;
				}
				aside ul li {
					cursor: pointer;
					padding: 15px;
					height: 40px;
					transition: ease .3s;
				}
				aside ul li:hover {
					background: rgba(255,255,255,.5);

				}
				aside ul li img {
					width: 100%
				}
				#content {
					position: absolute;
					width: calc(90% - 70px);
					display: inline-flex;
					height: 100%;
					justify-content: center;
					padding: 0 5%;
					left: 70px;
				}
			`}</style>
		</div>
	}
}