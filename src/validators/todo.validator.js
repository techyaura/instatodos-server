const Joi = require('joi');

const addTodoSchema = Joi.object().keys({
  projectId: Joi.string().optional(),
  title: Joi.string()
    .min(4)
    .max(60)
    .required(),
  label: Joi.array().items(Joi.string()).optional(),
  scheduledDate: Joi.date().allow(null),
  priority: Joi.string().optional(),
  notes: Joi.string().optional()
});
const updateTodoSchema = Joi.object().keys({
  id: Joi.string().required(),
  projectId: Joi.string().optional(),
  label: Joi.array().items(Joi.string()).optional(),
  title: Joi.string()
    .min(4)
    .max(100)
    .optional(),
  isCompleted: Joi.boolean().optional(),
  isInProgress: Joi.boolean().optional(),
  priority: Joi.string().optional(),
  scheduledDate: Joi.date().optional().allow(null),
  notes: Joi.string().optional(),
  noteId: Joi.string().optional()
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
  async addTodoValidator(req) {
    const reqBody = req.body || req;
    await Joi.validate(reqBody, addTodoSchema);
  },
  async updateTodoValidator(req) {
    const reqBody = req.body || req;
    await Joi.validate(reqBody, updateTodoSchema);
  },
  async addTodoCommentValidator(req) {
    const reqBody = req.body || req;
    await Joi.validate(reqBody, addTodoCommentSchema);
  },
  async updateTodoCommentValidator(req) {
    const reqBody = req.body || req;
    await Joi.validate(reqBody, updateTodoCommentSchema);
  }
};
