import React, { Component } from 'react';
import Card from './card';
import Details from './details';
import store from '../../../store';
import { adminHideLoad } from '../../../store/actions';

export default class Colaborators extends Component {
  constructor() {
    super();

    this.state = {
      viewColaborator: false,
      display: 'none',
      opacity: 0,
      colaborators: [],
      colaboratorData: {
        ID: 1,
        name: 'David',
        lastName: 'González',
        description: 'Joven venezolano de 20 Años, Programador autodidacta, diseñador por que toca, y marketer apasionado',
        ocupation: 'Desarrollador',
        photo: '/images/me.jpg',
        facebook: 'https://www.facebook.com/davidsdevel',
        twitter: 'https://www.twitter.com/davidsdevel',
        instagram: 'https://www.instagram.com/davidsdevel',
        linkedin: 'https://www.linkedin.com/in/davidsdevel',
        email: 'davidsdevel@gmail.com',
      },
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.view = this.view.bind(this);
    this.hide = this.hide.bind(this);
    this.del = this.del.bind(this);
  }

  async componentDidMount() {
    try {
      const req = await fetch('/colaborators/all');
      const { colaborators } = await req.json();

      this.setState({
        colaborators,
      });

      store.dispatch(adminHideLoad());
    } catch (err) {
      alert('Error al obtener los datos');

      console.error(err);
    }
  }

  async view(ID) {
    try {
      this.setState({
        display: 'flex',
        viewColaborator: true,
      });
      setTimeout(() => this.setState({
        opacity: 1,
      }), 10);
    } catch (err) {
      alert('Error al obtener los datos');
      console.error(err);
    }
  }

  hide() {
    this.setState({
      opacity: 0,
    });
    setTimeout(() => this.setState({
      display: 'none',
      viewColaborator: false,
    }), 300);
  }

  del(ID) {

  }

  render() {
    const {
      viewColaborator, colaborators, opacity, display,
    } = this.state;
    const {
      ID,
      name,
      lastName,
      description,
      photo,
      facebook,
      twitter,
      instagram,
      linkedin,
      email,
      ocupation,
    } = this.state.colaboratorData;

    return (
      <div style={{ width: '100%' }}>
        <Details
          ID={ID}
          name={name}
          lastName={lastName}
          description={description}
          photo={photo}
          facebook={facebook}
          twitter={twitter}
          instagram={instagram}
          linkedin={linkedin}
          email={email}
          ocupation={ocupation}
          style={{ opacity, display }}
          hide={this.hide}
        />
        <div>
          {
					!viewColaborator
					&& (
<div className="top">
  <button className="black">Añadir</button>
  <span className="title">Colaboradores</span>
</div>
					)
				}
          <ul>
            {
						colaborators.map(({
						  name, lastName, ID, photo, ocupation,
						}) => (
  <Card
    key={`colaborator-${ID}`}
    name={name}
    lastName={lastName}
    ID={ID}
    photo={photo}
    ocupation={ocupation}
    del={() => this.del(ID)}
    view={() => this.view(ID)}
  />
						))
					}
          </ul>
        </div>
        <style jsx>
          {`
				ul {
					padding-top: 100px; 
				}
			`}
        </style>
      </div>
    );
  }
}
