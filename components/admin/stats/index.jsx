import React, { Component } from 'react';
import Card from './statsSingleCard';
import Chart from './chart';
import Linear from './linearChart';
import store from '../../../store';
import { adminHideLoad } from '../../../store/actions';

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
      const req = await fetch('/blog/stats');

      const {
        general, posts, mostView, mostCommented,
      } = await req.json();

      if (!general) {
        return this.setState({
          fetching: false,
          haveData: false,
        });
      }

      const viewsPosts = posts.filter((e) => e.views > 0).map((e) => ({ key: e.url, value: e.views }));
      const commentsPosts = posts.filter((e) => e.comments > 0).map((e) => ({ key: e.url, value: e.comments }));

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
      general, mostView, mostCommented, viewsPosts, commentsPosts, haveData,
    } = this.state;
    console.log(general.viewsPerDay);
    return (
      <div>
        {
				haveData
				  ? (
  <div>
    <span className="title">Visitas al Blog</span>
    <div>
      <Linear title="Vistas" data={general.viewsPerDay} rows={30} />

      <Chart title="Horas" data={general.hours} size="small" />
      <Chart title="Días" data={general.days} size="small" />
      <Chart title="Paises" data={general.locations} />
      <Chart title="Sistemas Operativos" data={general.os} size="small" />
      <Chart title="Navegadores" data={general.browsers} size="small" />
      <Chart title="Origen" data={general.origins} />
    </div>
    <span className="title">Más Visto</span>
    <Card data={mostView} />
    <span className="title">Más Comentado</span>
    <Card data={mostCommented} />
    <span className="title">Entradas</span>
    <Chart title="Visitas" data={viewsPosts} />
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
