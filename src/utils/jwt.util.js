const jwt = require('jsonwebtoken');
const CommonFunctionUtil = require('./common-function.util');

const tokenSecret = process.env.JWT_SECRET;
module.exports = {
  /** Issue a token */
  issueToken(payload) {
    return jwt.sign(
      {
        auth: payload,
        exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60
      },
      tokenSecret
    );
  },

  /** Verify a token */
  verify(token) {
    return new Promise((resolve, reject) => jwt.verify(token, tokenSecret, {}, (err, payload) => {
      if (!err) {
        return resolve(payload);
      }
      return reject(err);
    }));
  },
  /**
   * Generate login Response
   * @param {object} user - user object
   * @param {string} [ message ] - message to be shown
   */
  authenticate(user, message) {
    const token = this.issueToken(
      user._id /* eslint no-underscore-dangle: 0 */
    );
    const response = {
      message: message || 'User successfully logged in',
      refreshToken: CommonFunctionUtil.generateHash(),
      token
    };
    if (typeof message === 'undefined') {
      response.user = {
        email: user.email,
        id: user._id
      };
    }
    return response;
  }
};
