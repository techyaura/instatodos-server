const { JwtUtil } = require('../../utils');
const TodoService = require('../todo/todo.service');
const ProjectService = require('../project/project.service');
const { CommonFunctionUtil } = require('../../utils/common-function.util');

const { UserModel } = require('../../models');

class SocialLoginService {
  constructor() {
    this.JwtService = JwtUtil;
    this.UserModel = UserModel;
  }

  async googleLogin(postBody) {
    const existUser = await this.UserModel.findOne(
      {
        isDeleted: false,
        status: true,
        email: postBody.email,
        gId: postBody.gID
      }
    ).lean();
    if (existUser) {
      return this.__generateResponse(existUser);
    }
    await this.UserModel({
      firstname: postBody.firstname,
      lastname: postBody.lastname,
      email: postBody.email,
      gId: postBody.gID,
      profilePic: {
        url: postBody.gID
      },
      password: postBody.email
    }).save();
    const newUser = await this.UserModel.findOne({
      email: postBody.email,
      gId: postBody.gID
    });
    await TodoService.labelDefaultOnRgister({ newUser });
    await ProjectService.projectDefaultOnRgister({ newUser });
    return this.__generateResponse(newUser);
  }

  __generateResponse(user) {
    const token = this.JwtService.issueToken(
      user._id /* eslint no-underscore-dangle: 0 */
    );
    return Promise.resolve({
      message: 'User successfully logged in',
      token,
      user: {
        email: user.email,
        id: user._id
      }
    });
  }
}

module.exports = new SocialLoginService();
