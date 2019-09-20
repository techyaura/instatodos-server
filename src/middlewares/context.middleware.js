const { CommonFunctionUtil } = require('../utils');

module.exports = function ({user}, ...arguments) {
    if (typeof (user) === 'undefined') {
        return Promise.reject(new Error(401));
    }
    if (typeof (arguments) === 'undefined') {
        return Promise.resolve(true);
    }
    return Promise.all(arguments)
        .then(() => {
            return Promise.resolve(true);
        })
        .catch(err => {
            return Promise.reject(err);
        })
};
