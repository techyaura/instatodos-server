const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInputObjectType
} = require('graphql');

const { UserService, TemplateService } = require('../../../services');

const { emailRequestSuccessType } = require('../../types');

const { emailValidator } = require('../../../validators');

const { EmailUtil, CommonFunctionUtil } = require('../../../utils');


module.exports = {
  type: emailRequestSuccessType,
  args: {
    input: {
      type: new GraphQLInputObjectType({
        name: 'UserForgotPasswordInputType',
        fields: {
          email: {
            type: new GraphQLNonNull(GraphQLString)
          }
        }
      })
    }
  },
  resolve(root, args, context) {
    const { res, next } = context;
    return emailValidator(args.input, res, next)
      .then(() => {
        const otp = CommonFunctionUtil.generateOtp();
        const hashToken = CommonFunctionUtil.generateHash(args.input.email ? args.input.email : '');
        return UserService.forgotPasswordByOtp({ ...args.input, otp, hashToken });
      })
      .then(user => TemplateService.fetch('FORGOT_PASSWORD').then(templateObj => [user, templateObj]))
      .then((response) => {
        const [user, templateObject] = response;
        const { otp, email } = user;
        const username = CommonFunctionUtil.generateUsernameFromEmail(user.email);
        let { template } = templateObject;
        const { subject } = templateObject;
        template = template.replace('{{COMPANY_NAME}}', '');
        template = template.replace('{{COMPANY_URL}}', '');
        template = template.replace('{{OTP}}', otp);
        template = template.replace('{{USERNAME}}', username);
        template = template.replace('{{COMPANY_TAG_LINE}}', '');
        const mailOptions = {
          html: template,
          subject,
          to: email
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
