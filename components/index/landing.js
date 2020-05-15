import React, {Component} from "react";
import Modal from "./subscriptionModal";

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
		return <div>
			<header style={{height: this.state.clientHeight}}>
				<button className="white">Suscríbete</button>
				<button id="circle" onClick={() => {scroll(0, this.state.clientHeight - 70); FB.AppEvents.logEvent('Landing Scroll')}}>
					<img src="/assets/arrow.svg" />
				</button>
				<div id="header-shadow">
					<img src="/images/davidsdevel-rombo.png"/>
					<span>Mantente al tanto de las actualizaciones de mi blog</span>
				</div>
				<Modal/>
			</header>
			<style jsx>{`
				button.white {
    				width: 80%;
    				right: 10%;
    				top: ${this.state.clientHeight - 180}px;;
    				position: absolute;
    				font-weight: bold;
				}
				#header-shadow {
					overflow: hidden;
					width: 100%;
					height: 100%;
					background: rgba(0, 0, 0, .5)
				}
				#header-shadow img {
					width: 30%;
					margin: 20% auto 15%;
					display: block;
				}
				header {
					width: 100%;
					height: 640px;
					display: block;
					background-image: url(/images/landing-mobile.jpg);
					background-position: center;
    				background-size: cover;
					overflow: hidden;
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
    				top: ${this.state.clientHeight - 90}px;
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
					button.white {
						width: 50%;
						right: 25%;
    				}
				}
				@media screen and (min-width: 720px) {
					header {
						background-image: url(/images/landing-desktop.jpg);
					}
					#header-shadow img {
						width: 100px;
    					position: absolute;
    					right: 20%;
    					top: 0;
					}
					button.white {
						right: 10%;
						width: 30%;
						top: 320px;
					}
					header span {
						margin: 250px 0 0 5%;
						padding: 0;
    					font-size: 35px;
    					width: 30%;
    					text-align: left;
					}
					header button#circle {
						top: ${this.state.clientHeight - 150}px;
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
