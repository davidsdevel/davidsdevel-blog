import React from "react";
import {string} from "prop-types";
import Link from "next/link";

const ShareCard = ({url, title, style}) => {
	const encodedURL = encodeURI(url);
	return <div id="share-card" style={style}>
		<a 
			href={`https://www.facebook.com/sharer/sharer.php?u=${encodedURL}&t=${encodeURI(title)}`}
			target="_blank"
			onClick={() => console.log("Facebook Card Share")}
		>
			<img src="/static/assets/facebook.svg"/>
		</a>
		<a 
			href={`https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fblog.davidsdevel.com&ref_src=twsrc%5Etfw&text=${encodeURI("Esta entrada me gusto, puede que a ti también te interese." + title)}&tw_p=tweetbutton&url=${encodedURL}&via=davidsdevel`}
			target="_blank"
			onClick={() => console.log("Twitter Card Share")}
		>
			<img src="/static/assets/twitter.svg" />
		</a>
		<a
			href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedURL}`}
			target="_blank"
			onClick={() => console.log("Linkedin Card Share")}
		>
			<img src="/static/assets/linkedin.svg" />
		</a>
		<style jsx>{`
			#share-card {
				transition: ease .3s;
				position: absolute;
				bottom: 80px;
				height: 50px;
				padding: 10px 25px;
				width: 70%;
				left: 7.5%;
				background: #f3f5f7;
				border-radius: 50px;
				box-shadow: 1px 1px 3px grey;
				justify-content: space-between;
			}
			#share-card a,
			#share-card a img {
				height: 100%;
			}
		`}</style>
	</div>
};

ShareCard.propTypes = {
	url: string,
	title: string
};

export default ShareCard;
