const mongoose = require('mongoose');
const { TodoModel, TodoLabelModel } = require('../../models');

class TodoService {
  constructor() {
    this.TodoModel = TodoModel;
    this.TodoLabelModel = TodoLabelModel;
  }

  async addTodo({ user }, postBody) {
    const todo = this.TodoModel({ ...postBody, user: user._id });
    try {
      await todo.save();
      return { message: 'Todo has been succesfully added', ok: true };
    } catch (err) {
      throw err;
    }
  }

  async viewTodo({ user }, params) {
    try {
      return await this.TodoModel.findOne({ _id: params.id, user: user._id }).populate({ path: 'user' });
    } catch (err) {
      throw err;
    }
  }

  async completedTodo({ user }) {
    const conditions = {
      user: mongoose.Types.ObjectId(user._id),
      isCompleted: true
    };
    try {
      const response = await this.TodoModel
        .aggregate([
          {
            $match: conditions
          },
          {
            $project: {
              name: 1,
              title: '$title',
              label: '$label',
              isCompleted: '$isCompleted',
              isInProgress: '$isInProgress',
              createdAt: '$createdAt',
              updatedAt: '$updatedAt',
              priority: '$priority',
              user: '$user',
              comments: '$comments',
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' },
              year: { $year: '$createdAt' }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $lookup: {
              from: 'todolabels',
              localField: 'label',
              foreignField: '_id',
              as: 'label'
            }
          },
          {
            $facet: {
              todos: [
                {
                  $project: {
                    title: '$title',
                    label: '$label',
                    isCompleted: '$isCompleted',
                    isInProgress: '$isInProgress',
                    createdAt: '$createdAt',
                    updatedAt: '$updatedAt',
                    user: '$user',
                    comments: '$comments',
                    priority: '$priority'
                  }
                },
                {
                  $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt', timezone: 'Asia/Kolkata' } },
                    list: { $push: '$$ROOT' },
                    count: { $sum: 1 }
                  }
                },
                {
                  $sort: { _id: -1 }
                }
              ],
              todosCount: [
                {
                  $group: {
                    _id: null,
                    count: { $sum: 1 }
                  }
                }
              ]
            }
          }
        ]);
      const { todos, todosCount } = response[0];
      const { count } = todosCount[0] || 0;
      return Promise.resolve({
        totalCount: count,
        data: todos
      });
    } catch (err) {
      throw err;
    }
  }

