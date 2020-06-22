const Joi = require('joi');

const addTodoLabelSchema = Joi.object().keys({
  name: Joi.string()
    .regex(/^\S+$/)
    .min(2)
    .max(60)
    .required(),
  description: Joi.string().optional().allow(''),
  color: Joi.string().required()
});
const updateTodoLabelSchema = Joi.object().keys({
  id: Joi.string().required(),
  name: Joi.string()
    .regex(/^\S+$/)
    .min(2)
    .max(30)
    .required(),
  description: Joi.string().optional().allow(''),
  color: Joi.string().required()
});
module.exports = {
  async addTodoLabelValidator(req) {
    const reqBody = req.body || req;
    await Joi.validate(reqBody, addTodoLabelSchema);
  },
  async updateTodoLabelValidator(req) {
    const reqBody = req.body || req;
    await Joi.validate(reqBody, updateTodoLabelSchema);
  }
};
