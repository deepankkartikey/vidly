// POST /api/returns {customerId, movieId}

const { now } = require('lodash');
const mongoose = require('mongoose');
const request = require('supertest');
const { Rental } = require('../../models/rental');
const { User, generateAuthToken } = require('../../models/user');
const moment = require('moment');

/* UNAUTHORIZED
    - Returns 401 if client is not logged in
   
   BAD REQUEST
   - Returns 400 if customerId is not provided
   - Returns 400 if movieId is not provided
   - Returns 400 if rental already processed
   
   NOT FOUND
   - Returns 404 if no rental found for this customer

   VALID REQUEST
   - Returns 200 if valid request
   - Set the return date and calculate rental fee (noOfDays * dailyRentalRate) on server side
   - Increase the Stock
   - Return the Rental

*/

Rental;

describe('/api/returns', () => {
	let server;
	let customerId;
	let movieId;
	let rental;
	let token;

	const exec = () => {
		return request(server)
			.post('/api/returns')
			.set('x-auth-token', token)
			.send({ customerId, movieId });
	};

	beforeEach(async () => {
		server = require('../../index');

		customerId = mongoose.Types.ObjectId();
		movieId = mongoose.Types.ObjectId();

		const user = new User();
		token = generateAuthToken(user);

		rental = new Rental({
			customer: {
				_id: customerId,
				name: 'abcde',
				phone: '12345',
			},
			movie: {
				_id: movieId,
				title: 'xyxyz',
				dailyRentalRate: 2,
			},
		});
		await rental.save();
	});
	afterEach(async () => {
		server.close();
		await Rental.remove({}); // clean up the db
	});
	afterAll(() => {
		mongoose.connection.close();
	});

	it('should work', async () => {
		const result = await Rental.findById(rental._id);
		expect(result).not.toBeNull();
	});

	it('should return 401, if user is not logged in!', async () => {
		token = '';
		const res = await exec();
		expect(res.status).toBe(401);
	});

	it('should return 400, if customerId is not provided!', async () => {
		customerId = '';
		const res = await exec();
		expect(res.status).toBe(400);
	});

	it('should return 400, if movieId is not provided!', async () => {
		movieId = '';
		const res = await exec();
		expect(res.status).toBe(400);
	});

	it('should return 400, if rental is already processed!', async () => {
		rental.dateReturned = new Date();
		await rental.save();
		const res = await exec();
		expect(res.status).toBe(400);
	});

	it('should return 404, if no rental found for this customer/movie', async () => {
		await Rental.remove({});
		const res = await exec();
		expect(res.status).toBe(404);
	});

	it('should return 200, if we have valid request', async () => {
		const res = await exec();
		expect(res.status).toBe(200);
	});

	it('should set returnDate, if request is valid', async () => {
		const res = await exec();
		const rentalInDB = await Rental.findById(rental._id);
		const currentTime = new Date();
		const diff = currentTime - rentalInDB.dateReturned; // in milliseconds
		expect(diff).toBeLessThan(10 * 1000);
	});

	it('should calculate and set rentalFee, if request is valid', async () => {
		rental.dateOut = moment().add(-7, 'days').toDate();
		await rental.save();

		const res = await exec();

		const rentalInDB = await Rental.findById(rental._id);
		expect(rentalInDB.rentalFee).toBe(14);
	});
});