  async listTodo({ user }, params) {
    try {
      const {
        filter, first = 100, offset = 1, sort
      } = params;
      // sort object
      let sortObject = { createdAt: -1 };
      if (typeof (sort) !== 'undefined') {
        sortObject = {};
        Object.keys(sort).forEach((key) => {
          if (sort[key] === 'DESC') {
            sortObject[key] = -1;
          }
          if (sort[key] === 'ASC') {
            sortObject[key] = 1;
          }
        });
      }
      // define conditions
      let conditions = {
        user: mongoose.Types.ObjectId(user._id)
      };

      // check isCompleted
      if (!filter || (filter && !('isCompleted' in filter))) {
        conditions.$or = [
          {
            isCompleted: false,
            createdAt: {
              $lt: new Date()
            }
          },
          {
            createdAt: {
              $gte: new Date()
            }
          }
        ];
      }

      // Check & define filter conditions
      if (filter && typeof (filter) !== 'undefined') {
        if (filter.title_contains) {
          conditions.$and = conditions.$and || [];
          conditions.$and.push({ title: { $regex: filter.title_contains, $options: 'gi' } });
        }
        if (filter.labelId) {
          const customObjectId = mongoose.Types.ObjectId(filter.labelId);
          conditions = { ...conditions, label: customObjectId };
        }
        if ('isCompleted' in filter) {
          conditions = { ...conditions, isCompleted: filter.isCompleted };
        }
      }
      const response = await this.TodoModel
        .aggregate([
          {
            $match: conditions
          },
          {
            $project: {
              name: 1,
              title: '$title',
              label: '$label',
              isCompleted: '$isCompleted',
              isInProgress: '$isInProgress',
              createdAt: '$createdAt',
              updatedAt: '$updatedAt',
              scheduledDate: '$scheduledDate',
              priority: '$priority',
              user: '$user',
              comments: '$comments',
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' },
              year: { $year: '$createdAt' }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $lookup: {
              from: 'todolabels',
              localField: 'label',
              foreignField: '_id',
              as: 'label'
            }
          },
          {
            $facet: {
              todos: [
                {
                  $project: {
                    title: '$title',
                    label: '$label',
                    isCompleted: '$isCompleted',
                    isInProgress: '$isInProgress',
                    // createdAt: '$createdAt',
                    createdAt: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Kolkata' } },
                    updatedAt: '$updatedAt',
                    scheduledDate: { $dateToString: { format: '%Y-%m-%d', date: '$scheduledDate', timezone: 'Asia/Kolkata' } },
                    user: '$user',
                    comments: '$comments',
                    priority: '$priority'
                  }
                },
                {
                  $sort: sortObject
                },
                { $skip: (offset - 1) * first },
                { $limit: first }
              ],
              todosCount: [
                {
                  $group: {
                    _id: null,
                    count: { $sum: 1 }
                  }
                }
              ]
            }
          }
        ]);
      const { todos, todosCount } = response[0];
      const mapTodos = todos.map((todo) => {
        const { email } = todo.user[0];
        let label = null;
        if (todo.label && todo.label.length) {
          // eslint-disable-next-line prefer-destructuring
          label = todo.label[0];
          // title = name;
          // id = _id;
        }
        return {
          ...todo,
          user: {
            email
          },
          label: {
            ...label
          }
        };
      });
      const { count } = todosCount[0] || 0;
      return Promise.resolve({
        totalCount: count,
        data: mapTodos
      });
    } catch (err) {
      throw err;
    }
  }

  async updateTodo({ user }, params, postBody) {
    try {
      const todoId = params.id;
      postBody = {
        ...postBody,
        $currentDate: {
          updatedAt: true
        }
      };
      if (typeof postBody.isCompleted === 'boolean' && postBody.isCompleted) {
        postBody = {
          ...postBody, isInProgress: false
        };
      }
      const response = await this.TodoModel.updateOne({
        user: user._id, isDeleted: false, status: true, _id: todoId
      }, { $set: postBody });
      if (response && response.n !== 0) {
        return { message: 'Todo has been succesfully updated', ok: true };
      }
      return Promise.reject(new Error(403));
    } catch (err) {
      throw err;
    }
  }

  async deleteTodo({ user }, params) {
    try {
      const response = await this.TodoModel.deleteOne({
        user: user._id, isDeleted: false, status: true, _id: params.id
      });
      if (response && response.n !== 0) {
        return { ok: true, message: 'Todo deleted successfully' };
      }
      return Promise.reject(new Error(403));
    } catch (err) {
      throw err;
    }
  }

  async addTodoComment({ user }, params, postBody) {
    try {
      const { _id: userId } = user;
      const { todoId } = params;
      const { description } = postBody;
      const response = await this.TodoModel.updateOne({
        user: userId, isDeleted: false, _id: todoId
      }, { $push: { comments: { description } } });
      if (response && response.n !== 0) {
        return { message: 'Todo has been succesfully commented', ok: true };
      }
      return Promise.reject(new Error(403));
    } catch (err) {
      throw err;
    }
  }

  async updateTodoComment({ user }, params, postBody) {
    try {
      const { _id: userId } = user;
      const { todoId, id: commentId } = params;
      const { description } = postBody;
      const response = await this.TodoModel.updateOne({
        user: userId, isDeleted: false, _id: todoId, 'comments._id': commentId
      }, { $set: { 'comments.$.description': description } });
      if (response && response.n !== 0) {
        return { message: 'Todo has been succesfully updated', ok: true };
      }
      return Promise.reject(new Error(403));
    } catch (err) {
      throw err;
    }
  }

  async todoLabelList({ user }) {
    const { _id: userId } = user;
    const query = { user: userId };
    try {
      return await this.TodoLabelModel.find(query);
    } catch (err) {
      throw err;
    }
  }

  async addTodoLabel(context, postBody) {
    try {
      const { user } = context;
      const { _id: userId } = user;
      await this.TodoLabelModel({ ...postBody, user: userId }).save();
      return { message: 'Todo label has been succesfully added', ok: true };
    } catch (err) {
      throw err;
    }
  }

  async updateTodoLabel({ user }, params, postBody) {
    try {
      const { id: todoLabelId } = params;
      const { _id: userId } = user;
      const { name } = postBody;
      const response = await this.TodoLabelModel.updateOne({
        user: userId, _id: todoLabelId
      }, { $set: { name } });
      if (response && response.n !== 0) {
        return { message: 'TodoLabel has been succesfully updated', ok: true };
      }
      return Promise.reject(new Error(403));
    } catch (err) {
      throw err;
    }
  }

  async deleteTodoLabel({ user }, params) {
    try {
      const { id: todoLabelId } = params;
      const response = await this.TodoLabelModel.deleteOne({
        user: user._id, _id: todoLabelId
      });
      if (response && response.n !== 0) {
        return { ok: true, message: 'TodoLabel deleted successfully' };
      }
      return Promise.reject(new Error(403));
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new TodoService();
