function initializeFB() {
	var js, fjs = document.getElementsByTagName("script")[0];

    if (!document.getElementById("facebook-jssdk")) {

      js = document.createElement("script");
      js.id = "facebook-jssdk";
      js.src = "https://connect.facebook.net/es_LA/sdk.js";

      fjs.parentNode.insertBefore(js, fjs);
    }

    if (!document.getElementById("fb-root")) {
      const fbRoot = document.createElement("div");
      fbRoot.id = "fb-root";

      document.body.insertBefore(fbRoot, document.body.firstChild);
    }

	if(!window.FB) {
		window.fbAsyncInit = () => {
			FB.init({
				appId      : '337231497026333',
				xfbml      : true,
				autoLogAppEvents: true,
				version    : 'v4.0'
			});
			FB.AppEvents.logPageView();
		};
	} else {
		FB.XFBML.parse();
	}
}