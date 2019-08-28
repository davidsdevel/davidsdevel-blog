import React, {Component} from 'react'
import Link from 'next/link';
import Nav from '../components/nav'
import Head from '../components/head'
import Landing from '../components/index/landing';
import Card from '../components/index/card';
import Footer from '../components/index/footer';
import {setBanner, asideBanner} from "../lib/banners";

class Home extends Component {
  static async getInitialProps({req, query, asPath, pathname}) {
    var page = 1;
    if (!req) {
      var url = `${location.origin}/client-posts`;
      if (/\/?page=\d*/.test(asPath)) {
        page = parseInt(asPath.match(/\d/)[0]);
        url += asPath;
      }
      const preq = await fetch(url);
      query = await preq.json();

      query = {
        ...query,
        pathname
      }
    }
    if (/\/?page=\d*/.test(asPath))
      page = parseInt(asPath.match(/\d/)[0]);

    query.page = page;
		return query;
	}
	render() {
    const {pathname, page} = this.props;
		const generatePagesCount = () => {
			var pages = [];
			const totalPages = Math.floor(this.props.totalItems / 10) + 1;
			for (let i = 1; i <= totalPages; i++) {
				var href;
				if (i === 1)
					href = "/";
				else
					href = `/?page=${i}`;
				pages.push(<Link href={href} prefetch key={`pagination-${i}`}><a className={page === i ? "page-active" : undefined}>{i}</a></Link>);
			}
			return pages;
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
					{this.props.items.map(({content, title, image, url}, i) => {
						url = url.replace("http://davidsdevel.blogspot.com", "").replace(".html", "");
						return <Card
             key={`blog-index-${i}`}
             title={title}
             content={content}
             url={url}
             image={image}
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
            width: 80%;
            background: #ccc;
            margin: auto;
            padding: 5px;
            border-radius: 50px;
            display: flex;
            justify-content: space-between;
          }
          :global(#pagination-container a) {
            background: #ccc;
            color: white;
            padding: 10px 15px;
            border-radius: 50%;
            display: inline-block;
            font-weight: bold;
          }
          :global(#pagination-container a.page-active) {
            background: white;
            color: #03A9F4;
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
              background: #ccc;
              margin: 0 0 0 10%;
              padding: 5px;
              border-radius: 50px;
              display: flex;
              justify-content: space-between;
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
