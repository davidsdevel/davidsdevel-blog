import React, { Component } from 'react';
import Card from './statsSingleCard';
import store from '../../../store';
import { adminHideLoad } from '../../../store/actions';
import LineChart from "./lineChart";
import BarChart from "./barChart";
import PieChart from "./pieChart";


export default class Stats extends Component {
  constructor() {
    super();

    this.state = {
      haveData: false,
      general: {},
      mostView: {},
      mostCommented: {},
      viewsPosts: [],
      commentsPosts: [],
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.fetchStatsData = this.fetchStatsData.bind(this);
  }

  componentDidMount() {
    this.fetchStatsData();
  }

  async fetchStatsData() {
    try {
      const req = await fetch('/api/blog/stats');

      const {
        general, posts, mostView, mostCommented,
      } = await req.json();

      if (!general) {
        store.dispatch(adminHideLoad());

        return this.setState({
          fetching: false,
          haveData: false,
        });
      }

      const viewsPosts = posts.filter((e) => e.views > 0).map((e) => ({ name: e.url, vistas: e.views }));
      const commentsPosts = posts.filter((e) => e.comments > 0).map((e) => ({ name: e.url, vistas: e.comments }));

      this.setState({
        general,
        mostView,
        mostCommented,
        viewsPosts,
        commentsPosts,
        haveData: true,
      });

      store.dispatch(adminHideLoad());
    } catch (err) {
      console.error(err);
      alert('Error al Obtener los Datos');
    }
  }

  render() {
    const {
      general,
      mostView,
      mostCommented,
      viewsPosts,
      commentsPosts,
      haveData,
    } = this.state;
    return (
      <div>
        {
				haveData
				  ? (
  <div>
    <span className="title">Visitas al Blog</span>
    <div>
      <span className="title">Vistas</span>
      <LineChart data={general.viewsPerDay}/>
      <span className="title">Horas</span>
      <BarChart data={general.hours} dataKey="time"/>
      <span className="title">Días</span>
      <BarChart data={general.days} dataKey="days"/>
      <span className="title">Países</span>
      <PieChart data={general.locations}/>
      <span className="title">Navegadores</span>
      <PieChart data={general.browsers}/>
      <span className="title">Sistema Operativo</span>
      <PieChart data={general.os}/>
      <span className="title">Origen</span>
      <PieChart data={general.origins}/>
    </div>
    <span className="title">Más Visto</span>
    <Card data={mostView} />
    <span className="title">Más Comentado</span>
    <Card data={mostCommented} />
    <span className="title">Entradas</span>
    <BarChart data={viewsPosts} layout='vertical'/>
    {
      commentsPosts.lenght > 0
        && <Chart title="Comentarios" data={commentsPosts} />
    }
  </div>
  )
  : (
  <div className="center">
    <img src="/images/stats.png" />
    <span>No hay datos para mostrar</span>
  </div>
  )
}
        <style jsx>
          {`
				.title {
					display: block;
					font-size: 32px;
					margin: 50px 0;
					text-align: center;
					font-weight: bold;
				}
			`}
        </style>
      </div>
    );
  }
}
