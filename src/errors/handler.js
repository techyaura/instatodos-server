const createError = require('./create');

module.exports = (err) => {
  const {
    name, message = null, locations, path, code
    // extensions = {},
  } = err;
  const error = createError(message, code || name);
  const response = {
    ...error
  };
  // if (name === 'GraphQLError') {
  // }
  return {
    ...response,
    path,
    name,
    // extensions,
    locations
  };
};
