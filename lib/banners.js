const asideBanner = () => {
	const banners = [
    <iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=11&l=ur1&category=familiaecho&banner=0VF6TBYM68886JHPGW82&f=ifr&linkID=3d60526252eb119ccab35bb8893f96f9&t=davidsdevel-21&tracking_id=davidsdevel-21" width="120" height="600" scrolling="no" border="0" marginWidth="0" style={{border: "none", display: "block", margin: "20px 0"}} frameBorder="0"/>,
    <iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=11&l=ur1&category=electronica&banner=1176ZEDNJP3TVYPX2SR2&f=ifr&linkID=c10dea975a43e13bc8e1e22530222e36&t=davidsdevel-21&tracking_id=davidsdevel-21" width="120" height="600" scrolling="no" border="0" marginWidth="0" style={{border: "none", display: "block", margin: "20px 0"}} frameBorder="0"/>,
    <iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=11&l=ur1&category=kindlestore&banner=09WN67J73ZE121RSE682&f=ifr&linkID=5d76562e6da5d99cebd40723a284d87c&t=davidsdevel-21&tracking_id=davidsdevel-21" width="120" height="600" scrolling="no" border="0" marginWidth="0" style={{border: "none", display: "block", margin: "20px 0"}} frameBorder="0"/>,
    <iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=11&l=ur1&category=amazon_business&banner=0GQ5XA6W78ZZQ2KSM182&f=ifr&linkID=8c1588e7773f8417bcdf5af51b3f761e&t=davidsdevel-21&tracking_id=davidsdevel-21" width="120" height="600" scrolling="no" border="0" marginWidth="0" style={{border: "none", display: "block", margin: "20px 0"}} frameBorder="0"/>,
    <iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=11&l=ur1&category=informatica&banner=0TFST9XS5PQV8D6SE5R2&f=ifr&linkID=28a902d2709fcc17ca98c021438261c8&t=davidsdevel-21&tracking_id=davidsdevel-21" width="120" height="600" scrolling="no" border="0" marginWidth="0" style={{border: "none", display: "block", margin: "20px 0"}} frameBorder="0"/>,
    <iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=11&l=ur1&category=kindle&banner=0H3VA487X2BCDPFFX102&f=ifr&linkID=36764da90039d11d821b0d3dcde039b0&t=davidsdevel-21&tracking_id=davidsdevel-21" width="120" height="600" scrolling="no" border="0" marginWidth="0" style={{border: "none", display: "block", margin: "20px 0"}} frameBorder="0"/>,
    <iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=11&l=ur1&category=kindle_unlimited&banner=1CRTXJ6X0T4N19655TG2&f=ifr&linkID=090c11daba0a9a21979886b877aec533&t=davidsdevel-21&tracking_id=davidsdevel-21" width="120" height="600" scrolling="no" border="0" marginWidth="0" style={{border: "none", display: "block", margin: "20px 0"}} frameBorder="0"/>,
    <iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=14&l=ur1&category=premium&banner=1D9E5EF28RHYM8HGN8R2&f=ifr&linkID=6b5b416e5d29c0e5da60ff0783481cc6&t=davidsdevel-21&tracking_id=davidsdevel-21" width="160" height="600" scrolling="no" border="0" marginWidth="0" style={{border: "none", display: "block", margin: "20px 0"}} frameBorder="0"/>,
    <iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=11&l=ur1&category=videojuegos&banner=1R5THB0M4CN556248P02&f=ifr&linkID=83fdb91ad08666dcda632f016c7fe3cb&t=davidsdevel-21&tracking_id=davidsdevel-21" width="120" height="600" scrolling="no" border="0" marginWidth="0" style={{border: "none", display: "block", margin: "20px 0"}} frameBorder="0"/>,
    <iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=11&l=ur1&category=todoslosproductos&banner=00PYQ6VZ0YJAF1XCJXG2&f=ifr&linkID=e3b44b6e93329fd9a9e1bf99e67b23d3&t=davidsdevel-21&tracking_id=davidsdevel-21" width="120" height="600" scrolling="no" border="0" marginWidth="0" style={{border: "none", display: "block", margin: "20px 0"}} frameBorder="0"/>,
    <iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=11&l=ur1&category=generico&banner=1HWYNRB8SN6CQ3VANYG2&f=ifr&linkID=e0dddefdd60b2fccd56358dda04890d7&t=davidsdevel-21&tracking_id=davidsdevel-21" width="120" height="600" scrolling="no" border="0" marginWidth="0" style={{border: "none", display: "block", margin: "20px 0"}} frameBorder="0"/>,
    <iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=11&l=ur1&category=software&banner=0DBPZF4717QNF19ERTR2&f=ifr&linkID=1478356d79d534546aeccee9f8420c12&t=davidsdevel-21&tracking_id=davidsdevel-21" width="120" height="600" scrolling="no" border="0" marginWidth="0" style={{border: "none", display: "block", margin: "20px 0"}} frameBorder="0"/>,
    <iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=14&l=ur1&category=electronica&banner=1SXGJD0JBQGF25GKXGG2&f=ifr&linkID=446cacded3eddc51383c86a7f0ca7cd0&t=davidsdevel-21&tracking_id=davidsdevel-21" width="160" height="600" scrolling="no" border="0" marginWidth="0" style={{border: "none", display: "block", margin: "20px 0"}} frameBorder="0"/>
  ];

  const num = Math.floor(Math.random() * banners.length);

  return banners[num];
}
const setBanner = () => {
	const banners = [
		<iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=12&l=ur1&category=electronica&banner=046J26ETS9M7NDGDASG2&f=ifr&linkID=ec1f05c79701080eaa9e0c5e581c6ec7&t=davidsdevel-21&tracking_id=davidsdevel-21" width="300" height="250" scrolling="no" border="0" marginWidth="0" style={{border: "none"}} frameBorder="0"/>,
		<iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=12&l=ur1&category=kindlestore&banner=0EBKJZ3WWFVPXWK2EQG2&f=ifr&linkID=b9f7bb73e3f336b05221396f315435c5&t=davidsdevel-21&tracking_id=davidsdevel-21" width="300" height="250" scrolling="no" border="0" marginWidth="0" style={{border: "none"}} frameBorder="0"/>,
		<iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=12&l=ur1&category=kindle_oasis&banner=0EQAZANNGB2FBCTTWY02&f=ifr&linkID=e7a91201639cf79f15997953cf66c43b&t=davidsdevel-21&tracking_id=davidsdevel-21" width="300" height="250" scrolling="no" border="0" marginWidth="0" style={{border: "none"}} frameBorder="0"/>,
		<iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=12&l=ur1&category=kindle_unlimited&banner=0HS9T4K2ZD228BRY4KG2&f=ifr&linkID=931e3a8b478cee425045c3bbe64cd83f&t=davidsdevel-21&tracking_id=davidsdevel-21" width="300" height="250" scrolling="no" border="0" marginWidth="0" style={{border: "none"}} frameBorder="0"/>,
		<iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=12&l=ur1&category=kindle&banner=08BNTKF4K3J6EXRKB002&f=ifr&linkID=2ee1875319344cda79cf2eed7e9fd264&t=davidsdevel-21&tracking_id=davidsdevel-21" width="300" height="250" scrolling="no" border="0" marginWidth="0" style={{border: "none"}} frameBorder="0"/>,
		<iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=12&l=ur1&category=premium&banner=0EMP21769P76KEGTJNR2&f=ifr&linkID=fc38e0ecbe2b7aef4e4950900b8796f7&t=davidsdevel-21&tracking_id=davidsdevel-21" width="300" height="250" scrolling="no" border="0" marginWidth="0" style={{border: "none"}} frameBorder="0"/>,
		<iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=12&l=ur1&category=todoslosproductos&banner=08B36QSC3KJB4QCVAWR2&f=ifr&linkID=5ea43b604eb1807f55bf5e4da5cce0fc&t=davidsdevel-21&tracking_id=davidsdevel-21" width="300" height="250" scrolling="no" border="0" marginWidth="0" style={{border: "none"}} frameBorder="0"/>,
		<iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=12&l=ur1&category=generico&banner=158DZ09YX363P3B44A02&f=ifr&linkID=b4e51bc3c17d2b0498068f691bf846dd&t=davidsdevel-21&tracking_id=davidsdevel-21" width="300" height="250" scrolling="no" border="0" marginWidth="0" style={{border: "none"}} frameBorder="0"/>,
		<iframe src="https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=12&l=ur1&category=informatica&banner=1GZMTXW4K3DWBWD3VAR2&f=ifr&linkID=ee035cd8f5bcba192e46c585ecb67290&t=davidsdevel-21&tracking_id=davidsdevel-21" width="300" height="250" scrolling="no" border="0" marginWidth="0" style={{border: "none"}} frameBorder="0"/>,
		<a href="https://share.payoneer.com/nav/8KWKN89znbmVoxDtLaDPDhoy-Hh5_0TAHI8v5anfhDJ6wN3NOMMU3rpV5jk6FSfq9t5YNnTcg-XSxqiV1k7lwA2" target="_blank">
			<img src="/static/images/payoneer.jpg" style={{width: "300px"}}/>
		</a>,
		<a href="https://platzi.com/r/david-gonzalez218/" target="_blank">
			<img src="/static/images/platzi.png" style={{width: "300px"}}/>
		</a>
	];

	const num = Math.floor(Math.random() * banners.length);

	return banners[num];
}

export {
	setBanner,
	asideBanner
}