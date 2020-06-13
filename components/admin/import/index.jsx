import React, { Component } from 'react';
import store from '../../../store';
import { adminHideLoad } from '../../../store/actions';

export default class Import extends Component {
  constructor() {
    super();

    this.state = {
      data: '',
      sending: false,
    };

    this.sendData = this.sendData.bind(this);
  }

  sendData(cms) {
    let input = document.getElementById('input-data');

    if (input === null) {
      input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'application/xml');
      input.id = 'input-data';

      input.onchange = ({ target }) => {
        const { files } = target;
        const file = files[0];

        const reader = new FileReader();

        reader.readAsText(file);
        reader.onloadend = async (e) => {
          try {
            this.setState({
              sending: true,
            });
            const formData = new FormData();
            formData.append('data', e.target.result);
            formData.append('cms', cms);

            const req = await fetch('/blog/import-posts', {
              method: 'POST',
              body: formData,
            });

            if (req.status >= 200 && req.status < 300) {
              const res = await req.text();
              if (res === 'success') {
                alert('Importado con éxito');
                this.setState({
                  sending: false,
                });
              }
            } else if (req.status >= 400) {
              alert('Error al importar');
            }
          } catch (err) {
            console.error(err);
            alert('Error al importar');

            this.setState({
              sending: false,
            });
          }
        };
      };
    }

    input.click();
  }

  componentDidMount() {
    store.dispatch(adminHideLoad());
  }

  render() {
    const { sending } = this.state;
    return (
      <div id="import-container">
        <div className="top">
          <span className="title">Importar Datos</span>
        </div>
        <ul className="center">
          <li>
            <span>Blogger</span>
            <button className="black" disabled={sending} onClick={() => this.sendData('blogger')}>Enviar Datos</button>
          </li>
          <li>
            <span>WordPress</span>
            <button className="black" disabled={sending} onClick={() => this.sendData('wordpress')}>Enviar Datos</button>
          </li>
          <li>
            <span>CMS</span>
            <button className="black" disabled={sending} onClick={() => this.sendData('cms')}>Enviar Datos</button>
          </li>
        </ul>
        {
				sending
				&& (
<div id="load">
  <img src="/assets/spinner.svg" style={{ animation: 'rotation linear infinite .8s' }} />
  <span className="title" style={{ color: '#f7f7f7', marginTop: 100 }}>Importando Contenido</span>
</div>
				)
			}
        <style jsx>
          {`
				.center li {
					margin: 25px 0;
					display: flex;
					width: 250px;
					justify-content: space-between;
					align-items: center;
				}
				#load {
					position: fixed;
					display: flex;
					width: 75%;
					height: 100%;
					background: rgba(0, 0, 0, .5);
					justify-content: center;
					align-items: center;
				}
				#load img {
					width: 150px;
				}
			`}
        </style>
      </div>
    );
  }
}
