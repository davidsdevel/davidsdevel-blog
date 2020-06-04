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
				{
					!this.props.__NEXT_DATA__.props.pageProps.isPreview ?
					<body>
						<div id="fb-root"/>
						<Main />
						<NextScript />
					</body>
					:
					<body style={{display: "block"}}>
						<div style={{
							position: "fixed",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							zIndex: 1
						}}>
							<img src="../../images/preview.png"/>
						</div>
						<Main />
					</body>
				}
			</Html>
		)
	}
}