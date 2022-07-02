const mongoose = require('mongoose');
const auth = require('../../../middleware/auth');
const { User, generateAuthToken } = require('../../../models/user');

describe('auth middleware', () => {
	it('should populate req.user with payload of a valid JWT', () => {
		const user = {
			_id: mongoose.Types.ObjectId().toHexString(),
			isAdmin: true,
		};
		const token = generateAuthToken(new User(user));

		// mocking req, res, next
		const req = {
			header: jest.fn().mockReturnValue(token),
		};
		const next = jest.fn();
		const res = {};

		auth(req, res, next);

		expect(req.user).toMatchObject(user);
	});
});
