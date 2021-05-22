const mongoose = require('mongoose');
const { TodoLabelModel } = require('../../models');
const { CommonFunctionUtil } = require('../../utils');

class TodoLabelService {
  constructor() {
    this.TodoLabelModel = TodoLabelModel;
  }

  async todoLabelList({ user }) {
    const { _id: userId } = user;
    const query = { user: userId };
    return this.TodoLabelModel.find(query);
  }

  async addTodoLabel(context, postBody) {
    const { user } = context;
    const { _id: userId } = user;
    const { name } = postBody;
    const isExist = await this.checkUniqueLabel(name, user);
    if (isExist) {
      throw new Error('Label Should be unique');
    }
    await this.TodoLabelModel({ ...postBody, user: userId, slug: CommonFunctionUtil.slugify(name) }).save();
    return { message: 'Todo label has been succesfully added', ok: true };
  }

  async updateTodoLabel({ user }, params, postBody) {
    const { id: todoLabelId } = params;
    const { _id: userId } = user;
    const { name } = postBody;
    const isLabelExist = await this.checkLabelByIdAndName(todoLabelId, name, user);
    if (isLabelExist) {
      throw new Error('Label Should be unique');
    }
    const slug = CommonFunctionUtil.slugify(name);
    postBody.slug = slug;
    const response = await this.TodoLabelModel.updateOne({
      user: userId, _id: todoLabelId
    }, { $set: postBody });
    if (response && response.n !== 0) {
      return { message: 'TodoLabel has been succesfully updated', ok: true };
    }
    throw new Error(403);
  }

  checkUniqueLabel(label, user) {
    return this.TodoLabelModel
      .findOne({ name: label, user: user._id })
      .lean();
  }

  checkLabelByIdAndName(labelId, label, user) {
    return this.TodoLabelModel
      .findOne({ _id: { $ne: labelId }, name: label, user: user._id })
      .lean();
  }

  async deleteTodoLabel({ user }, params) {
    const { id: todoLabelId } = params;
    const response = await this.TodoLabelModel.deleteOne({
      user: user._id, _id: todoLabelId
    });
    if (response && response.n !== 0) {
      return { ok: true, message: 'TodoLabel deleted successfully' };
    }
    throw new Error(403);
  }

  todoLabelListCount({ user }) {
    return this.TodoLabelModel
      .aggregate([
        {
          $match: { isDeleted: false, user: mongoose.Types.ObjectId(user._id) }
        },
        {
          $lookup: {
            from: 'todos',
            let: { labelId: '$_id' },
            pipeline: [
              {
                $match: {
                  isDeleted: false,
                  isCompleted: false,
                  labelIds: { $ne: null },
                  $expr: {
                    $and: [
                      { $in: ['$$labelId', '$labelIds'] }
                    ]
                  }
                }
              }
            ],
            as: 'labels'
          }
        },
        {
          $unwind: {
            path: '$labels',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            name: { $toLower: '$name' },
            label: 1,
            slug: 1,
            color: 1,
            description: 1
          }
        },
        {
          $group: {
            _id: '$name',
            labelId: { $first: '$_id' },
            name: { $first: '$name' },
            slug: { $first: '$slug' },
            color: { $first: '$color' },
            description: { $first: '$description' },
            todos: { $push: '$labels' }
          }
        },
        {
          $project: {
            _id: '$labelId',
            name: 1,
            slug: 1,
            color: 1,
            description: 1,
            count: { $sum: { $size: '$todos' } }
          }
        },
        {
          $sort: { name: 1 }
        }
      ]);
  }

  async labelDefaultOnRgister({ user }) {
    const { _id: userId } = user;
    const labels = [{
      name: 'Important',
      color: '#d73a4a'
    },
    {
      name: 'Priority',
      color: '#e4e669'
    }, {
      name: 'Help',
      color: '#008672'
    }];
    const mappedArray = labels.map((item) => {
      item.slug = CommonFunctionUtil.slugify(item.name);
      item.user = userId;
      return item;
    });
    return this.TodoLabelModel.create(mappedArray);
  }
}

module.exports = new TodoLabelService();
