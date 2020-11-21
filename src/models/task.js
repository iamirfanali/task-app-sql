const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const User = require('./user');

const Task = sequelize.define('Task', {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV1,
		primaryKey: true,
	},
	description: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	completed: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
});

Task.belongsTo(User, { as: 'author', targetKey: 'id' });

module.exports = Task;
