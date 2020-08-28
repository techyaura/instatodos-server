const { JwtUtil } = require('../../utils');
const TodoService = require('../todo/todo.service');
const ProjectService = require('../project/project.service');

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
        url: postBody.profile_image
      },
      password: postBody.gID,
      status: true
    }).save();
    const newUser = await this.UserModel.findOne({
      email: postBody.email,
      gId: postBody.gID
    }).lean();

    await TodoService.labelDefaultOnRgister({ user: newUser });
    await ProjectService.projectDefaultOnRgister({ user: newUser });
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
