class SmsUtil {
  constructor() {
    // const plivo = require('plivo');
    const plivo = {};
    this.client = new plivo.Client(
      this.configOptions().authId,
      this.configOptions().authToken,
    );
  }

  static configOptions() {
    const smtpConfig = {
      authId: process.env.PLIVO_AUTHID,
      authToken: process.env.PLIVO_AUTH_TOKEN || ''
    };
    return smtpConfig;
  }

  send() {
    const params = {
      src: '2222222222',
      dest: '+91953037958',
      text: 'Hello, how are you?'
    };
    return new Promise((resolve, reject) => this.client.messages
      .create(params)
      .then(response => resolve(response))
      .catch(err => reject(err)));
  }
}

module.exports = SmsUtil;
