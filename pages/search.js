import React, {Component} from "react";
import fetch from "isomorphic-fetch";
import Router from "next/router";
import Link from 'next/link';
import Nav from '../components/nav'
import Head from '../components/head'
import Landing from '../components/index/landing';
import Card from '../components/index/card';
import Footer from '../components/index/footer';
import {setBanner, asideBanner} from "../lib/banners";

class Search extends Component {
	static async getInitialProps({req, res, asPath}) {
		var query;
		if (/\/?q=.*/.test(asPath)) {
			var search;
			var url;
			if (!req) {
				url = `${location.origin}/find-posts`;

				search = asPath.match(/=.*(?=&|$)/)[0].replace("=", "");
			} else {
				console.log(req.headers)
				url = `http://localhost:3000/find-posts`;

				search = req.query.q;
			}
			const preq = await fetch(`${url}?q=${search}`);
			query = await preq.json();
			console.log(url);

		} else {
			if (!req)
				Router.push("/");
			else
				res.redirect(301, "/");
		}

		return query;
	}
	render() {
		return (
			<div>
				<Head title="David's Devel" url={pathname}/>
				<Nav title="David's Devel"/>
        		<h1>David's Devel</h1>
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
				<button onClick={this.viewMore}>Ver Más</button>
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
              margin: 5% 0 0 0;
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

export default Search;
