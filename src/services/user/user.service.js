const { ApolloError, AuthenticationError, ForbiddenError } = require('apollo-server');
const { JwtUtil } = require('../../utils');
const TodoService = require('../todo/todo.service');
const ProjectService = require('../project/project.service');

const { UserModel } = require('../../models');

class AuthService {
  constructor() {
    this.JwtService = JwtUtil;
    this.UserModel = UserModel;
  }

  checkUniqueEmail(email) {
    return this.UserModel.findOne({ email })
      .then((response) => {
        if (response) {
          return Promise.reject(new ApolloError('Email address not available'));
        }
        return Promise.resolve(true);
      })
      .catch(err => Promise.reject(err));
  }

  register(postBody) {
    return this.UserModel(postBody)
      .save()
      .then(user => Promise.all([
        TodoService.labelDefaultOnRgister({ user }),
        ProjectService.projectDefaultOnRgister({ user })
      ]))
      .then(() => Promise.resolve({ message: 'User succsessfully registered', ...postBody }))
      .catch(err => Promise.reject(err));
  }

  registerVerificationByOtp(postBody) {
    return this.UserModel.findOneAndUpdate({
      otp: postBody.otp,
      hashToken: postBody.hashToken
    },
      {
        status: true,
        otp: ''
      },
      {
        upsert: false,
        new: true
      })
      .then((response) => {
        if (!response) {
          return Promise.reject(new ApolloError('INVALID_OTP'));
        }
        return {
          message: 'Email succsessfully verified',
          ...postBody,
          ok: true
        };
      })
      .catch(err => Promise.reject(err));
  }

  login(postBody) {
    return this.UserModel.findOne(
      {
        isDeleted: false,
        status: true,
        email: postBody.email
      }
    )
      .then((user) => {
        if (!user) {
          throw new ForbiddenError('NO_USER_FOUND');
        }
        return new Promise((resolve, reject) => new UserModel().comparePassword(postBody.password, user, (err, valid) => {
          if (err) {
            return reject(err);
          }
          if (!valid) {
            return reject(new AuthenticationError('INVALID_CREDENTIALS'));
          }
          const token = this.JwtService.issueToken(
            user._id /* eslint no-underscore-dangle: 0 */
          );
          return resolve({
            message: 'User successfully logged in',
            token,
            user: {
              email: user.email,
              id: user._id
            }
          });
        }));
      })
      .catch((err) => {
        throw err;
      });
  }

  forgotPasswordByOtp(postBody) {
    const { email, hashToken, otp } = postBody;
    return this.UserModel.findOneAndUpdate(
      { email, status: true, isDeleted: false },
      { hashToken, otp },
      { new: true, upsert: false }
    )
      .then((response) => {
        if (!response) {
          return Promise.reject(new ForbiddenError(`No account exist with ${email}`));
        }
        return {
          email,
          otp,
          hashToken
        };
      })
      .catch(err => Promise.reject(err));
  }

  resetPassword(postBody) {
    const { hashToken, password } = postBody;
    return this.UserModel
      .findOne({ hashToken, status: true, isDeleted: false })
      .then((user) => {
        if (!user) {
          return Promise.reject(new ForbiddenError('No User Found'));
        }
        user.password = password;
        user.hashToken = '';
        return user.save();
      })
      .catch(err => Promise.reject(err));
  }

  async profile({ user }) {
    try {
      return await this.UserModel.findById(user._id);
    } catch (err) {
      throw err;
    }
  }

  updatePassword({ user }, postBody) {
    const { password } = postBody;
    return this.UserModel
      .findOne({ _id: user._id, status: true, isDeleted: false })
      .then(async (response) => {
        if (!response) {
          return Promise.reject(new ForbiddenError('No User Found'));
        }
        response.password = password;
        await response.save();
        return { ok: true, message: 'Password Changed successfully' };
      })
      .catch(err => Promise.reject(err));
  }

  async updateProfile({ user }, postBody) {
    try {
      const update = {
        firstname: postBody.firstname,
        lastname: postBody.lastname
      };
      if (typeof postBody !== 'undefined') {
        update.profilePic = postBody.profilePic;
      }
      return await this.UserModel.findOneAndUpdate({ _id: user._id }, { $set: update });
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new AuthService();
