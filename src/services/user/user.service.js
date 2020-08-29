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

  async login(postBody) {
    const user = await this.UserModel.findOne(
      {
        isDeleted: false,
        status: true,
        email: postBody.email
      }
    ).lean();
    if (!user) {
      throw new ForbiddenError('NO_USER_FOUND');
    }
    return new Promise((resolve, reject) => new UserModel().comparePassword(postBody.password, user, (isValidPassword) => {
      if (isValidPassword) {
        return resolve(JwtUtil.authenticate(user));
      }
      return reject(new AuthenticationError('INVALID_CREDENTIALS'));
    }));
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
    const response = await this.UserModel.findOne({ _id: user._id }).lean();
    if (response) {
      const { _id, ...userObj } = response;
      return { ...userObj, id: _id, _id };
    }
    throw new Error('NO_USER_FOUND');
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
    const update = {
      firstname: postBody.firstname,
      lastname: postBody.lastname
    };
    if (postBody && typeof postBody.profilePic !== 'undefined') {
      update.profilePic = postBody.profilePic;
    }
    await this.UserModel.findOneAndUpdate({ _id: user._id }, { $set: update });
  }

  async refreshToken({ user }, postBody) {
    const existUser = await this.UserModel.findOne({
      _id: user._id,
      refreshToken: postBody.refreshToken
    }).lean();
    if (existUser) {
      return JwtUtil.authenticate(existUser, 'Token has been generated');
    }
    throw new ForbiddenError('NO_USER_FOUND');
  }
}

module.exports = new AuthService();
