import React, {Component} from "react";

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
				<link href="//cdn-images.mailchimp.com/embedcode/horizontal-slim-10_7.css" rel="stylesheet" type="text/css"/>
				<div id="mc_embed_signup">
					<form action="https://gmail.us3.list-manage.com/subscribe/post?u=da9c6653a8444ded1b1b39374&amp;id=fe4b144b89" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
					    <div id="mc_embed_signup_scroll">
							<label htmlFor="mce-EMAIL">Suscribete</label>
							<input type="email" name="EMAIL" className="email" id="mce-EMAIL" placeholder="Correo Electronico" required/>
					    	<div style={{position: "absolute", left: "-5000px"}} aria-hidden="true">
					    		<input type="text" name="b_da9c6653a8444ded1b1b39374_fe4b144b89" tabIndex="-1"/>
					    	</div>
					    	<div className="clear">
					    		<input style={{marginTop: "10px"}}type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="button"/>
					    	</div>
					    </div>
					</form>
				</div>
				<button onClick={() => scroll(0, this.state.clientHeight - 70)}>
					<img src="/static/assets/arrow.svg" />
				</button>
				<div id="header-shadow">
					<img src="/static/images/davidsdevel-rombo.png"/>
					<span>Mantente al tanto de las actualizaciones de mi blog</span>
				</div>
			</header>
			<style jsx>{`
				#mc_embed_signup {
					color: #fff;
    				clear: left;
    				font: 14px Helvetica,Arial,sans-serif;
    				width: 80%;
    				right: 10%;
    				top: ${this.state.clientHeight - 240}px;;
    				position: absolute;
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
					background-image: url(/static/images/landing-mobile.jpg);
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
				header button {
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
				header button img {
					width: 40%;
				}
				@media screen and (min-width: 480px) {
					#header-shadow img {
						width: 20%;
    					margin: 15% auto 5%;
    				}
    				header {
						background-image: url(/static/images/landing-mobile-480p.jpg);
					}
					#mc_embed_signup {
						width: 50%;
						right: 25%;
    				}
				}
				@media screen and (min-width: 720px) {
					header {
						background-image: url(/static/images/landing-desktop.jpg);
					}
					#header-shadow img {
						width: 100px;
    					position: absolute;
    					right: 20%;
    					top: 0;
					}
					#mc_embed_signup {
						right: 5%;
						width: 40%;
						top: 300px;
					}
					header span {
						margin: 250px 0 0 5%;
						padding: 0;
    					font-size: 35px;
    					width: 30%;
    					text-align: left;
					}
					header button {
						top: ${this.state.clientHeight - 150}px;
					}
				}
				@media screen and (min-width: 960px) {
					header {
						background-image: url(/static/images/landing-desktop-960p.jpg);
					}
				}
			`}</style>
		</div>
	}
}
export default Landing;
