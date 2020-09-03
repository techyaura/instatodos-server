const UserService = require('./user/user.service');
const TodoService = require('./todo/todo.service');
const TemplateService = require('./template/template.service');
const ThoughtService = require('./thought/thought.service');
const ProjectService = require('./project/project.service');
const SocialLoginService = require('./social-login/social-login.service');
const TodoLabelService = require('./todo-label/todo-label.service');
const TodoCommentService = require('./todo-comment/todo-comment.service');

module.exports = {
  UserService,
  TodoService,
  TemplateService,
  ThoughtService,
  ProjectService,
  SocialLoginService,
  TodoLabelService,
  TodoCommentService
};
