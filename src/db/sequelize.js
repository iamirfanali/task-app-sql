const chalk = require('chalk');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB, process.env.USER, process.env.PASSWORD, {
	host: process.env.HOST,
	dialect: process.env.DIALECT,
});

sequelize
	.sync()
	.then(() => {
		console.log(chalk.green.inverse('All models were synchronized successfully.'));
	})
	.catch((error) => {
		console.log(error);
	});

module.exports = sequelize;
