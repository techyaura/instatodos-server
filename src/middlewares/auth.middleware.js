const { UserModel } = require('../models');

const { JwtUtil } = require('../utils');

module.exports = {
  jwt: (req, res, next) => {
    let token;
    if (req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2) {
        const scheme = parts[0];
        const credentials = parts[1];
        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        } else {
          return next('INVALID_GRANT');
        }
      } else {
        return next('INVALID_GRANT');
      }
    } else {
      return next(401);
    }

    return JwtUtil.verify(token)
      .then((tokenPayload) => {
        if (tokenPayload && tokenPayload.auth) {
          return UserModel.findOne(
            { _id: tokenPayload.auth },
            { _id: 1, role: 1, username: 1 },
          ).lean();
        }
        return next(new Error('INVALID_GRANT'));
      })
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        next(err);
      });
  }
};
