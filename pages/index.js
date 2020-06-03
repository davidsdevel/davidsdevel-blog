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
		var isSubscribe = false;

		if (/\/?page=\d*/.test(asPath))
			page = asPath.match(/\d/)[0] * 1;

		if (req)
			isSubscribe = req.session.isSubscribe;
		else
			isSubscribe = localStorage.getItem("isSubscribe");

		const r = await fetch(`${process.env.ORIGIN}/posts/all?page=${page}&fields=description,title,image,url,comments,category,ID`);
		const rmv = await fetch(`${process.env.ORIGIN}/posts/most-viewed?fields=description,title,image,url,comments,category,ID`);
		const rdata = await fetch(`${process.env.ORIGIN}/blog/config`);

		const {posts, next, prev} = await r.json();

		const data = {
			posts,
			next,
			prev,
			page,
			blogData: await rdata.json(),
			recommended: await rmv.json(),
			isSubscribe,
			viewUrl: "/"
		}

		return data;
	}
	render() {
    const {page, posts, next, prev, recommended, blogData, isSubscribe} = this.props;

		const generatePagesCount = () => {
			var pages = [];
			const totalPages = Math.floor(this.props.totalItems / 10) + 1;

			return <div style={{height: 56}}>
				{
          prev &&

          <Link href={`/?page=${page - 1}`}>
            <a className="prev">Anterior</a>
          </Link>
        }
        {
          next &&
          <Link href={`/?page=${page + 1}`}>
            <a className="next">Siguiente</a>
          </Link>
        }
        <style jsx>{`
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
        `}</style>
      </div>
		}
    const Banners = () => <aside className="banners">
      <a href="https://share.payoneer.com/nav/8KWKN89znbmVoxDtLaDPDhoy-Hh5_0TAHI8v5anfhDJ6wN3NOMMU3rpV5jk6FSfq9t5YNnTcg-XSxqiV1k7lwA2" target="_blank" onClick={() => FB.AppEvent.logEvent("Click on Payoneer Banner")}>
        <img src="/images/payoneer.png"/>
      </a>
      {
        posts.length > 2 && 
        <a href="https://platzi.com/r/davidsdevel/" target="_blank" onClick={() => FB.AppEvent.logEvent("Click on Platzi Banner")}>
          <img src="/images/platzi.png"/>
        </a>
      }
    </aside>;

		return (
			<div>
				<Head title={blogData.title + " - Blog"} description={blogData.description}/>
				<Landing isSubscribe={isSubscribe} description={blogData.description}/>
        <h1>{blogData.title}</h1>
        {
        	!isSubscribe &&
        	<h2>{blogData.description}</h2>
        }
        { posts.length > 0 ?
          <div id="main">
            <span style={{marginLeft: "5%", display: "block"}}>Te puede interesar</span>
            <div className="banner-container">
              <Card
                ID={recommended.ID}
                title={recommended.title}
                content={recommended.description}
                url={recommended.url}
                image={recommended.image}
                comments={recommended.comments}
                category={recommended.category}
                size={"big"}
               />
              {setBanner()}
            </div>
				    <div id="posts-container">
              <span style={{marginLeft: "5%", display: "block"}}>Entradas</span>
				    	{posts.map(({ID, description, title, image, url, comments, category}, i) => {
				    		return <Card
                 key={`blog-index-${i}`}
                 title={title}
                 content={description}
                 url={url}
                 image={image}
                 comments={comments}
                 ID={ID}
                />
				    	})}
				    </div>
            <Banners/>
          </div>
          :
          <div id="entries">
            <span>No Hay Entradas</span>
            <Banners/>
          </div>
        }
				<div id="pagination-container">
					{generatePagesCount()}
				</div>
        <div className="banner-container banner-bottom">
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
				`}</style>
			</div>
		)
	}
}

export default Home;
