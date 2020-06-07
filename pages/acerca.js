import React, {Component} from "react";
import Head from "../components/head";
import Share from '../components/post/share';
import NextHead from "next/head";
import {setBanner} from "../lib/banners";
import Banners from "../components/banners";

const Post = () =>  (
		<div>
			<Head url="/acerca" title="Acerca de mi - David's Devel" description="¡Hola un gusto! Soy David González soy un desarrollador JavaScript Venezolano, Entra aquí para saber mas de mi."/>
			<NextHead>
				<script async defer src="https://platform.linkedin.com/badges/js/profile.js" type="text/javascript"/>
			</NextHead>
			<header>
				<div id="header-shadow">
					<h1>Acerca de Mi</h1>
				</div>
				<img src="/images/davidsdevel-rombo.png"/>
			</header>
			<div>
				<div className="banner-container">
				  {setBanner()}
				</div>
				<main>
					Hola Un gusto.
					<br />
					<br />
					Soy David González. Y como pudiste leer en la descripción del blog: Soy de Venezuela.<br />
					<br />
					Este soy yo.<br />
					<br />
					<div className="separator" style={{clear: "both", textAlign: "center"}}>
						<a href="https://1.bp.blogspot.com/-cNaLoa-gxVY/W9Igb-S19gI/AAAAAAAAAAk/VAnjQ-kyBdoJ94D8Lb5PmpFPKHXxQpC4wCLcBGAs/s1600/42527733_339569619921117_5327801399046569984_n.jpg" imageanchor="1" style={{clear: "left", float: "left", marginBottom: "1em", marginRight: "1em"}}>
							<img border="0" data-original-height="768" data-original-width="576" height="320" src="https://1.bp.blogspot.com/-cNaLoa-gxVY/W9Igb-S19gI/AAAAAAAAAAk/VAnjQ-kyBdoJ94D8Lb5PmpFPKHXxQpC4wCLcBGAs/s320/42527733_339569619921117_5327801399046569984_n.jpg" width="240" />
						</a>
					</div>
					Salgo feo pero es culpa de la fotógrafa.<br />
					<br />
					¿Como empezar?. Bueno, soy un chico joven, apasionado por la programación, enfocado en el desarrollo con Javascript tanto front-end como back-end, autodidacta, con ganas de emprender. Y con proyectos como <a href="https://www.npmjs.com/package/rocket-translator">Rocket Translator</a>, un traductor de HTML a Vue, React y Angular. Y <a href="https://www.lavozdeoieniv.tk/">La Voz de OIENIV Radio</a>, Website de una emisora de radio. Y más proyectos aun en desarrollo.<br />
					<br />
					<h3>Características sobre mi:</h3>
					<ul>
						<li>Soy muy introvertido. Pero me encanta dialogar acerca de tecnología.</li>
						<li>Soy <b>Venezolano </b>y amo serlo.</li>
						<li>Soy mas activo (o intento serlo) en twitter.</li>
						<li>Tengo un perro.</li>
					</ul>
					<h3>Mis Redes:</h3>
					Siganme en Twitter por <a href="https://twitter.com/intent/follow?user_id=1039569432425758720" target="_blank">@davidsdevel</a><br />
					Mi LinkedIn es <a href="https://www.linkedin.com/in/davidsdevel" target="_blank">David González</a><br />
					Mi Github es <a href="https://github.com/davidsdevel" target="_blank">David's Devel</a><br />
					Mi Fanpage de Facebook Igual: <a href="https://www.facebook.com/davidsdevel" target="_blank">David's Devel</a><br />
					¡Ahora tengo <a href="https://www.instagram.com/davidsdevel/" target="_blank">Instagram</a>!
				</main>
				<Banners length={1}/>
			</div>
			<Share url="/about" title="Conoce más acerca de David's Devel"/>
			<div className="banner-container">
				{setBanner()}
			</div>
			<style jsx>{`
				header {
					background-image: url(/images/og.jpg);
					height: 600px;
					width: 100%;
					background-position: center;
					background-size: cover;
					overflow: hidden;
				}
				header img {
					position: absolute;
					width: 30%;
					top: 100px;
					left: 35%;
				}
				h1 {
					color: white;
					width: 90%;
					margin: 300px auto 0;
					text-align: center;
				}
				header #header-shadow {
					overflow: hidden;
					width: 100%;
					height: 100%;
					background: rgba(0, 0, 0, .5)
				}
				main {
					padding: 0 5%;
					margin-bottom: 20px;
				}
				.banner-container {
					margin 50px 0;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				#comments-container {
					width: 90%;
					margin: auto;
				}
				@media screen and (min-width: 720px) {
					main {
						width: 60%;
						display: inline-block;
					}
					header img {
						position: absolute;
						width: 20%;
						top: 100px;
						left: 40%;
					}
					#comments-container {
						width: 60%;
					}
				}
				@media screen and (min-width: 960px) {
					header img {
						width: 10%;
						top: 200px;
						left: 45%;
					}
					h1 {
						margin: 400px auto 0;
					}
				}
			`}</style>
			<style global jsx>{`
				h1, h2, h3, h4 {
					text-align: center;
					margin: 30px 0 50px;
				}
				b {
					color: black;
				}
				main img {
					width: auto;
					max-width: calc(100% - 32px);
					height: auto;
				}
				main ul {
					padding: 0 0 0 20px;
					margin: 10px 0;
				}
				main ul li {
					margin: 5px 0;
					list-style: initial;
				}
			`}</style>
		</div>
);

export default Post;
