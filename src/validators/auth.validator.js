const Joi = require('joi');

const registerSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(8)
    .max(30)
    .required()
});
const loginSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(6)
    .max(30)
    .required()
});
module.exports = {
  registerValidator(req) {
    const reqBody = req.body || req;
    return new Promise((resolve, reject) => Joi.validate(reqBody, registerSchema, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    }));
  },
  loginValidator(req) {
    const reqBody = req.body || req;
    return new Promise((resolve, reject) => Joi.validate(reqBody, loginSchema, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    }));
  }
};
