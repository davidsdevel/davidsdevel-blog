import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import Router from 'next/router';
import { string } from 'prop-types';
import Head from '../components/head';
import Card from '../components/index/card';
import { setBanner } from '../lib/banners';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: props.posts,
      page: 1,
    };
    this.viewMore = this.viewMore.bind(this);
  }

  static async getInitialProps({
    req, res, asPath, query,
  }) {
    const { q } = query;

    if (q) {
      const searchReq = await fetch(`${process.env.ORIGIN}/api/posts/search?q=${q}&page=1&fields=description,title,image,url,comments,category`);

      const data = await searchReq.json();

      return {
        ...data,
        search: q,
        pathname: asPath,
      };
    }
    if (!req) { Router.push('/'); } else { res.redirect(301, '/'); }
  }

  async viewMore() {
    try {
      const { search } = this.props;
      const { page, posts } = this.state;

      const req = await fetch(`/api/posts/search?q=${search}&page=${page + 1}&fields=description,title,image,url,comments,category`);
      const data = await req.json();

      this.setState({
        posts: Object.assign([], posts, data.posts),
        next: data.next,
        page: page + 1,
      });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { search, pathname } = this.props;
    const { posts, next } = this.state;

    return (
      <div>
        <Head title="David's Devel" url={pathname} />
        <span id="title">
          Busquedas para el termino:
          <b>{decodeURI(search)}</b>
        </span>
        <div className="banner-container">
          {setBanner()}
        </div>
        <div id="posts-container">
          <span style={{ marginLeft: '5%', display: 'block' }}>Entradas</span>
          {	posts.length > 0

            ? posts.map(({
              description, title, image, url, comments, category,
            }) => (
              <Card
                key={url}
                title={title}
                content={description}
                url={url}
                image={image}
                comments={comments}
                category={category}
              />
            ))
					  : (
  <div>
    <span>
      No hay entradas con el termino:
      <b>{search}</b>
    </span>
  </div>
					  )}
        </div>
        <aside className="banners">
          <a href="https://share.payoneer.com/nav/8KWKN89znbmVoxDtLaDPDhoy-Hh5_0TAHI8v5anfhDJ6wN3NOMMU3rpV5jk6FSfq9t5YNnTcg-XSxqiV1k7lwA2" target="_blank" onClick={() => FB.AppEvent.logEvent('Click on Payoneer Banner')}>
            <img src="/images/payoneer.png" />
          </a>
          {
						posts.lenght > 2
						&& (
<a href="https://platzi.com/r/davidsdevel/" target="_blank" onClick={() => FB.AppEvent.logEvent('Click on Platzi Banner')}>
  <img src="/images/platzi.png" />
</a>
						)
					}
        </aside>
        {
					!!next
					&& <button onClick={this.viewMore}>Ver Más</button>
				}
        <div className="banner-container">
          {setBanner()}
        </div>
        <style jsx>
          {`
					#title {
						margin: 100px 0 20px;
						text-align: center;
						display: block;
						font-size: 28px;
					}
					.banner-container {
						margin 50px 0;
						display: flex;
						justify-content: center;
						align-items: center;
					}
					@media screen and (min-width: 720px) {
						h2 {
							width: 60%;
						}
						#posts-container {
							display: inline-block;
							width: 75%;
						}
					}
				`}
        </style>
      </div>
    );
  }
}

Search.propTypes = {
  search: string,
  pathname: string,
};

export default Search;
