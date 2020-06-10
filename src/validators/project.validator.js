const Joi = require('joi');

const addTodoProjectSchema = Joi.object().keys({
  name: Joi.string()
    .regex(/^\S+$/)
    .min(2)
    .max(60)
    .required()
});
const updateTodoProjectSchema = Joi.object().keys({
  id: Joi.string().required(),
  name: Joi.string()
    .regex(/^\S+$/)
    .min(2)
    .max(30)
    .required()
});
module.exports = {
  async addTodoProjectValidator(req) {
    const reqBody = req.body || req;
    await Joi.validate(reqBody, addTodoProjectSchema);
  },
  async updateTodoProjectValidator(req) {
    const reqBody = req.body || req;
    await Joi.validate(reqBody, updateTodoProjectSchema);
  }
};
