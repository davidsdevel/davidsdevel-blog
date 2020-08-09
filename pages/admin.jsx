import React, { Component } from 'react';
import Head from 'next/head';
import NoAuth from '../components/admin/login';
import Dashboard from '../components/admin/dashboard';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
    };

    this.onLogin = this.onLogin.bind(this);
  }

  static async getInitialProps({ req }) {
    let auth = false;

    if (req) {
      if (req.session) {
        const { session } = req;
        if (session.adminAuth) {
          auth = true;
        }
      }
    }
    return {
      auth,
      hideLayout: true,
    };
  }

  onLogin() {
    this.setState({
      auth: true,
    });
  }

  render() {
    const { auth } = this.state;

    return (
      <div>
        <Head>
          <title>{"David's Devel - Admin"}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />

          <link rel="stylesheet" href="//unpkg.com/grapesjs/dist/css/grapes.min.css" defer/>
          <link rel="stylesheet" href="//unpkg.com/grapesjs-preset-newsletter/dist/grapesjs-preset-newsletter.css" defer/>
          <link href="/grapesjs-preset-website.min.css" rel="stylesheet" defer/>

          <script src="//unpkg.com/grapesjs" />
          <script src="//cdn.ckeditor.com/ckeditor5/21.0.0/classic/ckeditor.js" async/>
          <script src='//unpkg.com/grapesjs-preset-newsletter' async/>
          <script src="/grapesjs-preset-website.js" async></script>
          <script src="/grapesjs-preset-ckeditor.js" async></script>
        </Head>
        {
				auth
				  ? <Dashboard />
				  : <NoAuth onLogin={this.onLogin} />
			}
        <style jsx global>
          {`
				body {
					background: #f7f7f7;
				}
			`}
        </style>
      </div>
    );
  }
}
export default Admin;
