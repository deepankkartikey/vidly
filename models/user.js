const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50,
	},
	email: {
		type: String,
		unique: true,
		required: true,
		minlength: 5,
		maxlength: 250,
	},
	password: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 1024,
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
});

function generateAuthToken(user) {
	//can't be replaced with arrow function because they do not have their own this
	const token = jwt.sign(
		{ _id: user._id, isAdmin: user.isAdmin },
		config.get('jwtPrivateKey')
	);
	return token;
}

function validateUser(user) {
	const schema = {
		name: Joi.string().min(5).max(50).required(),
		email: Joi.string().min(5).max(250).required().email(),
		password: Joi.string().min(5).max(1024).required(),
	};
	return Joi.validate(user, schema);
}

const User = mongoose.model('User', userSchema);

exports.User = User;
exports.validate = validateUser;
exports.generateAuthToken = generateAuthToken;
