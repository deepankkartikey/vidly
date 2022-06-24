const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
	const token = req.header('x-auth-token');
	if (!token) {
		res.status(401).send('Access Denied. No valid token provided!');
	}

	try {
		const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
		req.user = decoded;
		next(); // pass control to next middleware function
	} catch (ex) {
		res.status(400).send('Invalid Token!');
	}
}

module.exports = auth;
