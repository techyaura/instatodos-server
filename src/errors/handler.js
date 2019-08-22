const ERROR_CODES = require('./code');

module.exports = ({ err, res, next }) => {
  let errorObj = {};
  const { name, message } = err;
  try {
    if (name === 'ValidationError') {
      const errDetails = err.details[0] || {};
      errorObj = {
        ...errDetails, status: 400, code: 'VALIDATION_FAILED'
      };
      return res.status(400).send(errorObj);
    }
    if (typeof message !== 'undefined') {
      try {
        const customError = ERROR_CODES[message];
        if (customError) {
          errorObj = {
            ...customError
          };
        }
        return res.status(400).send(errorObj);
      } catch (catchErr) {
        return next(catchErr);
      }
    }
    return {};
  } catch (appError) {
    return next(appError);
  }
};
