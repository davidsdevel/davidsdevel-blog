import React, {Component} from "react";
import Card from "./statsSingleCard";
import Chart from "./chart";

export default class Stats extends Component {
	constructor() {
		super();

		this.state = {
			haveData: false,
			general: {},
			mostView: {},
			mostCommented: {},
			fetching: true,
			viewsPosts: [],
			commentsPosts: []
		};

		this.componentDidMount = this.componentDidMount.bind(this);
		this.fetchStatsData = this.fetchStatsData.bind(this);
	}
	componentDidMount() {
		this.fetchStatsData();
	}
	async fetchStatsData() {
		try {
			const req = await fetch("/data/stats");

			const {general, posts} = await req.json();

			if (!general)
				return this.setState({
					fetching: false,
					haveData: false
				});

			const mostView = posts.sort((a,b) => {
				if (a.views > b.views)
					return +1;
				else
					return -1;
			})[0];

			const mostCommented = posts.sort((a,b) => {
				if (a.comments > b.comments)
					return +1;
				else
					return -1;
			})[0];

			const viewsPosts = posts.map(e => ({key: "/" + e.url, value: e.views}));
			const commentsPosts = posts.map(e => ({key: "/" + e.url, value: e.comments}));

			this.setState({
				general,
				mostView,
				mostCommented,
				viewsPosts,
				commentsPosts,
				fetching: false,
				haveData: true
			});
		} catch(err) {
			console.error(err);
			alert("Error al Obtener los Datos");
		}
	}
	render() {
		const {general, mostView, mostCommented, fetching, viewsPosts, commentsPosts, haveData} = this.state;

		return <div>
			{
				fetching ?
				<div className="center">
					<span className="fetch-message">Obteniendo datos...</span>
				</div>
				:
				haveData ?
				<div>
					<span className="title">Visitas al Blog</span>
					<div>
						<Chart title="Horas" data={general.hours} size="small"/>
						<Chart title="Días" data={general.days} size="small"/>
						<Chart title="Paises" data={general.locations}/>
						<Chart title="Sistemas Operativos" data={general.os} size="small"/>
						<Chart title="Navegadores" data={general.browsers} size="small"/>
						<Chart title="Origen" data={general.origins}/>
					</div>
					<span className="title">Más Visto</span>
					<Card data={mostView}/>
					<span className="title">Más Comentado</span>
					<Card data={mostCommented}/>
					<span className="title">Entradas</span>
					<Chart title="Visitas" data={viewsPosts}/>
					<Chart title="Comentarios" data={commentsPosts}/>
				</div>
				:
				<div id="no-stats">
					<span>No hay datos para mostrar</span>
				</div>
			}
			<style jsx>{`
				.title {
					display: block;
					font-size: 32px;
					margin: 50px 0;
					text-align: center;
					font-weight: bold;
				}
				:global(#no-stats) {
					display: flex;
					flex-direction: column;
					justify-content: center;
   					align-items: center;
					width: 100%;
					height: 100%;
					position: absolute;
				}
				:global(#no-stats span) {
					margin-bottom: 20px;
				}
				.center {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 100%;
					height: 100%;
					position: absolute;
				}
			`}</style>
		</div>
	}
}