const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const User = sequelize.define('User', {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV1,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
		},
	},
	email: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
		validate: {
			notEmpty: true,
			isEmail: true,
		},
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
			validate(value) {
				if (value.length <= 7) {
					throw new Error('Password should be greater than 7 characters');
				}
				if (value.toLowerCase().includes('password')) {
					throw new Error('Passwrod cannot contain "Password"');
				}
			},
			set(value) {
				const hash = bcrypt.hashSync(value, 8);
				this.setDataValue('password', hash);
			},
		},
	},
	age: {
		type: DataTypes.STRING,
		defaultValue: 0,
		validate: {
			validate(value) {
				if (value < 0) {
					throw new Error('Age must be a positive number');
				}
			},
		},
	},
	tokens: {
		type: DataTypes.JSONB,
		allowNull: false,
		defaultValue: [],
	},
});

// Generating Auth token
User.prototype.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign({ id: user.id.toString() }, process.env.JWT_SECRET);

	user.tokens = user.tokens.concat({ token });
	await user.save();

	return token;
};

// Removing fields
User.prototype.removeFields = async function () {
	const user = this;
	const userObject = user.dataValues;

	delete userObject.password;
	delete userObject.tokens;

	return userObject;
};

// User login
User.findByCredentials = async (email, password) => {
	const user = await User.findOne({
		where: { email },
	});

	if (!user) {
		throw new Error('Unable to login');
	}

	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		throw new Error('Unable to login');
	}

	return user;
};

module.exports = User;
