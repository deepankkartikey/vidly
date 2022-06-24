require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const error = require('./middleware/error');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const app = express();

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

mongoose
	.connect('mongodb://localhost/vidly')
	.then(() => console.log('Connected to MongoDB...'))
	.catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.use(error); // error middleware

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
