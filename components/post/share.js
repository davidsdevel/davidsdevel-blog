import React from "react";

const Share = ({url, title}) => {
	const encodedURL = encodeURI("https://blog.davidsdevel.com" + url);
	return <div id="share-container">
		<span style={{fontSize: "18px", fontWeight: "bold"}}>¿Te gustó?</span>
		<br/>
		<span>¡Compartelo con tus amigos!</span>
		<div>
			<a 
				href={`https://www.facebook.com/sharer/sharer.php?u=${encodedURL}&t=${encodeURI(title)}`}
				target="_blank"
				onClick={() => FB.AppEvents.logEvent('Post - Share on Facebook')}
			>
				<img src="/static/assets/facebook.svg"/>
			</a>
			<a 
				href={`https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fblog.davidsdevel.com&ref_src=twsrc%5Etfw&text=${encodeURI("Esta entrada me gusto, puede que a ti también te interese." + title)}&tw_p=tweetbutton&url=${encodedURL}&via=davidsdevel`}
				target="_blank"
				onClick={() => FB.AppEvents.logEvent('Post - Share on Twitter')}
			>
				<img src="/static/assets/twitter.svg" />
			</a>
			<a
				href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedURL}`}
				target="_blank"
				onClick={() => FB.AppEvents.logEvent('Post - Share on LinkedIn')}
			>
				<img src="/static/assets/linkedin.svg" />
			</a>
		</div>
		<style jsx>{`
			#share-container {
				text-align: center;
				width: 90%;
				margin: auto;
				background: #f3f5f7;
				padding: 20px 0;
				border-left: solid 4px #03A9F4;
			}
			a img {
				width: 35px;
				margin: 30px 5% 0;
			}
			@media screen and (min-width: 480px) {
				#share-container {
					width: 80%;
				}
			}
			@media screen and (min-width: 720px) {
				#share-container {
					width: 50%;
				}
			}
		`}</style>
	</div>
};

export default Share;
