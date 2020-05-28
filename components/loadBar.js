import React from "react";

const LoadBar = () => (
	<div id="load-container">
		<div id="load-bar"></div>
		<style jsx>{`
			#load-container {
				width: 100%;
				position: fixed;
				top: 0;
				z-index: 2;
			}
			#load-container #load-bar {
				background: black;
				height: 5px;
				position: absolute;

				animation: load infinite linear 1.5s;
			}
			@keyframes load {
				0% {
					width: 0;
					left: 0;
				}
				25% {
					width: 30%;
					left: 35%;
				}
				50% {
					width: 0;
					left: 100%;
				}
				75% {
					width: 30%;
					left: 35%;
				}
				100% {
					width: 0;
					left: 0;
				}
			}
		`}</style>
	</div>
);

export default LoadBar;
