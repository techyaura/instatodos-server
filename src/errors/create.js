
const messages = require('./code');

module.exports = function createError(message, code) {
  if (messages.hasOwnProperty(message)) {
    return messages[message];
  }
  return {
    code: code || 'ValidationError',
    message,
    status: 400
  };
};
