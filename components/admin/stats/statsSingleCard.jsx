import React, { Component } from 'react';

const Card = ({ data }) => (
  <div>
    <div className="card-main">
      <div className="image" style={{ backgroundImage: `url(${process.env.ORIGIN}${data.image}?width=300)` }} />
      <div className="data">
        <span className="title">{data.title}</span>
        <span className="description">{data.description}</span>
        <div className="views">
          <img src="/assets/eye.svg" />
          <span>{data.views}</span>
        </div>
        <div className="comments">
          <img src="/assets/bubbles.svg" />
          <span>{data.comments}</span>
        </div>
        <button onClick={() => window.open(`${process.env.ORIGIN}/${data.url}`, '_blank')} className="black">Ver</button>
      </div>
    </div>
    <style jsx>
      {`
		.card-main {
			position: relative;
			display: flex;
			justify-content: space-arround;
			background: white;
			border-radius: 10px;
			width: 80%;
			margin: 50px auto;
			padding: 50px 5%;
			box-shadow: 1px 1px 5px gray;
		}
		.card-main .image {
			background-position: center;
			background-size: cover;
			display: inline-block;
			width: 25%;
		}
		.card-main .data {
			width: 65%;
			padding: 0 5%;
		}
		.card-main .data .title {
			width: 100%;
			display: block;
			text-align: center;
			font-size: 24px;
			font-weight: bold;
			margin: 0 0 25px
		}
		.card-main .data .description {
			display: block;
			margin: 0 0 50px;
		}
		.card-main .data div {
			margin: 0 25px;
			display: inline-flex;
			align-items: center;
		}
		.card-main .data div span {
			margin: 5px;
		}
		.card-main .data div img {
			width: 25px;
		}
		.card-main .data button {
			float: right;
		}
	`}
    </style>
  </div>
);

export default Card;
