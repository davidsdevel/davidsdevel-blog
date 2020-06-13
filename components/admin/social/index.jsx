import React, { Component } from 'react';

export default class SocialMedia extends Component {
  statusChangeCallback(response) { // Called with the results from FB.getLoginStatus().
    console.log('statusChangeCallback');
    console.log(response); // The current login status of the person.
    if (response.status === 'connected') { // Logged into your webpage and Facebook.
      testAPI(response.access_token);
    } else { // Not logged into your webpage or we are unable to tell.
      document.getElementById('status').innerHTML = 'Please log '
			+ 'into this webpage.';
    }
  }

  checkLoginState() { // Called when a person is finished with the Login Button.
    FB.getLoginStatus((response) => { // See the onlogin handler
      statusChangeCallback(response);
    });
  }

  testAPI(access_token) {
    // Testing Graph API after login.  See statusChangeCallback() for when this call is made.

    fetch('/blog/set_fb_access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token,
      }),
    });
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', (response) => {
      console.log(`Successful login for: ${response.name}`);
      document.getElementById('status').innerHTML = `Thanks for logging in, ${response.name}!`;
    });
  }

  componentDidMount() {
    const finished_rendering = function () {
      console.log('finished rendering plugins');
      const spinner = document.getElementById('spinner');
      spinner.removeAttribute('style');
      spinner.removeChild(spinner.childNodes[0]);
    };

    window.FB.Event.subscribe('xfbml.render', finished_rendering);

    window.FB.XFBML.parse();
  }

  render() {
    return (
      <div className="container">
        <span className="title" />
        <div
          id="spinner"
          style={{
				  background: '#4267b2',
				  borderRadius: 5,
				  color: 'white',
				  height: 40,
				  textalign: 'center',
				  width: 250,
				  display: 'flex',
				  alignItems: 'center',
				  justifyContent: 'center',
          }}
        >
          <span>Loading</span>
          <div
            className="fb-login-button"
            data-max-rows="1"
            data-size="large"
            data-button-type="continue_with"
            data-use-continue-as="true"
            data-onlogin="checkLoginState()"
          />
        </div>
        <style jsx>
          {`
				.container {
					display: flex;
					justify-content: center;
					align-items: center;
					position: absolute;
					height: 100%;
				}
				.title {
					display: block;
					font-size: 32px;
					width: 75%;
					right: 0;
					text-align: center;
					font-weight: bold;
					position: fixed;
				}
			`}
        </style>
      </div>
    );
  }
}
