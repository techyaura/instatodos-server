const Joi = require('joi');

const configSchema = Joi.object().keys({
  theme: Joi.string()
    .min(3)
    .max(30),
  lang: Joi.string()
    .min(2)
    .max(2)
});

module.exports = {
  async configSettingValidator(req) {
    const reqBody = req.body || req;
    await Joi.validate(reqBody, configSchema);
  }
};
