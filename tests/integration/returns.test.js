// POST /api/returns {customerId, movieId}

const mongoose = require('mongoose');
const { Rental } = require('../../models/rental');

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
   - Set the return date and calculate rental fee on server side
   - Increase the Stock
   - Return the Rental

*/

Rental;

describe('/api/returns', () => {
	let server;
	let customerId;
	let movieId;
	let rental;

	beforeEach(async () => {
		server = require('../../index');

		customerId = mongoose.Types.ObjectId();
		movieId = mongoose.Types.ObjectId();

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
});
