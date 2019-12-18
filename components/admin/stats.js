import React, {Component} from "react";
import Card from "./statsSingleCard";
import Chart from "./chart";

export default class Stats extends Component {
	constructor() {
		super();

		this.state = {
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
				fetching: false
			});
		} catch(err) {
			console.error(err);
			alert("Error al Obtener los Datos");
		}
	}
	render() {
		const {general, mostView, mostCommented, fetching, viewsPosts, commentsPosts} = this.state;

		return <div>
			<div>
				<span className="title">Visitas al Blog</span>
				{
					fetching ?
					<span className="fetch-message">Obteniendo datos...</span>
					:
					<div>
						<Chart title="Horas" data={general.hours} size="small"/>
						<Chart title="Días" data={general.days} size="small"/>
						<Chart title="Paises" data={general.locations}/>
						<Chart title="Sistemas Operativos" data={general.os} size="small"/>
						<Chart title="Navegadores" data={general.browsers} size="small"/>
						<Chart title="Origen" data={general.origins}/>
					</div>
				}
				<span className="title">Más Visto</span>
				{
					fetching ? 
					<span className="fetch-message">Obteniendo datos...</span>
					:
					<Card data={mostView}/>
				}
				<span className="title">Más Comentado</span>
				{
					fetching ? 
					<span className="fetch-message">Obteniendo datos...</span>
					:
					<Card data={mostCommented}/>
				}
				<span className="title">Entradas</span>
				{
					fetching ? 
					<span className="fetch-message">Obteniendo datos...</span>
					:
					<Chart title="Visitas" data={viewsPosts}/>
				}
				{
					fetching ? 
					<span className="fetch-message">Obteniendo datos...</span>
					:
					<Chart title="Comentarios" data={commentsPosts}/>
				}
			</div>
			<style jsx>{`
				.title {
					display: block;
					font-size: 32px;
					margin: 50px 0;
					text-align: center;
					font-weight: bold;
				}
			`}</style>
		</div>
	}
}