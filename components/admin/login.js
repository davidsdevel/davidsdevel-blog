import React from "react";

export default () => <div>
	<form action="/admin-login" method="POST" encType="application/json">
		<input type="text" name="username" placeholder="Username"/>
		<input type="password" name="password" placeholder="Password"/>
		<button>Login</button>
	</form>
</div>;
