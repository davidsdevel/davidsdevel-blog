import React from 'react';
import App from 'next/app';
import Router from 'next/router';
import Head from 'next/head';
import Load from '../components/loadBar';
import Nav from '../components/nav';
import Modal from '../components/index/subscriptionModal';
import Footer from '../components/index/footer';
import Facebook from '../lib/client/FacebookSDK';
import Alert from '../components/alert';
import store from '../store';
import { showAlert } from '../store/actions';

export default class CustomApp extends App {
  constructor() {
    super();
    this.state = {
      showLoad: false,
    };

    this.paths = [];
    this.sessionTime = 0;
  }

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    let referer;

    if (Component.getInitialProps) { pageProps = await Component.getInitialProps(ctx); }

    if (ctx.req) { referer = ctx.req.headers.referer; }

    if (Component.name === 'ErrorPage') { pageProps.hideLayout = true; }

    referer = referer || 'https://blog.davidsdevel.com';

    return {
      pageProps,
      referer: encodeURI(referer),
      viewUrl: pageProps.viewUrl || undefined,
    };
  }

  async setView() {
    if (this.props.pageProps.hideLayout || this.props.viewUrl === '/') { return; }

    try {
      const { viewUrl, referer } = this.props;

      const req = await fetch(`${process.env.ORIGIN}/api/posts/set-view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: viewUrl,
          referer,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  }

  componentDidMount() {
    window.alert = (msg) => store.dispatch(showAlert(msg));

    if (this.props.Component.name !== 'Admin') {
      this.paths.push(this.props.router.asPath);

      setInterval(() => this.sessionTime += 1, 1000);

      if (process.env.NODE_ENV !== 'development') {
          navigator.serviceWorker.register('/offline-sw.js').then((e) => e.update());
      }

      Facebook.init();

      this.setView();

      window.addEventListener("unload", () => fetch('/api/set/unload'));

      const html = document.getElementsByTagName('html')[0];

      Router.events.on('routeChangeStart', () => {
        html.style.scrollBehavior = '';
    
        this.setState({
          showLoad: true,
        });
      });
    
      Router.events.on('routeChangeComplete', () => {
        Facebook.init();
        this.setView();
    
        window.scrollTo(0, 0);
    
        this.paths.push(this.props.router.asPath);
    
        html.style.scrollBehavior = 'smooth';
    
        this.setState({
          showLoad: false,
        });
      });
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    const { showLoad } = this.state;

    return (
      <div>
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet"/>
          {
            pageProps.next &&
            <link rel="next" />
          }
          {
            pageProps.prev
            && <link rel="prev" />
          }
        </Head>
        {
          (showLoad && !pageProps.hideLayout)
          && <Load />
        }
        {
          !pageProps.hideLayout
          && (
            <div>
              <Nav />
              <Modal />
            </div>
          )
        }
        <Component {...pageProps} />
        {
          !pageProps.hideLayout
          && <Footer />
        }
        <Alert />
        <style jsx global>
          {`
                input[type=checkbox],
                input[type=radio] {
                    display: none;
                }
                input[type=checkbox]:checked + label.option::before,
                input[type=radio]:checked + label.option::before {
                    width: 15px;
                    height: 15px;
                    border: 5px solid #f0f0f0;
                    background: #555;
                }
                label.option {
                    display: flex;
                    align-items: center;
                    position: relative;
                    background: white;
                    padding: 8px 16px;
                    box-shadow: 1px 1px 5px rgba(0,0,0,.3);
                    margin: 5px 0;
                    border-radius: 5px;
                    max-width: 400px;
                    cursor: pointer;

                    transition: ease .3s;
                }
                label.option:hover {
                    background: #f0f0f0;
                }
                label.option::before {
                    content: "";
                    width: 25px;
                    height: 25px;
                    margin: 0 16px 0 0;
                    background: rgb(243, 245, 247);
                    border-radius: 5px;
                    display: inline-block;
                }
                button:focus {
                    outline: none;
                }
                li {
                    list-style: none;
                }
                a {
                    text-decoration: none;
                }
                * {
                    margin: 0;
                    padding: 0;
                    font-family: Roboto, Helvetica;
                }
                hr {
                    border: .5px rgba(0,0,0,.1) solid;
                }
                .title {
                    font-size: 26px;
                    font-weight: bold;
                    text-align: center;
                    display: block;
                    margin: 15px 0;
                }
                .sub-title {
                    font-size: 20px;
                    font-weight: bold;
                }
                input:focus {
                    outline: none;
                }
                input[type="text"],
                input[type="password"],
                input[type="email"],
                textarea,
                button.gray,
                button.black,
                button.white,
                button.circle
                {
                    background: white;
                    padding: 10px 20px;
                    border: none;
                    box-shadow: rgba(0,0,0,.3) 1px 1px 2px;
                    border-radius: 10px;
                }
                input[type="text"].search {
                    padding: 0;
                    box-shadow: none;
                }
                button {
                    cursor: pointer;
                    transition: ease .3s;
                    border-radius: 5px;
                }
                button:disabled {
                  filter: brightness(.3);
                }
                button.white:hover, button.black {
                    background: #1d1d1d;
                    color: white;
                }
                button.gray {
                    background: #7f7f7f;
                    color: white;
                }
                button.black:hover, button.gray:hover, button.white {
                    background: white;
                    color: black;
                }
                button.circle {
                    padding: 20px;
                    border-radius: 50%;
                }
                button:disabled {
                    background: black;
                    color: gray;
                    box-shadow: none;
                    cursor: default;
                }
                button:disabled:hover {
                    background: black;
                    color: gray;
                }
                @keyframes rotation {
                    0% {
                        transform: rotate(0deg);
                    } 100% {
                        transform: rotate(359deg);
                    }
                }
                aside.banners {
                    display: none;
                }
                @media screen and (min-width: 780px) {
                    aside.banners {
                        float: right;
                        margin-right: 5%;
                        display: flex;
                        justify-content: center;
                        flex-direction: column;
                        margin-top: 50px;
                    }
                    aside.banners a {
                        display: block;
                    }
                }
            `}
        </style>
      </div>
    );
  }
}
