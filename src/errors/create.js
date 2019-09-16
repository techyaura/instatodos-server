
const messages = require('./code');

module.exports = function createError(code) {
  if (messages.hasOwnProperty(code)) {
    return messages[code];
  }
  return {
    code: 'ValidationError',
    message: code,
    status: 400
  };
};
