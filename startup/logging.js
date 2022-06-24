const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
	process.on('uncaughtException', ex => {
		// console.log('An uncaught exception!');
		new winston.transports.File({
			filename: 'unhandledExceptions.log',
			level: 'error',
		});
		winston.error(ex.message, ex);
		process.exit(1);
	});

	process.on('unhandledRejection', ex => {
		// console.log('An unhandled promise rejection!');
		new winston.transports.File({
			filename: 'unhandledRejections.log',
			level: 'error',
		});
		winston.error(ex.message, ex);
		process.exit(1);
	});

	const logger = winston.createLogger({
		level: 'info',
		// format: winston.format.json(),
		defaultMeta: { service: 'vidly-service' },
		transports: [
			//
			// - Write all logs with importance level of `error` or less to `error.log`
			// - Write all logs with importance level of `info` or less to `combined.log`
			//
			new winston.transports.File({ filename: 'combined.log' }),
		],
	});

	if (process.env.NODE_ENV !== 'production') {
		logger.add(
			new winston.transports.Console({
				format: winston.format.simple(),
			})
		);
	}
	// winston.add(new winston.transports.File({ filename: 'logfile.log' }));
	// winston.add(
	// 	new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly' })
	// );
};
