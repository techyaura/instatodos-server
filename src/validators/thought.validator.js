const Joi = require('joi');

const addThoughtSchema = Joi.object().keys({
  title: Joi.string().min(4).max(100).required(),
  description: Joi.string().min(10).optional().allow(''),
  accomplishTenure: Joi.date().optional(),
  isPinned: Joi.boolean().optional(),
  isAchieved: Joi.boolean().optional()
});
const updateThoughtSchema = Joi.object().keys({
  id: Joi.string().required(),
  title: Joi.string().min(4).max(100),
  description: Joi.string().min(10).max(1000).optional()
    .allow(''),
  accomplishTenure: Joi.date().optional(),
  isPinned: Joi.boolean().optional(),
  isAchieved: Joi.boolean().optional()
});
module.exports = {
  async addThoughtValidator(req) {
    const reqBody = req.body || req;
    await Joi.validate(reqBody, addThoughtSchema);
  },
  async updateThoughtValidator(req) {
    const reqBody = req.body || req;
    await Joi.validate(reqBody, updateThoughtSchema);
  }
};
