module.exports = function (handler) {
	return async (req, res, next) => {
		try {
			await handler(req, res); // coming from caller
		} catch (ex) {
			next(ex); // pass to error handling middleware
		}
	};
};
