const {
  GraphQLNonNull
} = require('graphql');

const { UserService, TemplateService } = require('../../../services');

const { userRegisterInputType, emailRequestSuccessType } = require('../../types');

const { registerValidator } = require('../../../validators');

const { EmailUtil, CommonFunctionUtil } = require('../../../utils');

module.exports = {
  type: emailRequestSuccessType,
  args: {
    input: {
      type: new GraphQLNonNull(userRegisterInputType)
    }
  },
  resolve(root, args, context) {
    const otp = CommonFunctionUtil.generateOtp();
    const hashToken = CommonFunctionUtil.generateHash(args.input.email ? args.input.email : '');
    const { res, next } = context;
    return registerValidator(args.input, res, next)
      .then(() => {
        const { email } = args.input;
        return UserService.checkUniqueEmail(email);
      })
      .then(() => UserService.register({ ...args.input, otp, hashToken }))
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
        EmailUtil.sendViaSendgrid(mailOptions);
        return {
          message: 'An OTP has been sent on your email.',
          hashToken: user.hashToken
        };
      })
      .then(response => ({ ...response }))
      .catch(err => next(err));
  }
};
