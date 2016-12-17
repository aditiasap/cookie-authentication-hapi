const Hapi = require('hapi');
const Cookie = require('hapi-auth-cookie');
const Blipp = require('blipp');

const routes = require('./routes');

const server = new Hapi.Server();

server.connection({
	port: 1337
});

server.register(
	[
		Cookie,
		{
			register: Blipp,
			options: {showAuth: true}
		}
	], (err) => {
		server.auth.strategy('session', 'cookie',
			{
				cookie: 'example',		// name of cookie
				password: 'secret.0123456789.0123456789.012',		// used to encrypt cookie with iron (https://github.com/hueniverse/iron). Newer hapi version need at min. 32 characters
				isSecure: false,		// check whether cookie allowed to be transmitted over insecure connection. You should only set this to false during development
				redirectTo: '/login',	// Location to redirect unauthenticated request
				redirectOnTry: false	// configure whether to attempt redirecting for requests where route authentication is in the "try" mode
			}
		);
		server.auth.default('session');
		server.route(routes);
		server.start(() => 
			{});
	}
);