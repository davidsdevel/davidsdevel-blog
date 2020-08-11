import React, { Component } from 'react';
import Head from 'next/head';
import Editor from './editorGrapes';
import store from '../../../store';
import { adminHideLoad, adminShowLoad, adminShowMenu } from '../../../store/actions';

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      tab: 'all',
      editting: false,
      editData: {},
    };
    this.posts = [];
    this.componentDidMount = this.componentDidMount.bind(this);
    this.fetchPosts = this.fetchPosts.bind(this);
    this.newPost = this.newPost.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
    this.cancel = this.cancel.bind(this);
    this.filter = this.filter.bind(this);
  }

  componentDidMount() {
    this.fetchPosts();
  }

  async fetchPosts() {
    try {
      const req = await fetch(`${process.env.ORIGIN}/api/posts/all-edit?fields=ID,title,postStatus,comments,views,url,tags,images,category`);

      const { posts } = await req.json();

      let imported = 0;
      let drafted = 0;
      let published = 0;
      const all = posts.length;

      posts.forEach(({ postStatus }) => {
        if (postStatus === 'draft') { drafted++; }

        if (postStatus === 'published') { published++; }

        if (postStatus === 'imported') { imported++; }
      });

      this.posts = posts;

      this.setState({
        all,
        posts,
        imported,
        drafted,
        published,
      });

      store.dispatch(adminHideLoad());
    } catch (err) {
      console.error(err);
    }
  }

  newPost() {
    this.setState({ editting: true, editData: {} });

    store.dispatch(adminShowLoad());
  }

  async edit(ID) {
    try {
      store.dispatch(adminShowLoad());

      const req = await fetch(`${process.env.ORIGIN}/api/posts/single-edit?ID=${ID}&fields=ID,title,description,images,postStatus,url,content,category,tags`);
      const editData = await req.json();

      const splitURL = editData.url.split('/');

      editData.url = splitURL[splitURL.length - 1];

      this.setState({
        editData,
        editting: true,
      });
    } catch (err) {
      console.error(err);
    }
  }

  async delete(ID, url) {
    try {
      if (!confirm('¿Esta seguro de eliminar esta publicacion?')) { return; }

      const req = await fetch(`${process.env.ORIGIN}/api/posts/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ID,
          url,
        }),
      });

      const { status, message } = await req.json();

      if (status === 'OK') {
        alert('Eliminado con Exito');
        this.fetchPosts();
      } else if (status === 'Error') { alert(message); }
    } catch (err) {
      console.error(err);
      alert('Error al obtener las entradas');
    }
  }

  cancel(isSave) {
    if (!isSave) {
      if (confirm('¿Seguro que quieres salir sin guardar?')) {
        this.setState({
          editData: {},
          editting: false,
        });
      }
    } else {
      this.setState({
        editData: {},
        editting: false,
      });
    }
    store.dispatch(adminShowMenu());

    this.fetchPosts();
  }

  filter(type) {
    const { posts } = this;

    if (type === '*') {
      return this.setState({
        posts,
      });
    }

    const filtered = posts.filter(({ postStatus }) => postStatus === type);

    this.setState({
      posts: filtered,
    });
  }

  render() {
    const {
      posts, editting, editData, imported, published, drafted, all,
    } = this.state;
    let ui;
    if (editting === false) {
      if (posts.length > 0) {
        ui = (
          <ul>
            {posts.map((e) => (
              <li className="post" key={`post-${e.ID}`}>
                {
							e.image
							  ? <div className="image" style={{ backgroundImage: `url(/resize-image?url=${e.image}&height=100)` }} />
							  :							<div className="image-title">{e.title === null ? 'N' : e.title[0]}</div>
						}
                <div className="data">
                  <span>{e.title || '(Nueva Entrada)'}</span>
                  <div>
                    {
									e.tags
									&& <span className="tags">{e.tags.join(', ')}</span>
								}
                    <div className="align">
                      <img src="/assets/bubbles.svg" />
                      <span>{e.comments}</span>
                    </div>
                    <div className="align">
                      <img src="/assets/eye.svg" />
                      <span>{e.views}</span>
                    </div>
                    <div className="buttons">
                      {
										e.postStatus === 'published'
										&& <button className="white" onClick={() => window.open(`${e.url}`, '_blank')}>Ver</button>
									}
                      <button className="gray" onClick={() => this.edit(e.ID)}>Editar</button>
                      <button className="black" onClick={() => this.delete(e.ID, e.url)}>Eliminar</button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            <style jsx>
              {`
						ul {
							margin: 75px auto 0;
						}
						ul > li.post {
							padding: 25px 5%;
							margin: 10px 0;
							width: 90%;
							background: white;
							border-radius: 10px;
							box-shadow: 1px 1px 5px gray;
							position: relative;
							display: flex;
							align-items: center;
						}
						ul li.post .image {
							background-size: cover;
							background-position: center;
							display: inline-block;
							width: 100px;
							height: 100px;
						}
						ul li.post .image-title {
							width: 100px;
							height: 100px;
							display: inline-flex;
							justify-content: center;
							align-items: center;
							background: black;
							color: white;
							font-size: 32px;
						}
						ul li.post .data {
							display: inline-block;
							margin: 0 0 0 25px;
						}
						ul li.post .buttons {
							position: absolute;
							bottom: 5%;
							right: 1%;
						}
						ul li.post .buttons button {
							margin: 0 10px
						}
						ul li.post span {
							margin: 5px;
							display: inline-block;
						}
						ul li.post span.tags {
							display: block;
							color: #7f7f7f;
							font-size: 14px;
							margin: 10px;
						} 
						.align {
							display: inline-flex;
							align-items: center;
						}
						.align img {
							width: 25px;
						}
					`}
            </style>
          </ul>
        );
      } else {
        ui = (
          <div className="center">
            <img src="/images/posts.png" />
            <button className="black" onClick={this.newPost}>Crear Entrada</button>
            <style jsx>
              {`
						.center {
							height: 80%;
						}
						img {
							margin: 50px 0 0 0;
						}
					`}
            </style>
          </div>
        );
      }
    } else { ui = <Editor data={editData} cancel={this.cancel} />; }

    return (
      <div style={{ width: '90%' }}>
        <Head>
          <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet"/>
          <script src="https://cdn.quilljs.com/1.3.6/quill.js"/>
        </Head>
        {
				!editting
				&& (
<div className="top">
  <button className="black" onClick={this.newPost}>Nueva Entrada</button>
  <div>
    <span style={{ cursor: all > 0 ? 'pointer' : 'default' }} onClick={() => { all > 0 ? this.filter('*') : null; }}>
      Todos (
      {all}
      )
    </span>
    <span style={{ cursor: published > 0 ? 'pointer' : 'default' }} onClick={() => { published > 0 ? this.filter('published') : null; }}>
      Publicados (
      {published}
      )
    </span>
    <span style={{ cursor: drafted > 0 ? 'pointer' : 'default' }} onClick={() => { drafted > 0 ? this.filter('draft') : null; }}>
      Guardados (
      {drafted}
      )
    </span>
    <span style={{ cursor: imported > 0 ? 'pointer' : 'default' }} onClick={() => { imported > 0 ? this.filter('imported') : null; }}>
      Importados (
      {imported}
      )
    </span>
  </div>
</div>
				)
			}
        {ui}
        <style jsx>
          {`
				.top div {
					flex-grow: 1;
					padding: 0 0 0 50px;
				}
				.top div span {
					margin: 0 15px;
				}
				button.black {
					position: relative;
					top: 0;
				}
			`}
        </style>
      </div>
    );
  }
}
export default Posts;
