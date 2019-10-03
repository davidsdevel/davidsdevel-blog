import React, {Component} from 'react'
import Link from 'next/link';
import Nav from '../components/nav'
import Head from '../components/head'
import Landing from '../components/index/landing';
import Card from '../components/index/card';
import Footer from '../components/index/footer';
import {setBanner, asideBanner} from "../lib/banners";
import fetch from "isomorphic-fetch";

class Home extends Component {
  static async getInitialProps({req, query, asPath}) {
    var page = 1;

    if (/\/?page=\d*/.test(asPath))
      page = parseInt(asPath.match(/\d/)[0]);

    const r = await fetch(`http://localhost:3000/posts/all?page=${page}`);
    query.data = await r.json();
    console.log(query.data)

    query = {
      ...query,
      page
    };

    return query;
  }
  componentDidMount() {
    initializeFB();
  } 
  render() {
    const {page} = this.props;
		const generatePagesCount = () => {
			var pages = [];
			const totalPages = Math.floor(this.props.totalItems / 10) + 1;

      if (page === 1 && totalPages > 1)
        return (<Link href={`/?page=2`} prefetch key={`pagination-2`}>
          <a className="next">
            <img style={{transform: "rotate(270deg)"}} src="/static/assets/arrow-white.svg"/>
          </a>
        </Link>);
      else if (page === 1 && totalPages === 1) 
        return;

      else if (page > 1 && page < totalPages)
        return (<div>
          <Link href={`/?page=${page - 1}`} prefetch>
            <a className="prev">
              <img style={{transform: "rotate(90deg)"}} src="/static/assets/arrow-white.svg"/>
            </a>
          </Link>
          <Link href={`/?page=${page + 1}`} prefetch>
            <a className="next">
              <img style={{transform: "rotate(270deg)"}} src="/static/assets/arrow-white.svg"/>
            </a>
          </Link>
        </div>);

      else if (page > 1 && page === totalPages)
        return (<Link href={`/?page=${page - 1}`} prefetch>
          <a className="prev">
            <img style={{transform: "rotate(90deg)"}} src="/static/assets/arrow-white.svg"/>
          </a>
        </Link>);
		}
		return (
			<div>
				<Head title="David's Devel - Blog"/>
				<Nav title="David's Devel"/>
				<Landing/>
        <h1>David's Devel</h1>
        <h2>Un simple blog de un Desarrollador Javascript Venezolano.</h2>
        <div className="banner-container">
          {setBanner()}
        </div>
				<div id="posts-container">
          <span style={{marginLeft: "5%", display: "block"}}>Entradas</span>
					{this.props.data.map(({description, title, image, url, views}, i) => {
						url = url.replace("http://davidsdevel.blogspot.com", "").replace(".html", "");
						return <Card
             key={`blog-index-${i}`}
             title={title}
             content={description}
             url={url}
             image={image}
             views={views}
            />
					})}
				</div>
        <aside>
          {asideBanner()}
          {asideBanner()}
        </aside>
				<div id="pagination-container">
					{generatePagesCount()}
				</div>
        <div className="banner-container">
          {setBanner()}
        </div>
				<Footer/>
				<style jsx>{`
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
          .banner-container {
            margin 50px 0;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          aside {
            display: none;
          }
          #pagination-container {
            position: relative;
            width: 80%;
            margin: 0 auto 100px;
            padding: 5px;
          }
          :global(#pagination-container a) {
            background: #03A9F4;
            padding: 10px 15px;
            border-radius: 50%;
            display: inline-block;
            font-weight: bold;
          }
          :global(.next) {
            position: absolute;
            right: 0;
          }
          :global(.prev) {
            position: absolute;
            left: 0;
          }
          @media screen and (min-width: 720px) {
            h2 {
              width: 60%;
            }
            aside {
              float: right;
              margin-right: 5%;
              display: flex;
              justify-content: center;
              float: right;
              flex-direction: column;
              margin-top: 50px;
            }
            aside iframe {
              margin 20px 0;
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
				`}</style>
			</div>
		)
	}
}

export default Home;

/*
<div id="fb-root"></div>
<script async defer crossorigin="anonymous" src="https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v4.0&appId=337231497026333&autoLogAppEvents=1"></script>


Like Button
<div class="fb-like" data-href="https://blog.davidsdevel.com${pathname}" data-width="" data-layout="button_count" data-action="like" data-size="large" data-show-faces="false" data-share="false"></div>
*/
