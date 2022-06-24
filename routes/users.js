const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const { validate, generateAuthToken } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({ email: req.body.email });
	// console.log(user);
	if (user) {
		return res.status(400).send('User already registered !');
	}
	user = new User(_.pick(req.body, ['name', 'email', 'password']));
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);
	await user.save();

	user = _.pick(user, ['_id', 'name', 'email']);
	const token = generateAuthToken(user);

	res.status(200).header('x-auth-token', token).send(user);
});

// getting info of logged in and authorized user
router.get('/me', auth, async (req, res) => {
	const authenticatedUser = await User.findById(req.user._id).select(
		'-password'
	);

	res.status(200).send(authenticatedUser);
});

module.exports = router;
