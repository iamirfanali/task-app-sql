const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/tasks/create', auth, async (req, res) => {
	const reqBody = req.body;

	try {
		const createTask = await Task.create({ ...reqBody, authorId: req.user.id });
		res.status(201).send(createTask);
	} catch (e) {
		res.status(400).send(e);
	}
});

module.exports = router;
