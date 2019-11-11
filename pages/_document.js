import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class extends Document {
	static async getInitialProps(ctx) {
		const path = ctx.asPath;
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps, path}
	}
	render() {
		return (
			<Html prefix="og: https://ogp.me/ns# fb: https://ogp.me/ns/fb# article: https://ogp.me/ns/article#">
				<Head/>
				<body>
					<div id="fb-root"/>
					{
						this.props.path !== "/admin" &&
						<div>
							<script defer src="https://www.gstatic.com/firebasejs/6.2.0/firebase-app.js"></script>
							<script defer src="https://www.gstatic.com/firebasejs/6.2.0/firebase-messaging.js"></script>
							<script defer src="/static/messaging.js"></script>
						</div>
					}
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}