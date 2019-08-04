const {
  GraphQLNonNull
} = require('graphql');

const { UserService, TemplateService } = require('../../../services');

const { userRegisterInputType, successType } = require('../../types');

const { registerValidator } = require('../../../validators');

const { EmailUtil } = require('../../../utils');

module.exports = {
  type: successType,
  args: {
    input: {
      type: new GraphQLNonNull(userRegisterInputType)
    }
  },
  resolve(root, args, context) {
    const { res, next } = context;
    return registerValidator(args, res, next).then(() => UserService.register(args))
      .then(user => TemplateService.fetch('USER_REGISTER').then(templateObj => [user, templateObj]))
      .then((response) => {
        const [user, templateObject] = response;
        const mailOptions = {
          html: templateObject.template,
          subject: templateObject.subject,
          to: user.email
        };
        return EmailUtil.sendViaSendgrid(mailOptions);
      })
      .then(() => ({ message: 'User Registered' }))
      .catch(err => next(err));
  }
};
