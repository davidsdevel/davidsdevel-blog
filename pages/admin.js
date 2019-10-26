import React, {Component} from "react";
import NoAuth from "../components/admin/login";
import Dashboard from "../components/admin/dashboard";
import Head from "next/head";

class Admin extends Component {
	static async getInitialProps({req}) {
		var auth = false;
		if (req) {
			if (req.session) {
				const {session} = req;
				if (session.adminAuth) {
					auth = true;
				}
			}
		}
		return {
			auth
		}
	}
	render() {
		const {auth} = this.props;
		return <div>
			<Head>
	    		<title>{"David's Devel - Admin"}</title>
	    		<meta name="viewport" content="width=device-width, initial-scale=1" />
	    		<link rel="icon" href="/static/favicon.ico" />
			</Head>
			{
				auth ?
				<Dashboard/>:
				<NoAuth/>
			}
			<style jsx global>{`
				* {
					margin: 0;
					padding: 0;
				}
			`}</style>
		</div>
	}
}
export default Admin;
