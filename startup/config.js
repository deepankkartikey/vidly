const config = require('config');

module.exports = function () {
	// set environment variable
	if (!config.get('jwtPrivateKey')) {
		throw new Error('FATAL Error: jwtPrivateKey is not defined.');
	}
};
