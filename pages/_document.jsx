import Document, {
  Html, Head, Main, NextScript,
} from 'next/document';
import React from 'react';

export default class CustomDocument extends Document {
  static async getInitialProps(ctx) {
    const path = ctx.asPath;
    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps, path };
  }

  render() {
    const { buildId } = this.props.__NEXT_DATA__;
    const {
      files, lowPriorityFiles, polyfillFiles, devFiles, pages
    } = this.props;
    console.log(pages);
    const devID = NextScript.contextType[1]._devOnlyInvalidateCacheQueryString;
    const toCache = Object.assign([], files, lowPriorityFiles, polyfillFiles, devFiles).filter(e => e).map(e => (`/_next/${e}${devID}`));

    return (
      <Html style={{ scrollBehavior: 'smooth' }} prefix="og: https://ogp.me/ns# fb: https://ogp.me/ns/fb# article: https://ogp.me/ns/article#">
        <Head />
        {
					!this.props.__NEXT_DATA__.props.pageProps.isPreview
					  ? (
              <body>
                <div id="fb-root" />
                <Main />
                <NextScript />
                {
							    process.env.NODE_ENV !== 'development' && (
                    <script dangerouslySetInnerHTML={{ __html: `caches.open("offline-app").then(function (cache) {cache.addAll(${JSON.stringify(toCache)});});` }} />
							    )
                }
              </body>
					  )
					  : (
              <body style={{ display: 'block' }}>
                <div style={{
						      position: 'fixed',
						      top: 0,
						      left: 0,
						      width: '100%',
						      height: '100%',
						      zIndex: 1,
                }}>
                <img src="../../images/preview.png" />
              </div>
              <Main />
            </body>
					)
        }
      </Html>
    );
  }
}
