module.exports = [
	{
		method: 'GET',
		path: '/login',
		config: {
			auth: {
				mode: 'try'		// try mode means if credential present, attempt login, but continue with request life cycle even if the attempt fails.
								// in this case, if cookie doesn't exist, the code proceed without attempting to authenticate.
								// this behaviour is used to continue showing login form if credentials doesn't exist.
			},
			handler: function (request, reply) {
				if(request.auth.isAuthenticated === true) {
					return reply.redirect('/private');
				}
				let loginForm = `
					<form method="post" action="/login">
					Username: <input type="text" name="username" />
					<br>
					Password: <input type="password" name="password" />
					<br>
					<input type="submit" value="Login" />
					</form>
				`;
				if(request.query.login === 'failed') {
					loginForm += `<h3>Previous login attempt failed</h3>`;
				}
				return reply(loginForm);
			}
		}
	},
	{
		method: 'POST',
		path: '/login',
		config: {
			auth: {
				mode: 'try'
			},
			handler: function (request, reply) {
				if(request.payload.username !== 'admin' || request.payload.password !== 'password') {
					request.cookieAuth.clear();
					return reply.redirect('/login?login=failed');
				}
				request.cookieAuth.set({
					username: request.payload.username,
					lastLogin: new Date()
				});
				return reply.redirect('/private');
			}
		}
	},
	{
		method: 'GET',
		path: '/public',
		config: {
			auth: {
				mode: 'try'
			},
			handler: function (request, reply) {
				return reply(request.auth);
			}
		}
	},
	{
		method: 'GET',
		path: '/private',
		config: {
			handler: function (request, reply) {
				return reply(request.auth);
			}
		}
	}
];
