import React, {Component} from "react";

export default class Chart extends Component {
	render() {
		var {data, title, size} = this.props;

		console.log(data);
		var major;
		if (Array.isArray(data)) {
			major = data.sort((a, b) => a.value > b.value ? -1 : +1)[0].value;
		} else {
			major = Object.values(data).sort((a, b) => a > b ? -1 : +1)[0];

			data = Object.entries(data).map(e => ({
				key: e[0],
				value: e[1]
			}));
		}

		const getPercent = value => ((100 * value) / major);

		return <div style={{width: `${size === "small" ? 50 : 100}%`, display: "inline-block"}}>
			<div className="chart-container">
				<span className="title">{title}</span>
				<ul>
					{data.map(({key, value}) => {
						let percent = getPercent(value);

						if (percent < 1 || isNaN(percent))
							percent = 5;

						let alphaChannel = percent / 100;

						if (alphaChannel < 0.1)
							alphaChannel = 0.1;

						return <li key={key+value}>
							<span>{key}</span>
							<div className="bar-container">
								<div style={{width: `${percent}%`, background: `rgba(3,169,244,${alphaChannel})`}}/>
								<span className="total" style={{left: `${percent + 1}%`}}>{value}</span>
							</div>
						</li>
					})}
				</ul>
			</div>
			<style jsx>{`
				.title {
					font-size: 24px;
					display: block;
					text-align: center;
					margin: 0 0 50px;
				}
				.chart-container {
					position: relative;
					background: white;
					border-radius: 5px;
					width: 90%;
					box-shadow: 1px 1px 5px gray;
					padding: 50px 2.5% 50px;
					margin: 0 auto 50px;
					display: inline-block;
				}
				.chart-container ul li {
					margin: 1px 0;
					height: 20px;
					position: relative;
					display: flex;
					align-items: center;
				}
				ul li span {
					${title === "Visitas" || title === "Comentarios" ? 
						"width: 59%;"
						:
						"width: 29%;"
					}
					text-align: right;
				}
				ul li .bar-container {
					position: absolute;
					display: flex;
					align-items: center;
					height: 100%;
					${title === "Visitas" || title === "Comentarios" ? 
						"width: 30%;left: 60%;"
						:
						"width: 60%;left: 30%;"
					}
				}
				ul li .bar-container div {
					cursor: pointer;
					position: absolute;
					height: 100%;
					border-radius: 0 5px 5px 0;
				}
				ul li .bar-container .total {
					position: absolute;
					opacity: 0;
					cursor: default;
					transition: ease .2s;
					text-align: left;
				}
				ul li .bar-container div:hover + .total {
					opacity: 1
				}
			`}</style>
		</div>
	}
}