const request = require('supertest');
const express = require('express');
const genres = require('../../routes/genres');
const mongoose = require('mongoose');
const { Genre } = require('../../models/genre');

let server;

const app = express(); //an instance of an express app, a 'fake' express app
app.use('/api/genres', genres); //routes

describe('/api/genres', () => {
	beforeEach(() => {
		server = require('../../index');
	});
	afterEach(async () => {
		server.close();
		await Genre.remove({}); // clean up the db
	});
	afterAll(() => {
		mongoose.connection.close();
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
			expect(res.body.length).toBe(2);
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
		it('should return 401 if client is not logged in', async () => {
			const res = await request(server)
				.post('/api/genres')
				.send({ name: 'genre1' });
			expect(res.status).toBe(401);
		});
	});
});
