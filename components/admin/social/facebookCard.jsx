import React from 'react';
import HandleDate from '../../../lib/handleDate';

const FacebookCard = ({ content, pageName, pageImage }) =>
https://scontent.fccs2-1.fna.fbcdn.net/v/t1.0-1/cp0/p40x40/67945094_634877830345454_5511295759279980544_o.png?_nc_cat=100&_nc_sid=1eb0c7&_nc_ohc=s0vRSjLMdhgAX9NEf3S&_nc_ht=scontent.fccs2-1.fna&oh=5c8d7407d9f46762345100207e9c27ae&oe=5EF2EA89 (
  <div id="main">
    <div id="head">
  <div id="photo">
  <img src={pageImage} style={{ border: 'solid 1px rgba(0,0,0,.1)', borderRadius: '50%', margin: '-5px 5px 0' }} />
			</div>
  <div id="name">
  <div>
  <div>
  <span>
  <h2>{pageName}</h2>
						</span>
					</div>
  <div>
  <span>{HandleDate.getGMTDate()}</span>
  <span> . </span>
  <span>
  <img className="image-gray" src="https://static.xx.fbcdn.net/rsrc.php/v3/yQ/r/axobuTi734a.png" alt="Público" height="12" width="12" />
						</span>
					</div>
				</div>
			</div>
  <div id="points">
  <div style={{
 padding: 8, width: 20, alignSelf: 'flex-start', height: 20 
}}>
  <img className="image-gray" src="https://static.xx.fbcdn.net/rsrc.php/v3/y1/r/BOCzaD2rwOa.png" height="20" width="20" />
				</div>
			</div>
		</div>
    <div id="body">
  <span>{content}</span>
		</div>
    <div id="buttons">
  <div>
  <div>
    <div>
  <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yz/r/gGPRzHuW8qT.png" height="18" width="18" />
					</div>
    Me Gusta
				</div>
  <div className="comment">
  Comentar
				</div>
  <div>
  <div>
  <img className="image-gray" src="https://static.xx.fbcdn.net/rsrc.php/v3/yP/r/EyGUmEdOqjv.png" height="18" width="18" />
					</div>
  Compartir
				</div>
  <button>
  <img style={{ borderRadius: '50%', margin: '0 5px 0 0' }} height="20" src="https://scontent.fccs2-1.fna.fbcdn.net/v/t1.0-1/cp0/p24x24/54192522_2333268353370467_660030894509129728_n.jpg?_nc_cat=104&amp;_nc_sid=7206a8&amp;_nc_ohc=rJNgLTPEH5AAX-Rr4Ih&amp;_nc_ht=scontent.fccs2-1.fna&amp;oh=84d624f9179508a06646254852da84b1&amp;oe=5EF2E05D" width="20" />
  <img className="image-gray" src="https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/Rv8gX4eHbyj.png" height="12" width="12" />
				</button>
			</div>
		</div>
    <style jsx>
  {`
			#main {
				width: 500px;
				background: #fff;
				border-radius: 8px;
				box-shadow: 0 1px 2px rgba(0,0,0,.2);
				font-family: Helvetica, Arial, sans-serif;
			}
			#head {
				padding: 12px 16px;
				display: flex;
				align-items: flex-start;
				flex-direction: row;
			}
			#head #name {
				flex-grow: 1;
				margin: -5px 0;
			}
			#head #name + div {
				flex-direction: column;
				display: flex;
			}
			#head #name span {
				word-break: break-word;
				word-wrap: break-word;
				line-height: 1.2308;
				font-size: .8125rem;
				color: #65676b;
			}
			#head #name span h2 {
				font-weight: 600;
				color: #050505;
				font-size: .9375rem;
				margin: 4px 0 0 0;
			}
			.image-gray {
				filter: invert(39%) sepia(21%) saturate(200%) saturate(109.5%) hue-rotate(174deg) brightness(94%) contrast(86%);
			}
			#body {
				padding: 0 16px 12px;
				color: #050505;
				font-size: 1.5rem;
				line-height: 1.1667;
				font-weight: 400;
			}
			#body span {
				word-wrap: break-word;
			}
			#buttons {
				overflow-y: hidden;
			}
			#buttons > div {
				margin: 0 16px;
				display: flex;
				padding: 4px 0;
				flex-direction: row;
				align-items: center;
				border-top: solid 1px rgba(0,0,0,.3);
			}
			#buttons > div > div {
				display: flex;
				align-items: center;
				flex: 1 0;
				justify-content: center;
				font-size: .9375rem;
				color: #606770;
				font-weight: 600;
				height: 32px;
    			line-height: 14px;
				padding: 0 2px;
				position: relative;
				text-decoration: none;
				flex-grow: 1;
			}
			#buttons > div > div::after {
				bottom: -5px;
				content: '';
				display: block;
				left: 0;
				position: absolute;
				right: 0;
				top: -5px;
			}
			#buttons > div > div.comment::before {
				background-image: url(https://static.xx.fbcdn.net/rsrc.php/v3/yu/r/8pWz-jL1Ix0.png);
				background-repeat: no-repeat;
				background-size: auto;
				background-position: -350px -1354px;
				content: '';
				display: inline-block;
				height: 18px;
				margin: 0 6px -3px 0;
				min-width: 18px;
				position: relative;
				top: -2px;
				width: 18px;
			}
			#buttons > div > button {
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: default;
				padding: 0 8px;
				height: 32px;
				border: none;
				background: transparent;
			}
			#buttons > div > div > div {
				vertical-align: middle;
				padding-right: 6px;
			}
		`}
  </style>
  </div>
);

export default FacebookCard;
