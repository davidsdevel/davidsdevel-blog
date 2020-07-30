import React from 'react';

const Details = ({
  hide, name, lastName, ocupation, description, photo, facebook, twitter, instagram, linkedin, email, style,
}) => (
  <div id="colaborator" style={style}>
    <div>
      <img id="cross" src="/assets/cross.svg" onClick={hide} />
      <img src={photo} />
      <span>
        <i>{ocupation}</i>
      </span>
      <span className="title">
        {name}
        {' '}
        {lastName}
      </span>
      <div>
        {
				facebook
				&& (
<a href={facebook} target="_blank">
  <img src="/assets/facebook.svg" />
</a>
				)
			}
        {
				twitter
				&& (
<a href={twitter} target="_blank">
  <img src="/assets/twitter.svg" />
</a>
				)
			}
        {
				instagram
				&& (
<a href={instagram} target="_blank">
  <img src="/assets/instagram.svg" />
</a>
				)
			}
        {
				linkedin
				&& (
<a href={linkedin} target="_blank">
  <img src="/assets/linkedin.svg" />
</a>
				)
			}
        {
				email
				&& (
<a href={`mailto:${email}`} target="_blank">
  <img src="/images/email-menu.png" style={{ filter: 'brightness(0.4)' }} />
</a>
				)
			}
      </div>
      <p>{description}</p>
    </div>
    <style jsx>
      {`
		#colaborator {
			height: 100%;
			align-items: center;
			justify-content: center;
			position: fixed;
			background: #f7f7f7;
			transition: ease .3s;
			width: 94%;
			left: 70px;
		}
		#cross {
			position: absolute;
			width: 25px !important;
			left: 5%;
			top: 5%;
			filter: brightness(0.8);
			cursor: pointer;
		}
		#colaborator > div {
			position: relative;
			padding: 50px 5%;
			display: flex;
			flex-direction: column;
			align-items: center;
			background: white;
			border-radius: 10px;
			width: 50%;

		}
		#colaborator div > img {
			width: 150px;
			border-radius: 50%;
		}
		#colaborator div span i {
			color: gray;
			margin: 15px 0 0;
			display: block;
		}
		#colaborator div div {
			display: flex;
			margin: 15px 0;
			width: 50%;
			justify-content: space-around;
		}
		#colaborator div div img {
			width: 25px;
		}
		#colaborator div p {
			text-align: center;
			border: 1px solid rgba(0,0,0,.1);
			padding: 25px 50px;
			background: #fafafa;
			border-radius: 5px;
		}
	`}
    </style>
  </div>
);

export default Details;
