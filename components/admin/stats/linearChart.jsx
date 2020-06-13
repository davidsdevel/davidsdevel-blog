import React, { Component } from 'react';

export default class LinearChart extends Component {
  render() {
    let {
      data, title, size, align,
    } = this.props;

    let major;
    if (Array.isArray(data)) {
      major = data.sort((a, b) => (a.value > b.value ? -1 : +1))[0].value;
    } else {
      major = Object.values(data).sort((a, b) => (a > b ? -1 : +1))[0];

      data = Object.entries(data).map((e) => ({
        key: e[0],
        value: e[1],
      }));
    }

    const getPercent = (value) => ((100 * value) / major);

    data.reverse();

    return (
      <div style={{ width: '100%', display: 'inline-block' }}>
        <div className="chart-container">
          <span className="title">{title}</span>
          <ul>
            {data.map(({ key, value }) => {
					  let percent = getPercent(value);

					  if (percent < 1 || isNaN(percent)) { percent = 5; }

					  let alphaChannel = percent / 100;

					  if (alphaChannel < 0.1) { alphaChannel = 0.1; }

					  return (
  <li key={key + value}>
    <div className="bar-container">
      <div style={{ height: `${percent}%`, background: `rgba(3,169,244,${alphaChannel})` }} />
      <span className="total" style={{ bottom: `${percent + 20}%` }}>{value}</span>
      <span className="key" dangerouslySetInnerHTML={{ __html: key.replace('-', '<br/>') }} />
    </div>
  </li>
					  );
            })}
          </ul>
        </div>
        <style jsx>
          {`
				.title {
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
				.chart-container ul {
					height: 150px;
					display: flex;
					flex-direction: row-reverse;
				}
				.chart-container ul li {
					margin: 0 1px;
					width: 3.333%;
					position: relative;
					display: flex;
					flex-direction: column-reverse;
				}
				ul li span {
					transition: ease .2s;
					text-align: center;
					margin-bottom: -30px;
					font-size: 12px;
					opacity: 0;
					width: 100%;
				}
				ul li .bar-container {
					position: absolute;
					display: flex;
					align-items: flex-end;
					height: 100%;
					width: 100%;
				}
				ul li .bar-container div {
					cursor: pointer;
					position: absolute;
					height: 100%;
					border-radius: 5px 5px 0 0;
					width: 20px;
				}
				ul li .bar-container .total {
					position: absolute;
					cursor: default;
				}
				ul li .bar-container div:hover ~ span {
					opacity: 1
				}

			`}
        </style>
      </div>
    );
  }
}
