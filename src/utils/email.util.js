/**
 * @name EmailUtil
 * @desc Used to send email
 * @params mailOptions
 * @template mailOptions = {
      to: email,
      subject: SUBJECT,
      html: data,
    };
 */
class EmailUtil {
  constructor() {
    this.Nodemailer = require('nodemailer');
    this.fromEmail = process.env.SMTP_FROM_EMAIL || 'info@sumanix.com';
  }

  static smtpConfigOptions() {
    const smtpConfig = {
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_EMAIL || '',
        pass: process.env.SMTP_PASSWPORD || ''
      }
    };
    return smtpConfig;
  }

  transporter() {
    return this.Nodemailer.createTransport(
      this.constructor.smtpConfigOptions(),
    );
  }

  static smtpConfigOptionsSendgrid() {
    return new Promise((resolve) => {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      return resolve(sgMail);
    });
  }

  sendViaNodemailer(mailOptions) {
    return new Promise((resolve, reject) => {
      if (!this.constructor.validateEmailOptions) {
        return reject(new Error('Invalid Email Options'));
      }
      mailOptions = { ...mailOptions, from: this.fromEmail };
      return this.transporter().sendMail(mailOptions, (err, info) => {
        if (err) {
          return reject(err);
        }
        return resolve(info);
      });
    });
  }

  sendViaSendgrid(mailOptions) {
    return new Promise((resolve, reject) => {
      if (!this.constructor.validateEmailOptions) {
        return reject(new Error('Invalid Email Options'));
      }
      mailOptions = { ...mailOptions, from: this.fromEmail };
      return this.constructor.smtpConfigOptionsSendgrid()
        .then(sendGridInstance => sendGridInstance.send(mailOptions))
        .then(response => resolve(response))
        .catch(err => reject(err));
    });
  }

  static validateEmailOptions(mailOptions) {
    if (typeof (mailOptions) === 'object') {
      if (mailOptions.hasOwnProperty('to') && mailOptions.hasOwnProperty('subject') && mailOptions.hasOwnProperty('html')) {
        if (mailOptions.to && mailOptions.subject && mailOptions.html) {
          return true;
        }
      }
    }
    return false;
  }
}

module.exports = new EmailUtil();
