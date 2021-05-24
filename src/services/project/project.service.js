const mongoose = require('mongoose');
const { ProjectModel } = require('../../models');
const { CommonFunctionUtil } = require('../../utils');

class ProjectService {
  constructor() {
    this.ProjectModel = ProjectModel;
  }

  __checkUniqueProject(label, user) {
    return this.ProjectModel
      .findOne({ name: label, user: user._id })
      .lean();
  }

  async todoProjectList({ user }) {
    const { _id: userId } = user;
    const query = { user: userId };
    return this.ProjectModel.find(query);
  }

  async addTodoProject(context, postBody) {
    const { user } = context;
    const { _id: userId } = user;
    const { name } = postBody;
    const isExist = await this.__checkUniqueProject(name, user);
    if (isExist) {
      throw new Error('List Should be unique');
    }
    await this.ProjectModel({ ...postBody, user: userId, slug: CommonFunctionUtil.slugify(name) }).save();
    return { message: 'List has been succesfully added', ok: true };
  }

  async updateTodoProject({ user }, params, postBody) {
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
    throw new Error(403);
  }

  async deleteTodoProject({ user }, params) {
    const { id: todoLabelId } = params;
    const response = await this.ProjectModel.deleteOne({
      user: user._id, _id: todoLabelId
    });
    if (response && response.n !== 0) {
      return { ok: true, message: 'List deleted successfully' };
    }
    throw new Error(403);
  }

  todoProjectListCount({ user }) {
    return this.ProjectModel
      .aggregate([
        {
          $match: { isDeleted: false, status: true, user: mongoose.Types.ObjectId(user._id) }
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
                  status: true,
                  projectId: { $ne: null },
                  parent: { $eq: null },
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
    return this.ProjectModel.create(mappedArray);
  }
}

module.exports = new ProjectService();
