module.exports = ({ user }, ...args) => {
  if (typeof (user) === 'undefined' || !Object.keys(user).length) {
    return Promise.reject(new Error(401));
  }
  if (typeof (args) === 'undefined') {
    return Promise.resolve(true);
  }
  return Promise.all(args)
    .then(() => Promise.resolve(true))
    .catch(err => Promise.reject(err));
};
