const createError = require('./create');

module.exports = (err, req, res, next) => {
  try {
    if (err.name === 'BulkWriteError') {
      const error = {};
      error.code = 'VALIDATION_FAILED';
      error.errors = [{ message: err.message }];
      // error.errors[0].field = error.errors[0].path;
      error.status = 400;

      // delete error.errors[0].path;
      // delete error.errors[0].context;

      return res.status(error.status).json(error);
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

      return res.status(error.status).json(error).end();
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
      error.status = err.status || 400;

      return res.status(error.status).json(error);
    }
    if (err.code === 'SCHEMA_VALIDATION_FAILED') {
      const error = {};

      error.code = err.code;
      error.errors = err.results.errors;
      error.status = 400;

      return res.status(error.status).json(error);
    }

    if (err.name === 'StatusCodeError') {
      return res.status(err.statusCode || 400).send(err.error);
    }

    if (err.code || err.message) {
      const error = createError(err.code, err.message);
      return res.status(error.status).json(error);
    }
    const error = createError(err);
    if (error.code && error.errors && error.errors[0].message) {
      return res.status(error.status || 400).json(error);
    }
    return res.status(400).json(err);
  } catch (appErr) {
    return next(appErr);
  }
};
