import React, {Component} from "react";
import store from "../../store";
import {showModal} from "../../store/actions";

class Landing extends Component {
	constructor() {
		super();

		this.state = {
			clientHeight: null
		}
		this.componentDidMount = this.componentDidMount.bind(this);
	}
	componentDidMount() {
		this.setState({
			clientHeight: window.screen.availHeight
		});
	}
	render() {
		const {isSubscribe, description} = this.props;

		return <div>
			<header style={{height: this.state.clientHeight}}>
				{
					!isSubscribe &&
					<div id="subscription">
						<div id="one"/>
						<div id="two"/>
						<div id="tree"/>
						<div id="four"/>
						<button className="black" onClick={() => store.dispatch(showModal())}>Suscríbete</button>
					</div>
				}
				<button id="circle" onClick={() => {scroll(0, this.state.clientHeight - 70); FB.AppEvents.logEvent('Landing Scroll')}}>
					<img src="/assets/arrow.svg" />
				</button>
				<div id="header-shadow">
					<span>{isSubscribe ? description : "Mantente al tanto de las actualizaciones de mi blog"}</span>
					<img src="/images/davidsdevel-rombo.png"/>
				</div>
			</header>
			<style jsx>{`
				header {
					width: 100%;
					height: 640px;
					display: block;
					background-image: url(/images/landing-mobile.jpg);
					background-position: center;
    				background-size: cover;
					overflow: hidden;
					position: relative;
				}
				div#subscription {
					width: calc(80% - 100px);
    				right: calc(10% + 50px);
    				top: ${this.state.clientHeight - 180}px;
    				position: absolute;
				}
				button.black {
    				font-weight: bold;
    				width: 100%;
				}
				div#subscription div {
					width: 25px;
					height: 25px;
					border: solid rgba(255, 255, 255, .3) 0px;
					position: absolute;
				}
				div#subscription div#one {
					border-right-width: 1px;
					border-bottom-width: 1px;
					top: -50px;
					left: -50px;
				}
				div#subscription div#two {
					border-left-width: 1px;
					border-bottom-width: 1px;
					top: -50px;
					right: -50px;

				}
				div#subscription div#tree {
					border-left-width: 1px;
					border-top-width: 1px;
					bottom: -50px;
					right: -50px;

				}
				div#subscription div#four {
					border-right-width: 1px;
					border-top-width: 1px;
					bottom: -50px;
					left: -50px;
				}
				#header-shadow {
					${isSubscribe ? "height: 100%;" : "padding: 0 0 100% 0;height: 65%;"}
					overflow: hidden;
					display: flex;
					flex-direction: column-reverse;
					justify-content: space-evenly;
					align-items: center;
					width: 100%;
					background: rgba(0, 0, 0, .5)
				}
				#header-shadow img {
					width: 30%;
					display: block;
				}
				header span {
					padding: 0 10%;
    				display: block;
    				font-size: 28px;
    				font-weight: bold;
    				color: white;
    				text-align: center;
				}
				header label {
					font-size: 24px !important;
				}
				header button#circle {
					border-radius: 50%;
    				padding: 0;
    				width: 60px;
    				border: 0;
    				height: 60px;
    				box-shadow: rgba(0, 0, 0, .5) 2px 2px 3px;
    				position: absolute;
    				bottom: 15px;
    				right: 50%;
    				margin-right: -30px;
    				cursor: pointer;
				}
				header button#circle img {
					width: 40%;
				}
				@media screen and (min-width: 480px) {
					#header-shadow img {
						width: 20%;
    					margin: 15% auto 5%;
    				}
    				header {
						background-image: url(/images/landing-mobile-480p.jpg);
					}
					div#subscription {
						width: 50%;
						right: 25%;
					}
				}
				@media screen and (min-width: 720px) {
					header {
						background-image: url(/images/landing-desktop.jpg);
					}
					#header-shadow {
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
						padding: 0;
						height: 100%;
					}
					#header-shadow img {
						${isSubscribe ? 
							"width: 150px;margin: 0 15% 0 0;" :
							"width: 100px;margin: 0 20% 15% 0;"
						}
					}
					div#subscription {
						right: 10%;
						width: 30%;
						top: 320px;
					}
					header span {
						padding: 0 0 0 5%;
    					font-size: 35px;
    					width: 35%;
    					text-align: left;
					}
					header button#circle {
						bottom: 80px;
					}
				}
				@media screen and (min-width: 960px) {
					header {
						background-image: url(/images/landing-desktop-960p.jpg);
					}
				}
			`}</style>
		</div>
	}
}
export default Landing;
