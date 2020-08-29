/**
 * @name CommonFunctionUtil
 * @desc Common functions
 */
const crypto = require('crypto');

class CommonFunctionUtil {
  /**
   * Generate a random number of desire length
   * @param {*} [sequenceLength = 6] - number lenght
   */
  static generateOtp(sequenceLength = 6) {
    let text = '';
    const possible = '0123456789';
    for (let i = 0; i < sequenceLength; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  /**
   * Used to extract username from email
   * @param {string} email - email address
   */
  static generateUsernameFromEmail(email) {
    const nameMatch = email.match(/^([^@]*)@/);
    const username = nameMatch ? nameMatch[1] : null;
    return this.capitalizeFirstLetter(username);
  }

  /**
   * use to capatilize first word
   * @param {sytring} str - Random string
   */
  static capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Generate hash
   * @param { string } [ hashString ] - String to be used for hash
   */
  static generateHash(hashString) {
    if (typeof hashString === 'undefined') {
      hashString = this.generateOtp();
    }
    const currentDate = new Date().valueOf().toString();
    const random = Math.random().toString();
    const hash = crypto
      .createHash('sha1')
      .update(currentDate + random + hashString)
      .digest('hex');
    return hash;
  }

  /**
   * @param {string} dateParam - value to be extract from date
   * @param {*} dateObj - date
   */
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

  /**
   * create slug from string
   * @param {string} text - string to be slugify
   */
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
