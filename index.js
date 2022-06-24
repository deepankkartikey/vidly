require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();
require('./startup/routes')(app);
require('./startup/db')();

process.on('uncaughtException', ex => {
	// console.log('An uncaught exception!');
	winston.error(ex.message, ex);
	process.exit(1);
});

process.on('unhandledRejection', ex => {
	// console.log('An unhandled promise rejection!');
	winston.error(ex.message, ex);
	process.exit(1);
});

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(
	new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly' })
);

// throw new Error('Global error!');

// set environment variable
if (!config.get('jwtPrivateKey')) {
	console.error('FATAL Error: jwtPrivateKey is not defined.');
	process.exit(1);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
