const mongoose = require('mongoose');
const { ProjectModel } = require('../../models');
const { CommonFunctionUtil } = require('../../utils');

class ProjectService {
  constructor() {
    this.ProjectModel = ProjectModel;
  }

  async __checkUniqueProject(label, user) {
    try {
      return await this.ProjectModel.findOne({ name: label, user: user._id }).then(data => (!!(data)));
    } catch (err) {
      throw err;
    }
  }

  async todoProjectList({ user }) {
    const { _id: userId } = user;
    const query = { user: userId };
    try {
      return await this.ProjectModel.find(query);
    } catch (err) {
      throw err;
    }
  }

  async addTodoProject(context, postBody) {
    try {
      const { user } = context;
      const { _id: userId } = user;
      const { name } = postBody;
      const isExist = await this.__checkUniqueProject(name, user);
      if (isExist) {
        throw new Error('List Should be unique');
      }
      await this.ProjectModel({ ...postBody, user: userId, slug: CommonFunctionUtil.slugify(name) }).save();
      return { message: 'List has been succesfully added', ok: true };
    } catch (err) {
      throw err;
    }
  }

  async updateTodoProject({ user }, params, postBody) {
    try {
      const { id: todoLabelId } = params;
      const { _id: userId } = user;
      const { name } = postBody;
      const isExist = await this.__checkUniqueProject(name, user);
      if (isExist) {
        throw new Error('List Should be unique');
      }
      const slug = CommonFunctionUtil.slugify(name);
      const response = await this.ProjectModel.updateOne({
        user: userId, _id: todoLabelId
      }, { $set: { name, slug } });
      if (response && response.n !== 0) {
        return { message: 'List has been succesfully updated', ok: true };
      }
      return Promise.reject(new Error(403));
    } catch (err) {
      throw err;
    }
  }

  async deleteTodoProject({ user }, params) {
    try {
      const { id: todoLabelId } = params;
      const response = await this.ProjectModel.deleteOne({
        user: user._id, _id: todoLabelId
      });
      if (response && response.n !== 0) {
        return { ok: true, message: 'List deleted successfully' };
      }
      return Promise.reject(new Error(403));
    } catch (err) {
      throw err;
    }
  }

  async todoProjectListCount({ user }) {
    try {
      return await this.ProjectModel
        .aggregate([
          {
            $match: { isDeleted: false, user: mongoose.Types.ObjectId(user._id) }
          },
          {
            $lookup: {
              from: 'todos',
              let: { nativeProjectId: '$_id' },
              pipeline: [
                {
                  $match: {
                    isDeleted: false,
                    isCompleted: false,
                    projectId: { $ne: null },
                    $expr: {
                      $and: [
                        { $eq: ['$$nativeProjectId', '$projectId'] }
                      ]
                    }
                  }
                }
              ],
              as: 'list'
            }
          },
          {
            $unwind: {
              path: '$list',
              preserveNullAndEmptyArrays: true
            }
          },
          // {
          //   $project: {
          //     _id: 1,
          //     name: { $toLower: '$name' },
          //     slug: 1,
          //     list: 1
          //   }
          // },
          {
            $group: {
              _id: '$name',
              projectId: { $first: '$_id' },
              name: { $first: '$name' },
              slug: { $first: '$slug' },
              todos: { $push: '$list' }
            }
          },
          {
            $project: {
              _id: '$projectId',
              name: '$name',
              slug: '$slug',
              count: { $sum: { $size: '$todos' } }
            }
          },
          {
            $sort: { name: 1 }
          }
        ]);
    } catch (err) {
      throw err;
    }
  }

  async projectDefaultOnRgister({ user }) {
    const { _id: userId } = user;
    const projects = [{
      name: 'Personal'
    }];
    const mappedArray = projects.map((item) => {
      item.slug = CommonFunctionUtil.slugify(item.name);
      item.user = userId;
      return item;
    });
    await this.ProjectModel.create(mappedArray);
  }
}

module.exports = new ProjectService();
