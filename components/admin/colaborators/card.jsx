import React from 'react';

const Card = ({
  name, lastName, ID, photo, del, view, ocupation,
}) => (
  <li>
    <img src={photo} />
    <span>
      {name}
      {' '}
      {lastName}
      <br />
      <i>{ocupation}</i>
    </span>
    <div id="buttons">
      <button className="gray" onClick={() => view(ID)}>Detalles</button>
      <button className="black" onClick={() => del(ID)}>Eliminar</button>
    </div>
    <style jsx>
      {`
		li {
			display: flex;
			background: white;
			height: 100px;
			padding: 25px 5%;
			align-items: center;
			justify-content: space-between;
			width: 90%;
			border-radius: 5px;
			box-shadow: 1px 1px 3px rgba(0,0,0,.3);
		}
		li img {
			width: 100px;
			height: 100px;
			border-radius: 50%;
		}
		li span {
			font-weight: bold;
			font-size: 20px;
			text-align: left;
			flex-grow: 1;
			padding: 0 50px;
		}
		li span i {
			font-weight: italic;
			font-size: 14px;
			color: gray;
		}
		li div {
			display: flex;
		}
		li #buttons {
			display: flex;
			height: 100px;
			align-items: flex-end;		
		}
		li #buttons button {
			margin: 0 5px;
		}
	`}
    </style>
  </li>
);

export default Card;
