import React, { Component } from 'react';
import Link from 'next/link';
import fetch from 'isomorphic-fetch';
import Head from '../components/head';
import Landing from '../components/index/landing';
import Card from '../components/index/card';
import Banners from '../components/banners';
import { setBanner } from '../lib/banners';

class Home extends Component {
  static async getInitialProps({ req, query, asPath }) {
    const page = query.page || 1;
    let isSubscribe = false;
    let isOffline = false;

    let data;

    const rdata = await fetch(`${process.env.ORIGIN}/api/blog/config`);
    const blogData = await rdata.json();

    try {
      const r = await fetch(`${process.env.ORIGIN}/api/posts/all?page=${page}&fields=description,title,image,url,comments,category,ID`);
      const rmv = await fetch(`${process.env.ORIGIN}/api/posts/most-viewed?fields=description,title,image,url,comments,category,ID`);

      const { posts, next, prev } = await r.json();

      if (req) { isSubscribe = req.session.isSubscribe; }
      else { isSubscribe = localStorage.getItem('isSubscribe'); }

      data = {
        posts,
        next,
        prev,
        recommended: await rmv.json(),
      };
    } catch (err) {
      console.error(err);
      if (err.toString() === 'TypeError: Failed to fetch') {
        isOffline = true;
      }
    } finally {

      return {
        ...data,
        isOffline,
        isSubscribe,
        blogData,
        page,
      };
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      ...props,
    };

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    if (process.env.NODE_ENV === 'development' || navigator.onLine) { return; }

    const page = this.props.page * 10;

    let next; let
      prev = false;

    const data = JSON.parse(localStorage.getItem('saved-posts'));

    if (data[page]) { next = true; }

    if (data[page - 11]) { prev = true; }

    this.setState({
      isOffline: true,
      prev,
      next,
      posts: data.slice(page - 10, page),
    });
  }

  render() {
    const {
      isOffline, page, blogData, isSubscribe, posts, next, prev, recommended,
    } = this.state;

    const generatePagesCount = () => (
      <div style={{ height: 56 }}>
        {
				prev
				&& (
<Link href={`/?page=${page - 1}`}>
  <a className="prev">Anterior</a>
</Link>
				)
			}
        {
				next
				&& (
<Link href={`/?page=${page + 1}`}>
  <a className="next">Siguiente</a>
</Link>
				)
			}
        <style jsx>
          {`
				a {
					color: #03A9F4;
				}
				.next {
					position: absolute;
					right: 0;
				}
				.prev {
					position: absolute;
					left: 0;
				}
			`}
        </style>
      </div>
    );

    return (
      <div>
        <Head title={`${blogData.title} - Blog`} description={blogData.description} />
        <Landing isSubscribe={isSubscribe} description={blogData.description} />
        <h1>{blogData.title}</h1>
        {
					!isSubscribe
					&& <h2>{blogData.description}</h2>
				}
        { posts.length > 0
          ? (
            <div id="main">
              {' '}
              {
						!isOffline && (
<div>
  <span style={{ marginLeft: '5%', display: 'block' }}>Te puede interesar</span>
  <div className="banner-container">
    <Card
      ID={recommended.ID}
      title={recommended.title}
      content={recommended.description}
      url={recommended.url}
      image={recommended.image}
      comments={recommended.comments}
      category={recommended.category}
      size="big"
    />
    {setBanner()}
  </div>
</div>
						)
					}
              <div id="posts-container">
                <span style={{ marginLeft: '5%', display: 'block' }}>Entradas</span>
                {posts.map(({
                  ID, description, title, image, url, comments, category,
                }, i) => (
                  <Card
                    key={`blog-index-${i}`}
                    title={title}
                    content={description}
                    url={url}
                    image={image}
                    comments={comments}
                    ID={ID}
                  />
                ))}
              </div>
              <Banners length={posts.length} />
            </div>
          )
				  : (
  <div id="entries">
    <span>No Hay Entradas</span>
    <Banners length={posts.length} />
  </div>
				  )}
        <div id="pagination-container">
          {generatePagesCount()}
        </div>
        <div className="banner-container banner-bottom">
          {setBanner()}
        </div>
        <style jsx>
          {`
					h1 {
						margin: 50px 0 20px;
					}
					h1, h2 {
						text-align: center;
					}
					h2 {
						width: 90%;
						margin: auto;
					}
					:global(.banner-container) {
						margin 10px 0;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-direction: column;
					}
					#main {
						margin-top: 50px;
					}
					#pagination-container {
						position: relative;
						width: 80%;
						margin: 0 auto 100px;
						padding: 5px;
					}
					#entries {
						padding: 100px 0;
						width: 100%;
						text-align: center;
					}
					@media screen and (min-width: 720px) {
						:global(.banner-container) {
							margin: 0;
							margin-top: -25px;
							display: flex;
							flex-direction: row;
							justify-content: space-between;
							padding: 2%;
						}
						.banner-bottom {
							justify-content: center;
							width: 75%;
						}
						h2 {
							width: 60%;
						}
						#entries {
							display: inline-block;
							padding: 160px 0;
							text-align: center;
						}
						#posts-container {
							display: inline-block;
							width: 75%;
						}
						#pagination-container {
							width: 50%;
							margin: 0 0 0 10%;
							padding: 5px;
						}
					}
				`}
        </style>
      </div>
    );
  }
}

export default Home;
