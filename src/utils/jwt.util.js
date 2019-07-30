const jwt = require('jsonwebtoken');

const tokenSecret = process.env.JWT_SECRET;
module.exports = {
  /** Issue a token */
  issueToken(payload) {
    return jwt.sign(
      {
        auth: payload,
        exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60
      },
      tokenSecret,
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
  }
};
