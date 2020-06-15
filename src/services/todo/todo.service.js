const mongoose = require('mongoose');
const moment = require('moment');
const { label } = require('joi');
const { TodoModel, TodoLabelModel } = require('../../models');
const { CommonFunctionUtil } = require('../../utils');

class TodoService {
  constructor() {
    this.TodoModel = TodoModel;
    this.TodoLabelModel = TodoLabelModel;
  }

  async addTodo({ user }, postBody) {
    const todo = this.TodoModel({ ...postBody, user: user._id });
    try {
      const response = await todo.save();
      if (postBody.notes && postBody.notes !== 'undefined') {
        await this.addTodoComment({ user }, { todoId: response._id }, { description: postBody.notes });
      }
      return { message: 'Todo has been succesfully added', ok: true };
    } catch (err) {
      throw err;
    }
  }

  async updateTodo({ user }, { id }, postBody) {
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
    return this.TodoModel.updateOne({
      user: user._id, isDeleted: false, status: true, _id: id
    }, { $set: postBody })
      .then(async (response) => {
        if (response && response.n !== 0) {
          if (postBody.notes && postBody.noteId && postBody.notes !== 'undefined') {
            await this.updateTodoComment({ user }, { todoId: id, id: postBody.noteId }, { description: postBody.notes });
          }
          return { message: 'Todo has been succesfully updated', ok: true };
        }
        return Promise.reject(new Error(403));
      })
      .catch(err => Promise.reject(err));
  }

  async viewTodo({ user }, params) {
    try {
      return await this.TodoModel.findOne({ _id: params.id, user: user._id }).populate({ path: 'user' });
    } catch (err) {
      throw err;
    }
  }

