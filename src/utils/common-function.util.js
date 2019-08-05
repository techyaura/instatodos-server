/**
 * @name CommonFunctionUtil
 * @desc Common functions
 */
const crypto = require('crypto');

class CommonFunctionUtil {
  static generateOtp(sequenceLength = 6) {
    let text = '';
    const possible = '0123456789';
    for (let i = 0; i < sequenceLength; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  static generateUsernameFromEmail(email) {
    const nameMatch = email.match(/^([^@]*)@/);
    const username = nameMatch ? nameMatch[1] : null;
    return this.capitalizeFirstLetter(username);
  }

  static capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static generateHash(email = '') {
    const currentDate = new Date().valueOf().toString();
    const random = Math.random().toString();
    const hash = crypto
      .createHash('sha1')
      .update(currentDate + random + email)
      .digest('hex');
    return hash;
  }
}

module.exports = CommonFunctionUtil;
