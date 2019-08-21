const Joi = require('joi');

const addTodoSchema = Joi.object().keys({
  title: Joi.string()
    .min(4)
    .max(30)
    .required()
});
const updateTodoSchema = Joi.object().keys({
  id: Joi.string().required(),
  title: Joi.string()
    .min(4)
    .max(30)
    .required(),
  isCompleted: Joi.boolean().optional()
});
const addTodoCommentSchema = Joi.object().keys({
  todoId: Joi.string().required(),
  description: Joi.string()
    .min(4)
    .max(200)
    .required()
});
const updateTodoCommentSchema = Joi.object().keys({
  id: Joi.string().required(),
  todoId: Joi.string().required(),
  description: Joi.string()
    .min(4)
    .max(200)
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
  },
  addTodoCommentValidator(req) {
    const reqBody = req.body || req;
    return new Promise((resolve, reject) => Joi.validate(reqBody, addTodoCommentSchema, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    }));
  },
  updateTodoCommentValidator(req) {
    const reqBody = req.body || req;
    return new Promise((resolve, reject) => Joi.validate(reqBody, updateTodoCommentSchema, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    }));
  }
};
