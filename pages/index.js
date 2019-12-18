import React, {Component} from 'react'
import Link from 'next/link';
import Head from '../components/head'
import Landing from '../components/index/landing';
import Card from '../components/index/card';
import {setBanner} from "../lib/banners";
import fetch from "isomorphic-fetch";

class Home extends Component {
  static async getInitialProps({req, query, asPath}) {
    var page = 1;

    if (/\/?page=\d*/.test(asPath))
      page = parseInt(asPath.match(/\d/)[0]);

    const r = await fetch(`${process.env.ORIGIN}/posts/all?page=${page}&fields=description,title,image,url,comments`);

    const {posts, next, prev} = await r.json();

    const data = {
      posts,
      next,
      prev,
      page
    }

    return data;
  }
  render() {
    const {page, posts, next, prev} = this.props;
		const generatePagesCount = () => {
			var pages = [];
			const totalPages = Math.floor(this.props.totalItems / 10) + 1;

      return <div style={{height: 56}}>
        {
          prev &&

          <Link href={`/?page=${page - 1}`} prefetch>
            <a className="prev">
              <img style={{transform: "rotate(90deg)"}} src="/static/assets/arrow-white.svg"/>
            </a>
          </Link>
        }
        {
          next &&
          <Link href={`/?page=${page + 1}`} prefetch>
            <a className="next">
              <img style={{transform: "rotate(270deg)"}} src="/static/assets/arrow-white.svg"/>
            </a>
          </Link>
        }
      </div>
		}
		return (
			<div>
				<Head title="David's Devel - Blog"/>
				<Landing/>
        <h1>David's Devel</h1>
        <h2>Un simple blog de un Desarrollador Javascript Venezolano.</h2>
        <div className="banner-container">
          {setBanner()}
        </div>
				<div id="posts-container">
          <span style={{marginLeft: "5%", display: "block"}}>Entradas</span>
					{posts.map(({description, title, image, url, comments}, i) => {
						return <Card
             key={`blog-index-${i}`}
             title={title}
             content={description}
             url={url}
             image={image}
             comments={comments}
            />
					})}
				</div>
        <aside>
          <a href="https://share.payoneer.com/nav/8KWKN89znbmVoxDtLaDPDhoy-Hh5_0TAHI8v5anfhDJ6wN3NOMMU3rpV5jk6FSfq9t5YNnTcg-XSxqiV1k7lwA2" target="_blank" onClick={() => FB.AppEvent.logEvent("Click on Payoneer Banner")}>
            <img src="/static/images/payoneer.png"/>
          </a>
          {
            posts.length > 2 && 
            <a href="https://platzi.com/r/davidsdevel/" target="_blank" onClick={() => FB.AppEvent.logEvent("Click on Platzi Banner")}>
              <img src="/static/images/platzi.png"/>
            </a>
          }
        </aside>
				<div id="pagination-container">
					{generatePagesCount()}
				</div>
        <div className="banner-container">
          {setBanner()}
        </div>
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
            aside a {
              display: block;
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

GET PAIDS by MARKETPLACES and Direct clients worldwide

button
  SIGN UP and EARN 25$

*/
