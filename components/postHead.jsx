import React from "react";
import NextHead from "next/head";
import { string, array } from "prop-types";

const defaultDescription = "JavaScript, tecnología, informática y mas JavaScript en este blog. Un simple blog de un desarrollador JavaScript Venezolano.";
const defaultOGURL = "https://davidsdevel-blog.herokuapp.com";
const defaultOGImage = "https://davidsdevel-blog.herokuapp.com/images/og.jpg";

const Head = ({description, title, image, url, category, published, tags}) => (
	<NextHead itemscope itemtype="http://schema.org/Article">
	    <title>{title + " - David's Devel" || "David's Devel - Blog"}</title>
	    <meta
			name="description"
			content={description || defaultDescription}
	    />
	    <meta name="viewport" content="width=device-width, initial-scale=1" />
	    <link rel="icon" sizes="192x192" href="/touch-icon.png" />
	    <link rel="apple-touch-icon" href="/touch-icon.png" />
	    <link rel="mask-icon" href="/favicon-mask.svg" color="#49B882" />
	    <link rel="icon" href="/favicon.ico" />

	    <link href={image || defaultOGImage} rel='image_src'/>
	    <link rel="canonical" href={url ? "https://davidsdevel-blog.herokuapp.com" + url: defaultOGURL}/>

	    <meta property="og:site_name" content="David's Devel - Blog" />
	    <meta content='100000619759917' property='fb:admins'/>
	    <meta content='337231497026333' property='fb:app_id'/>
	    <meta content='es_LA' property='og:locale'/>
  
	    <meta content='article' property='og:type'/>
		<meta name="author" content="David González"/>
	    <meta property='article:author' content='https://www.facebook.com/David.ImpulseWD' />
	    <meta property='article:publisher' content='https://www.facebook.com/davidsdevel' />
	    <meta content={category[0].toUpperCase() + category.slice(1)} property='article:section'/>
	    <meta content={published} property='article:published_time'/>
	    {tags.map(e => (<meta key={`tag-${e}`} content={e} property="article:tag"/>))}

	    <meta content='@davidsdevel' name='twitter:site'/>
	    <meta content='@davidsdevel' name='twitter:creator'/>
	    <meta content='summary_large_image' name='twitter:card'/>
  
	    <meta content={title || "David's Devel"} itemProp="name" property='og:title'/>
	    <meta content={title || "David's Devel"} name='twitter:title'/>

    	<meta content={description || defaultDescription} itemProp='description'/>
    	<meta content={description || defaultDescription} property='og:description'/>
    	<meta content={description || defaultDescription} name='twitter:description'/>

		<meta content={image || defaultOGImage} property='og:image'/>
		<meta content={image || defaultOGImage} name='twitter:image'/>
    	<meta content={image || defaultOGImage} itemProp='image'/>

    	<meta content={url ? "https://davidsdevel-blog.herokuapp.com" + url: defaultOGURL} itemProp='url'/>
    	<meta content={url ? "https://davidsdevel-blog.herokuapp.com" + url: defaultOGURL} property='og:url'/>
    	<meta content={url ? "https://davidsdevel-blog.herokuapp.com" + url: defaultOGURL} name='twitter:url'/>

  		<link rel="manifest" href="/manifest.json"/>
	</NextHead>
);

Head.propTypes = {
	title: string,
	description: string,
	url: string,
	image: string,
	tags: array,
	published: string,
	category: string
};

export default Head;


/*
<!-- namespace declaration -->
<html prefix="og: http://ogp.me/ns#">
  
<!-- define microdata scope and type -->
  <head itemscope itemtype="http://schema.org/Article">
    <title>Social Site Example</title>
	
	<!-- define ogp and itemprop of microdata in one line -->
    <meta property="og:title" itemprop="name" content="Enjoy Fireworks">
	
	<!-- define ogp image -->
    <meta property="og:image"
          content="https://developers.google.com/web/imgs/fireworks.jpg">
	
		  <!-- use link[href] to define image url for microdata -->
    <link itemprop="image" href="//developers.google.com/web/imgs/fireworks.jpg">
	
	<!-- define ogp and itemprop of microdata in one line -->
    <meta property="og:url"
          content="https://example.com/discovery-and-distribution/optimizations-for-crawlers/social-sites2.html">
	
		  <!-- define ogp type -->
    <meta property="og:type" content="website">
	
	<!-- define twitter cards type -->
    <meta name="twitter:card" content="summary_large_image">
	
	<!-- define site's owner twitter id -->
    <meta name="twitter:site" content="agektmr">
	
	<!-- define description for ogp and itemprop of microdata in one line -->
    <meta property="og:description" itemprop="description"
          content="Fireworks are beautiful. This article explains how beautiful fireworks are.">
	
		  <!-- general description (separate with ogp and microdata) -->
    <meta name="description"
		  content="Fireworks are beautiful. This article explains how beautiful fireworks are.">

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://code.getmdl.io/1.2.1/material.indigo-pink.min.css">
    <script defer src="https://code.getmdl.io/1.2.1/material.min.js"></script>
    <style>
      body {
        margin: 2em;
      }
    </style>
  </head>
*/