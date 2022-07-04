const express = require('express');
const auth = require('../middleware/auth');
const { Rental } = require('../models/rental');
const router = express.Router();
const moment = require('moment');

router.post('/', auth, async (req, res) => {
	if (!req.body.customerId) {
		return res.status(400).send('customerId not provided!');
	}
	if (!req.body.movieId) {
		return res.status(400).send('movieId not provided!');
	}

	const rental = await Rental.findOne({
		'customer._id': req.body.customerId,
		'movie._id': req.body.movieId,
	});

	if (!rental) {
		return res.status(404).send('Rental not found!');
	}

	if (rental.dateReturned) {
		return res.status(400).send('Rental already processed!');
	}

	// set date returned for movie rental
	rental.dateReturned = new Date();
	const rentalDays = moment().diff(rental.dateOut, 'days');
	rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
	await rental.save();

	return res.status(200).send();
});

module.exports = router;
