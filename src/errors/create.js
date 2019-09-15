
const messages = require('./code');

function createError(code, message) {
  if (!message) {
    return {};
  }
  const err = new Error(
    typeof message !== 'string' && message.msg ? message.msg : message,
  );
  err.code = code || 'VALIDATION_FAILED';
  err.status = typeof code === 'number' ? code : message.status || 400;
  err.errors = [
    {
      message: message.msg || message
    }
  ];
  err.warnings = [];
  return err;
}

const create = (code, message, details) => createError(code, message || messages[code], details);

module.exports = create;
