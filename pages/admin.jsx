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
          <title>David's Devel - Admin</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
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
