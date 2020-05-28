import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class CustomDocument extends Document {
	static async getInitialProps(ctx) {
		const path = ctx.asPath;
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps, path}
	}
	render() {
		return (
			<Html style={{scrollBehavior: "smooth"}} prefix="og: https://ogp.me/ns# fb: https://ogp.me/ns/fb# article: https://ogp.me/ns/article#">
				<Head/>
				<body>
					<div id="fb-root"/>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}