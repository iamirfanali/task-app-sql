const chalk = require('chalk');
const app = require('./app');
const sequelize = require('./db/sequelize');

const port = process.env.PORT;

app.listen(port, async () => {
	console.log(chalk.bgGreen.white(`server is up on port ${port}.`));

	try {
		await sequelize.authenticate();
		console.log(chalk.green.inverse('Connection has been established successfully.'));
	} catch (e) {
		console.error(chalk.red.inverse('Unable to connect to the database.', e));
	}
});
