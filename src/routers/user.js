const express = require('express');
const User = require('../models/user');

const router = new express.Router();

// sign up route
router.post('/users/signup', async (req, res) => {
	const reqBody = req.body;

	try {
		const createUser = await User.create(reqBody);
		const token = await createUser.generateAuthToken();
		const user = await createUser.removeFields();
		res.status(201).send({ user, token });
	} catch (e) {
		console.log(e);
		res.status(400).send(e);
	}
});

// Login Route
router.post('/users/login', async (req, res) => {
	try {
		const authUser = await User.findByCredentials(req.body.email, req.body.password);
		const token = await authUser.generateAuthToken();
		const user = await authUser.removeFields();
		res.send({ user, token });
	} catch (e) {
		res.status(400).send({ message: 'Unable to login!' });
	}
});

module.exports = router;
