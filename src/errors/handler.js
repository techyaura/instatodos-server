const createError = require('./create');
const winston = require('../config/winston');

module.exports = (err, req, res, next, isExpressSpecificError) => {
  const {
    name, message, locations, path
  } = err;
  let response = {
    status: 500,
    message: 'Something went wrong, Please try again.'
  };
  if (typeof (isExpressSpecificError) !== 'undefined' && isExpressSpecificError) {
    if (message === 'INVALID_GRANT') {
      // Error specific to custom Auth JWT Middleware
      const error = createError(err.message);
      res.statusCode = 401;
      response = { ...error };
    } else if (name === 'TokenExpiredError') {
      // Error specific to library JWT if token expired
      const error = createError(name);
      res.statusCode = 401;
      response = { ...error };
    } else if (name === 'JsonWebTokenError') {
      // Error specific to library JWT if token invalid
      const error = createError('INVALID_GRANT');
      res.statusCode = 401;
      response = { ...error };
    } else {
      response = { ...response };
    }
    winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.json(response);
  }
  // Error specific to Graphql
  if (name === 'GraphQLError') {
    const error = createError(message);
    res.statusCode = error.status;
    response = {
      ...error
    };
  }
  response = { ...response, locations, path };
  return response;
};