  static createFilters(user, { filter = null, sort = null }) {
    let conditions = {
      user: mongoose.Types.ObjectId(user._id),
      status: true,
      isDeleted: false
    };
    let searchQuery = '';
    let labelLookUp = {
      from: 'todolabels',
      localField: 'labelIds',
      foreignField: '_id',
      as: 'labels'
    };
    // sort object condition
    let sortObject = { createdAt: -1 };
    if (typeof (sort) === 'object' && !!sort) {
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
    if (typeof (filter) === 'object' && !!filter) {
      // filter for title name
      if ('title_contains' in filter && filter.title_contains) {
        searchQuery = filter.title_contains;
        conditions = { ...conditions, title: { $regex: searchQuery, $options: 'gi' } };
      }
      // filter for label
      if ('labelIds' in filter && !!filter.labelId) {
        const labelIds = filter.labelId.map(labelId => mongoose.Types.ObjectId(labelId));
        conditions = { ...conditions, labelIds: { $in: labelIds } };
        if (filter.label) {
          labelLookUp = {
            from: 'todolabels',
            pipeline: [
              {
                $match: {
                  name: { $regex: searchQuery, $options: 'gi' }
                }
              }
            ],
            as: 'labels'
          };
        }
      }
      // filter for isCompleted flag
      if ('isCompleted' in filter) {
        conditions = { ...conditions, isCompleted: filter.isCompleted };
      }

      // filter for isCompleted flag
      if ('projectId' in filter) {
        conditions = { ...conditions, projectId: mongoose.Types.ObjectId(filter.projectId) };
      }
      // check tasks for today
      if ('type' in filter && filter.type === 'today') {
        conditions = {
          ...conditions,
          $or: [
            {
              isCompleted: false
            },
            {
              isCompleted: true
            }
          ],
          scheduledDate: {
            $gte: new Date(moment().hours(0).minutes(0).seconds(0)),
            $lt: new Date(moment().hours(23).minutes(59).seconds(59))
          }
        };
      }
      if ('type' in filter && filter.type === 'upcoming') {
        conditions = {
          ...conditions,
          isCompleted: false,
          scheduledDate: {
            $gte: new Date(moment().hours(23).minutes(59).seconds(59))
          }
        };
      }
      // check backlogs tasks
      if ('type' in filter && filter.type === 'backlog') {
        // TODO:// will subject to change when intriduce Next week tasks
        conditions = {
          ...conditions,
          isCompleted: false,
          $or: [
            { scheduledDate: null },
            // {
            //   scheduledDate: {
            //     $gt: new Date(moment().hours(23).minutes(59).seconds(59))
            //   }
            // },
            {
              scheduledDate: {
                $lte: new Date(moment().hours(0).minutes(0).seconds(0))
              }
            }
          ]
        };
      }
      // check pending tasks
      if ('type' in filter && filter.type === 'pending') {
        conditions = {
          ...conditions,
          isCompleted: false,
          $and: [
            {
              scheduledDate: {
                $exists: true,
                $lte: new Date(moment().hours(0).minutes(0).seconds(0))
              }
            },
            {
              scheduledDate: { $ne: null }
            }
          ]

        };
      }
    } else {
      conditions = {
        ...conditions
      };
    }
    return { conditions, sortObject, labelLookUp };
  }

  async completedTodo({ user }, {
    first = 10, offset = 1, filter = null, sort = null
  }) {
    const { conditions: conditionsObJ, sortObject, labelLookUp } = this.constructor.createFilters(user, { filter, sort });
    let conditions = conditionsObJ;
    conditions = { ...conditions, isCompleted: true };
    try {
      const response = await this.TodoModel
        .aggregate([
          {
            $match: conditions
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
            $lookup: labelLookUp
          },
          {
            $lookup: {
              from: 'projects',
              localField: 'projectId',
              foreignField: '_id',
              as: 'project'
            }
          },
          {
            $project: {
              project: { $arrayElemAt: ['$project', 0] },
              title: '$title',
              labels: '$labels',
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
            $project: {
              updatedAt: '$_id',
              list: 1,
              count: 1
            }
          },
          {
            $facet: {
              todos: [
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
      const { count } = todosCount[0] || 0;
      return Promise.resolve({
        totalCount: count,
        data: todos
      });
    } catch (err) {
      throw err;
    }
  }

  async upcomingTodo({ user }, {
    first = 10, offset = 1, filter = null, sort = null
  }) {
    const { conditions, sortObject, labelLookUp } = this.constructor.createFilters(user, { filter, sort });
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
              labels: '$labels',
              isCompleted: '$isCompleted',
              isInProgress: '$isInProgress',
              createdAt: '$createdAt',
              scheduledDate: '$scheduledDate',
              updatedAt: '$updatedAt',
              priority: '$priority',
              user: '$user',
              comments: '$comments'
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
              from: 'projects',
              localField: 'projectId',
              foreignField: '_id',
              as: 'project'
            }
          },
          {
            $lookup: labelLookUp
          },
          {
            $project: {
              title: '$title',
              project: { $arrayElemAt: ['$project', 0] },
              projectId: 1,
              labels: '$labels',
              isCompleted: '$isCompleted',
              isInProgress: '$isInProgress',
              createdAt: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              updatedAt: '$updatedAt',
              scheduledDate: { $dateToString: { format: '%Y-%m-%d', date: '$scheduledDate' } },
              user: '$user',
              comments: '$comments',
              priority: '$priority'
            }
          },

          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$scheduledDate', timezone: 'Asia/Kolkata' } },
              list: { $push: '$$ROOT' },
              count: { $sum: 1 }
            }
          },
          {
            $project: {
              scheduledDate: '$_id',
              list: 1,
              count: 1
            }
          },
          {
            $facet: {
              todos: [
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
      const { count } = todosCount[0] || 0;
      return Promise.resolve({
        totalCount: count,
        data: todos
      });
    } catch (err) {
      throw err;
    }
  }

  async listTodo({ user }, {
    first = 10, offset = 1, filter = null, sort = null
  }) {
    const { conditions, sortObject, labelLookUp } = this.constructor.createFilters(user, { filter, sort });
    const response = await this.TodoModel
      .aggregate([
        {
          $match: conditions
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
            from: 'projects',
            localField: 'projectId',
            foreignField: '_id',
            as: 'project'
          }
        },
        {
          $lookup: labelLookUp
        },
        {
          $unwind: {
            path: '$comments',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'comments.userId',
            foreignField: '_id',
            as: 'comments.userId'
          }
        },
        {
          $project: {
            title: '$title',
            project: { $arrayElemAt: ['$project', 0] },
            projectId: 1,
            labels: '$labels',
            isCompleted: '$isCompleted',
            isInProgress: '$isInProgress',
            // createdAt: '$createdAt',
            createdAt: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            updatedAt: '$updatedAt',
            scheduledDate: { $dateToString: { format: '%Y-%m-%d', date: '$scheduledDate' } },
            user: '$user',
            comments: '$comments',
            priority: '$priority',
            parent: '$parent'
          }
        },
        {
          $graphLookup: {
            from: 'todos',
            startWith: '$_id',
            connectFromField: 'parent',
            connectToField: 'parent',
            as: 'subTasks',
            maxDepth: 1
          }
        },
        {
          $match: { $or: [{ parent: null }, { parent: { $exists: false } }] }
        },
        {
          $facet: {
            todos: [
              {
                $group: {
                  _id: '$_id',
                  project: { $first: '$project' },
                  projectId: { $first: '$projectId' },
                  notes: { $push: '$comments' },
                  user: { $first: '$user' },
                  title: { $first: '$title' },
                  labels: { $first: '$labels' },
                  isCompleted: { $first: '$isCompleted' },
                  isInProgress: { $first: '$isInProgress' },
                  createdAt: { $first: '$createdAt' },
                  updatedAt: { $first: '$updatedAt' },
                  scheduledDate: { $first: '$scheduledDate' },
                  priority: { $first: '$priority' },
                  subTasks: { $first: '$subTasks' }
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
      if (todo.notes && todo.notes.length) {
        todo.notes = todo.notes.map(comment => ({
          _id: comment._id,
          description: comment.description,
          userId: (Array.isArray(comment.userId) && comment.userId.length) ? comment.userId[0] : null
        }));
      }
      return {
        ...todo,
        user: {
          email
        }
      };
    });
    const { count } = todosCount[0] || 0;
    return Promise.resolve({
      totalCount: count,
      data: mapTodos
    });
  }

  async deleteTodo({ user }, params) {
    try {
      const response = await this.TodoModel.updateOne({
        user: user._id, _id: params.id, isDeleted: false, status: true
      }, {
        isDeleted: true, status: false
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
      }, { $push: { comments: { description, userId } } });
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
      const { name } = postBody;
      const isExist = await this.checkUniqueLabel(name, user);
      if (isExist) {
        throw new Error('Label Should be unique');
      }
      await this.TodoLabelModel({ ...postBody, user: userId, slug: CommonFunctionUtil.slugify(name) }).save();
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
      const isExist = await this.checkUniqueLabel(name, user);
      if (isExist) {
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
      return Promise.reject(new Error(403));
    } catch (err) {
      throw err;
    }
  }

  async checkUniqueLabel(label, user) {
    try {
      return await this.TodoLabelModel.findOne({ name: label, user: user._id }).then(data => (!!(data)));
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

  async todoLabelListCount({ user }) {
    try {
      return await this.TodoLabelModel
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
    } catch (err) {
      throw err;
    }
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
    await this.TodoLabelModel.create(mappedArray);
  }
}

module.exports = new TodoService();
