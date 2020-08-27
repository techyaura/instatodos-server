const UserService = require('./user/user.service');
const TodoService = require('./todo/todo.service');
const TemplateService = require('./template/template.service');
const ThoughtService = require('./thought/thought.service');
const ProjectService = require('./project/project.service');
const SocialLoginService = require('./social-login/social-login.service');

module.exports = {
  UserService,
  TodoService,
  TemplateService,
  ThoughtService,
  ProjectService,
  SocialLoginService
};
