const chalk = require('chalk');

const error = chalk.bold.red;
const warning = chalk.keyword('orange');
const success = chalk.bold.green;
module.exports = {
  success,
  error,
  warning
};
