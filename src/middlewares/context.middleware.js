module.exports = function (context, ...arguments) {
    const { next, user } = context;
    if (typeof (user) === 'undefined') {
        return next(new Error(401));
    }
    if (typeof (arguments) === 'undefined') {
        return Promise.resolve(true);
    }
    return Promise.all(arguments)
        .then(() => {
            return Promise.resolve(true);
        })
        .catch(err => {
            return next(err);
        })
};
