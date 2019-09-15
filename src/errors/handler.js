const createError = require('./create');

module.exports = (err, req, res) => {
  const { locations, path } = err;
  try {
    if (err.name === 'BulkWriteError') {
      const error = {};
      error.code = 'VALIDATION_FAILED';
      error.errors = [{ message: err.message }];
      // error.errors[0].field = error.errors[0].path;
      error.status = 400;

      // delete error.errors[0].path;
      // delete error.errors[0].context;
      res.statusCode = 400;
      return {
        ...error
      };
    }
    if (err.name === 'ValidationError') {
      const error = {};

      error.code = 'VALIDATION_FAILED';
      error.errors = err.details
        ? err.details
        : [{ message: err.message }];
      error.errors[0].field = Array.isArray(error.errors) && error.errors.length && error.errors[0].path ? error.errors[0].path : '';
      error.status = 400;

      delete error.errors[0].path;
      delete error.errors[0].context;
      res.statusCode = 400;
      return {
        ...error,
        locations,
        path
      };
    }

    if (err.errors && err.status && err.action === 'login') {
      const error = {};
      error.code = err.code || 'VALIDATION_FAILED';
      error.errors = err.errors;
      error.errors.forEach((errObj) => {
        const errObjNew = errObj;
        errObjNew.message = errObjNew.message || errObjNew.messages[0];
        delete errObjNew.messages;
      });
      error.status = 401;
      res.statusCode = err.status || 400;
      return {
        ...error,
        locations,
        path
      };
    }
    if (err.errors && err.status) {
      const error = {};
      error.code = err.code || 'VALIDATION_FAILED';
      error.errors = err.errors;
      error.errors.forEach((errObj) => {
        const errObjNew = errObj;
        errObjNew.message = errObj.message || errObj.messages[0];
        delete errObjNew.messages;
      });
      res.statusCode = err.status || 400;
      return {
        ...error,
        locations,
        path
      };
    }
    if (err.code === 'SCHEMA_VALIDATION_FAILED') {
      const error = {};

      error.code = err.code;
      error.errors = err.results.errors;
      error.status = 400;
      res.statusCode = 400;
      return {
        ...error,
        locations,
        path
      };
    }

    if (err.name === 'StatusCodeError') {
      res.statusCode = err.statusCode || 400;
      return {
        ...err.error,
        locations,
        path
      };
    }

    if (err.code || err.message) {
      const error = createError(err.code, err.message);
      res.statusCode = error.status;
      return {
        ...error,
        locations,
        path
      };
    }
    const error = createError(err);
    if (error.code && error.errors && error.errors[0].message) {
      res.statusCode = error.status || 400;
      return {
        ...error,
        locations,
        path
      };
    }
    res.statusCode = 400;
    return {
      ...err,
      locations,
      path
    };
  } catch (appErr) {
    res.statusCode = 500;
    return {
      message: 'unknown'
    };
  }
};
