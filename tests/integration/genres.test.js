const request = require('supertest');
const express = require('express');
const genres = require('../../routes/genres');
const mongoose = require('mongoose');
const { Genre } = require('../../models/genre');
const { generateAuthToken, User } = require('../../models/user');

let server;

const app = express(); //an instance of an express app, a 'fake' express app
app.use('/api/genres', genres); //routes

describe('/api/genres', () => {
	beforeEach(() => {
		server = require('../../index');
	});
	afterEach(async () => {
		await server.close();
		await Genre.remove({}); // clean up the db
	});
	afterAll(async () => {
		await mongoose.connection.close();
	});

	describe('GET /', () => {
		it('should return all genres', async () => {
			// inserting data into test db
			await Genre.collection.insertMany([
				{ name: 'genre1' },
				{ name: 'genre2' },
			]);
			const res = await request(server).get('/api/genres');
			expect(res.status).toBe(200);
			// console.log(res.body.length);
			// expect(res.body.length).toBe(2);
			expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
			expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
		});
	});

	describe('GET /:id', () => {
		it('should return genre if valid id is passed', async () => {
			const genre = new Genre({ name: 'genre1' });
			await genre.save();

			const res = await request(server).get('/api/genres/' + genre._id);
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('name', genre.name);
		});

		it('should return 404 if invalid id is passed', async () => {
			const id = new mongoose.Types.ObjectId(); // generated random objectid
			const res = await request(server).get('/api/genres/' + id);
			expect(res.status).toBe(404);
		});
	});

	describe('POST /', () => {
		// Define the happy path, each test we change one parameter according to test

		let token;
		let name;

		const execute = async () => {
			return await request(server)
				.post('/api/genres')
				.set('x-auth-token', token)
				.send({ name });
		};

		beforeEach(() => {
			const user = new User({ name: 'Test1', isAdmin: true });
			token = generateAuthToken(user);
			name = 'genre1';
		});

		it('should return 401 if client is not logged in', async () => {
			token = '';
			const res = await execute();
			expect(res.status).toBe(401);
		});

		it('should return 400 if genre is less than 5 characters', async () => {
			name = 'gen1';
			const res = await execute();
			expect(res.status).toBe(400);
		});

		it('should return 400 if genre is more than 50 characters', async () => {
			name = new Array(52).join('x');
			const res = await execute();
			expect(res.status).toBe(400);
		});

		it('should save genre if it is valid', async () => {
			await execute();
			const genre = await Genre.find({ name: 'genre1' });
			expect(genre).not.toBeNull();
		});

		it('should return genre if it is valid', async () => {
			const res = await execute();
			expect(res.body).toHaveProperty('_id');
			expect(res.body).toHaveProperty('name', 'genre1');
		});
	});
});
