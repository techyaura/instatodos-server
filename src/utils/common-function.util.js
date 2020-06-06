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

  static getDateInfo(dateParam, dateObj = new Date()) {
    if (dateParam === 'm') {
      return dateObj.getMonth() + 1;
    }
    if (dateParam === 'd') {
      return dateObj.getDate();
    }
    if (dateParam === 'y') {
      return dateObj.getFullYear();
    }
    throw new Error('Provide date Param');
  }

  static slugify(text) {
    return text
      .toString() // Cast to string
      .toLowerCase() // Convert the string to lowercase letters
      .normalize('NFD') // The normalize() method returns the Unicode Normalization Form of a given string.
      .trim() // Remove whitespace from both sides of a string
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\\-]+/g, '') // Remove all non-word chars
      .replace(/\\-\\-+/g, '-'); // Replace multiple - with single -
  }
}

module.exports = CommonFunctionUtil;
