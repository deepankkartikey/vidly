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
});
