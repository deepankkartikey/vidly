const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, generateAuthToken } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
	// validate request body for email and password for an existing user
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// User should be present in the database to be logged in
	let user = await User.findOne({ email: req.body.email });
	if (!user) {
		return res.status(400).send('Invalid email/password !');
	}

	// validate hashed password and password in request body
	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword) {
		return res.status(400).send('Invalid email/password !');
	}

	const token = generateAuthToken(user);

	res.status(200).send(token);
});

function validate(req) {
	const schema = {
		email: Joi.string().min(5).max(250).required(),
		password: Joi.string().min(5).max(1024).required(),
	};
	return Joi.validate(req, schema);
}

module.exports = router;
