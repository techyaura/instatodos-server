const {
  AuthenticationError
} = require('apollo-server');
const { UserModel } = require('../models');

const { JwtUtil } = require('../utils');

module.exports = {
  jwt: async (req, next) => {
    try {
      let token;
      if (req.headers && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ');
        if (parts.length === 2) {
          const scheme = parts[0];
          const credentials = parts[1];
          if (/^Bearer$/i.test(scheme)) {
            token = credentials;
          } else {
            throw new AuthenticationError('INVALID_GRANT');
          }
        }
      } else {
        return {};
      }
      const tokenPayload = await JwtUtil.verify(token);
      if (tokenPayload && tokenPayload.auth) {
        const user = await UserModel.findOne(
          { _id: tokenPayload.auth },
          { _id: 1, email: 1, profilePic: 1 }
        )
          .lean();
        if (user) {
          return user;
        }
      }
      throw new AuthenticationError('INVALID_GRANT');
    } catch (err) {
      throw new AuthenticationError(err);
    }
  }
};
