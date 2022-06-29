const request = require('supertest');
const express = require('express');
const genres = require('../../routes/genres');
const mongoose = require('mongoose');

let server;

const app = express(); //an instance of an express app, a 'fake' express app
app.use('/api/genres', genres); //routes

describe('/api/genres', () => {
	beforeEach(() => {
		server = require('../../index');
	});
	afterEach(done => {
		server.close();
		mongoose.connection.close();
		done();
	});

	describe('GET /', () => {
		it('should return all genres', async () => {
			const res = await request(server).get('/api/genres');
			expect(res.status).toBe(200);
		});
	});
});
