const Joi = require('joi');

const addTodoSchema = Joi.object().keys({
  title: Joi.string()
    .min(4)
    .max(30)
    .required()
});
const updateTodoSchema = Joi.object().keys({
  _id: Joi.string().required(),
  title: Joi.string()
    .min(4)
    .max(30)
    .required()
});
module.exports = {
  addTodoValidator(req) {
    const reqBody = req.body || req;
    return new Promise((resolve, reject) => Joi.validate(reqBody, addTodoSchema, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    }));
  },
  updateTodoValidator(req) {
    const reqBody = req.body || req;
    return new Promise((resolve, reject) => Joi.validate(reqBody, updateTodoSchema, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    }));
  }
};
