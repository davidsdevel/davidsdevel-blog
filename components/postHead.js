import React from "react";
import NextHead from "next/head";
import { string, array } from "prop-types";

const defaultDescription = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
const defaultOGURL = "https://oieniv-website.firebaseapp.com/";
const defaultOGImage = "https://oieniv-website.firebaseapp.com/static/image.jpg";

const Head = props => (
	<NextHead>
		<meta charSet="UTF-8" />
	    <title>{props.title + " - David's Devel" || "David's Devel"}</title>
	    <meta
	      name="description"
	      content={props.description || defaultDescription}
	    />
	    <meta name="viewport" content="width=device-width, initial-scale=1" />
	    <link rel="icon" sizes="192x192" href="/static/touch-icon.png" />
	    <link rel="apple-touch-icon" href="/static/touch-icon.png" />
	    <link rel="mask-icon" href="/static/favicon-mask.svg" color="#49B882" />
	    <link rel="icon" href="/static/favicon.ico" />

	    <link href={props.image || defaultOGImage} rel='image_src'/>
	    <link rel="canonical" href={props.url}/>

	    <meta property="og:site_name" content="David's Devel - Blog" />
	    <meta content='100000619759917' property='fb:admins'/>
	    <meta content='337231497026333' property='fb:app_id'/>
	    <meta content='es_LA' property='og:locale'/>
  
	    <meta content='article' property='og:type'/>
	    <meta property='article:author' content='https://www.facebook.com/David.ImpulseWD' />
	    <meta property='article:publisher' content='https://www.facebook.com/davidsdevel' />
	    <meta content='Technology' property='article:section'/>
	    <meta content={props.published} property='article:published_time'/>
	    {props.tags.map(e => (<meta key={`tag-${e}`} content={e} property="article:tag"/>))}

	    <meta content='@davidsdevel' name='twitter:site'/>
	    <meta content='@davidsdevel' name='twitter:creator'/>
	    <meta content='summary_large_image' name='twitter:card'/>
  
	    <meta content={props.title || "David's Devel"} property='og:title'/>
	    <meta content={props.title || "David's Devel"} itemProp='name'/>
	    <meta content={props.title || "David's Devel"} name='twitter:title'/>

    	<meta content={props.description || defaultDescription} itemProp='description'/>
    	<meta content={props.description || defaultDescription} property='og:description'/>
    	<meta content={props.description || defaultDescription} name='twitter:description'/>

		<meta content={props.image || defaultOGImage} property='og:image'/>
		<meta content={props.image || defaultOGImage} name='twitter:image'/>
    	<meta content={props.image || defaultOGImage} itemProp='image'/>

    	<meta content={props.url} itemProp='url'/>
    	<meta content={props.url} property='og:url'/>
    	<meta content={props.url} name='twitter:url'/>

  		<link rel="manifest" href="/manifest.json"/>
	</NextHead>
);

Head.propTypes = {
	title: string,
	description: string,
	url: string,
	image: string,
	tags: array,
	published: string
};

export default Head;
