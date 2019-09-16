const createError = require('./create');

module.exports = (err, req, res) => {
  const { locations, path } = err;
  try {
    if (err.name === 'GraphQLError' && err.message) {
      const error = createError(err.message);
      res.statusCode = error.status;
      return {
        ...error,
        locations,
        path
      };
    }
    res.statusCode = 500;
    return {
      status: 500,
      locations,
      path
    };
  } catch (appErr) {
    res.statusCode = 500;
    return {
      status: 500,
      message: 'unknown',
      code: 'UNKNOWN',
      locations,
      path
    };
  }
};
