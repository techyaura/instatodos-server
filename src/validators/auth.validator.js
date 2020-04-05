const Joi = require('joi');

const emailSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
});

const registerSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(8)
    .max(30)
    .required()
});
const registerVerificationSchema = Joi.object().keys({
  hashToken: Joi.string()
    .required(),
  otp: Joi.string()
    .min(6)
    .max(6)
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
const resetPasswordSchema = Joi.object().keys({
  hashToken: Joi.string()
    .required(),
  password: Joi.string()
    .min(6)
    .max(30)
    .required()
});
const passwordSchema = Joi.object().keys({
  password: Joi.string()
    .min(6)
    .max(30)
    .required()
});

module.exports = {
  async emailValidator(req) {
    const reqBody = req.body || req;
    await Joi.validate(reqBody, emailSchema);
  },
  async registerValidator(req) {
    const reqBody = req.body || req;
    await Joi.validate(reqBody, registerSchema);
  },
  async loginValidator(req) {
    const reqBody = req.body || req;
    await Joi.validate(reqBody, loginSchema);
  },
  async registerVerificationValidator(req) {
    const reqBody = req.body || req;
    await Joi.validate(reqBody, registerVerificationSchema);
  },
  async resetPasswordValidator(req) {
    const reqBody = req.body || req;
    await Joi.validate(reqBody, resetPasswordSchema);
  },
  async passwordValidator(req) {
    const reqBody = req.body || req;
    await Joi.validate(reqBody, passwordSchema);
  }
};
