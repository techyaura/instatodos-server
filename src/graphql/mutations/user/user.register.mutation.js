const {
  GraphQLNonNull
} = require('graphql');

const { UserService, TemplateService } = require('../../../services');

const { userRegisterInputType, successType } = require('../../types');

const { registerValidator } = require('../../../validators');

const { EmailUtil, CommonFunctionUtil } = require('../../../utils');

module.exports = {
  type: successType,
  args: {
    input: {
      type: new GraphQLNonNull(userRegisterInputType)
    }
  },
  resolve(root, args, context) {
    const otp = CommonFunctionUtil.generateOtp();
    const { res, next } = context;
    return registerValidator(args.input, res, next).then(() => UserService.register({ ...args.input, otp }))
      .then(user => TemplateService.fetch('USER_REGISTER').then(templateObj => [user, templateObj]))
      .then((response) => {
        const [user, templateObject] = response;
        const username = CommonFunctionUtil.generateUsernameFromEmail(user.email);
        let { template } = templateObject;
        template = template.replace('{{COMPANY_NAME}}', '');
        template = template.replace('{{COMPANY_URL}}', '');
        template = template.replace('{{OTP}}', otp);
        template = template.replace('{{USERNAME}}', username);
        template = template.replace('{{COMPANY_TAG_LINE}}', '');
        const mailOptions = {
          html: template,
          subject: templateObject.subject,
          to: user.email
        };
        return EmailUtil.sendViaSendgrid(mailOptions);
      })
      .then(() => ({ message: 'User Registered', ok: true }))
      .catch(err => next(err));
  }
};
