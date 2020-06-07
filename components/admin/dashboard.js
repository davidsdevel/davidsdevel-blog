import React, {Component} from "react";
import Posts from "./posts";
import Stats from "./stats";
import SocialMedia from "./social";
import Import from "./import";
import Config from "./config";
import Router from "next/router";
import store from "../../store";
import {adminShowLoad} from "../../store/actions";

export default class Dashboard extends Component {
	constructor() {
		super();
		this.state = {
			tab: "posts",
			opacity: 1,
			display: "flex"
		}
		this.changeTab = this.changeTab.bind(this);
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);

		store.subscribe(() => store.getState().admin.show ? this.show() : this.hide());
	}
	changeTab(tab) {
		store.dispatch(adminShowLoad());

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
	show() {
		this.setState({
			display: "flex",
			opacity: 1
		});
	}
	hide() {
		this.setState({
			opacity: 0
		});

		setTimeout(() => this.setState({display: "none"}), 310);
	}
	render() {
		var {tab, opacity, display} = this.state;
		var UI;

		const load = <div id="load-container" style={{display, opacity}}>
			<span>Cargando</span>
			<div id="load-points">
				<span className="one"></span>
				<span className="two"></span>
				<span className="tree"></span>
			</div>
			<style jsx>{`
				#load-container {
					align-items: center;
					justify-content: center;
					flex-direction: column;
					position: absolute;
    				width: 100%;
					height: 100%;
					background: #f7f7f7;
					z-index: 1;
					transition: .3s ease;
				}
				#load-container > span {
					font-size: 24px;
					font-weight: bold;
					text-align: center;
				}
				#load-container #load-points {
					display: flex;
					width: 75px;
    				position: relative;
					height: 25px;
					margin-top: 5px;
				}
				#load-container #load-points span {
					width: 15px;
					height: 15px;
					background: black;
					border-radius: 50%;
					position: absolute;
					top: 100%;
					animation: top ease-in-out .9s infinite;
				}
				#load-container #load-points span.one {
					left: calc(0% - 7.5px);
				}
				#load-container #load-points span.two {
					animation-delay: .3s;
					left: calc(50% - 7.5px)
				}
				#load-container #load-points span.tree {
					animation-delay: .6s;
					left: calc(100% - 7.5px);
				}
				@keyframes top {
					0% {
						top: 100%;
					}
					50% {
						top: 0%;
					}
					100% {
						top: 100%;
					}
				}
			`}</style>
		</div>;

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
					<li onClick={() => this.changeTab("import")}>
							<img src="/images/data.png"/>
					</li>
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
				{load}
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
					min-height: 50px;
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