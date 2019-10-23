import React, {Component} from "react";
import NoAuth from "../components/admin/login";
import Dashboard from "../components/admin/dashboard";

class Admin extends Component {
	static async getInitialProps({req}) {
		var auth = false;
		if (req) {
			console.log(req.session)
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
