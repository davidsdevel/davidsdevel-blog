import React from "react";

const About = () => {
	const date = new Date();
	const month = date.getMonth();
	var yo = date.getFullYear() - 1999;
	yo = month > 10 ? yo : yo - 1;

	return <div id="about-container">
		<h4>Un poco acerca de mi</h4>
		<img src="/images/me.jpg" alt="David González - David's Devel"/>
		<p>Soy <span className="author">David González</span>, un joven venezolano de {yo} Años, Programador autodidacta, diseñador por que toca, y marketer apasionado</p>
		<div id="social-container">
			<a 
				href="https://www.facebook.com/davidsdevel"
				target="_blank"
				onClick={() => FB.AppEvents.logEvent('View Profile on Facebook')}
			>
				<img src="/assets/facebook.svg"/>
			</a>
			<a 
				href="https://twitter.com/intent/user?screen_name=davidsdevel"
				target="_blank"
				onClick={() => FB.AppEvents.logEvent('View Profile on Twitter')}
			>
				<img src="/assets/twitter.svg" />
			</a>
			<a
				href="https://www.linkedin.com/in/davidsdevel"
				target="_blank"
				onClick={() => FB.AppEvents.logEvent('View Profile on LinkedIn')}
			>
				<img src="/assets/linkedin.svg" />
			</a>
			<a
				href="https://www.instagram.com/davidsdevel"
				target="_blank"
				onClick={() => FB.AppEvents.logEvent('View Profile on Instagram')}
			>
				<img src="/assets/instagram.svg" />
			</a>
		</div>
		<style jsx>{`
			div#about-container {
				background: #f3f5f7;
				width: 80%;
				margin: auto;
				padding: 25px 5%;
				overflow: hidden;
				border-left: solid 4px #03A9F4;
			}
			div#about-container > h4 {
				margin: 0;
				font-size: 20px;
			}
			div#about-container > img {
				width: 40%;
				display: block;
				border-radius: 50%;
				margin: 40px auto 10px;
			}
			div#about-container > #social-container {
				margin: auto;
			}
			div#about-container > #social-container a img {
				width: 10%;
				margin: 20px 7.5% 0;
			}
			@media screen and (min-width: 480px) {
				div#about-container > h4 {
					font-size: 24px;
				}
				div#about-container > img {
					width: 30%;
					margin: 40px auto 20px;
				}
				div#about-container > #social-container {
					width: 60%;
				}
			}
			@media screen and (min-width: 720px) {
				div#about-container {
					width: 50%;
				}
				div#about-container > h4 {
					margin-bottom: 20px;
					font-size: 18px;
				}
				div#about-container > img {
					display: inline-block;
					margin: 10px 0;
					width: 30%;
				}
				div#about-container > p {
					width: 60%;
					display: inline-block;
					vertical-align: top;
					margin: 10% 0 0 5%;
				}
			}
		`}</style>
	</div>
}

export default About;
