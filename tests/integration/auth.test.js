const mongoose = require('mongoose');
const request = require('supertest');
const { Genre } = require('../../models/genre');
const { generateAuthToken, User } = require('../../models/user');

describe('auth Middleware', () => {
	let token;

	beforeEach(() => {
		server = require('../../index');
		const user = new User({ name: 'Test1', isAdmin: true });
		token = generateAuthToken(user);
	});

	afterEach(async () => {
		await Genre.remove({});
		await server.close();
	});

	afterAll(async () => {
		await mongoose.connection.close();
	});

	const execute = () => {
		return request(server)
			.post('/api/genres')
			.set('x-auth-token', token)
			.send({ name: 'genre1' });
	};

	it('should return 401 if no token is provided', async () => {
		token = '';
		const res = await execute();
		expect(res.status).toBe(401);
	});

	it('should return 400 if token is invalid', async () => {
		token = 'a';
		const res = await execute();
		expect(res.status).toBe(400);
	});

	it('should return 200 if token is valid', async () => {
		const res = await execute();
		expect(res.status).toBe(200);
	});
});
