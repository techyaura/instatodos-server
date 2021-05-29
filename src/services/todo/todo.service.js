const mongoose = require('mongoose');
const moment = require('moment');
const { TodoModel } = require('../../models');
const CommentService = require('../todo-comment/todo-comment.service');

const timeZoneValue = 'Asia/Kolkata';

class TodoService {
  constructor() {
    this.TodoModel = TodoModel;
  }

  async addSubTodo({ user }, postBody) {
    const item = {};
    if (typeof postBody.isCompleted === 'boolean' && postBody.isCompleted) {
      item.isCompleted = true;
    }
    item.title = postBody.title;
    item.parent = postBody.todoId;
    item.user = user._id;
    const todo = this.TodoModel({ ...item });
    await todo.save();
    return { message: 'Sub Task has been succesfully added', ok: true };
  }

  async updateSubTodo({ user }, { id }, postBody) {
    const item = {};
    if (typeof postBody.isCompleted === 'boolean' && postBody.isCompleted) {
      item.isCompleted = true;
    }
    if (postBody.title) {
      item.title = postBody.title;
    }
    item.parent = postBody.todoId;
    item.user = user._id;
    const todo = await this.TodoModel.updateOne({
      user: user._id, isDeleted: false, status: true, _id: id, parent: postBody.todoId
    }, { $set: postBody });
    if (todo.nModified) {
      return { message: 'Sub Task has been succesfully updated', ok: true };
    }
    throw new Error(403);
  }

  async addTodo({ user }, postBody) {
    const todo = this.TodoModel({ ...postBody, user: user._id });
    await todo.save();
    // const response = await todo.save();
    // if (postBody.notes && postBody.notes !== 'undefined') {
    //   await CommentService.addTodoComment({ user }, { todoId: response._id }, { description: postBody.notes });
    // }
    return { message: 'Todo has been succesfully added', ok: true };
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
    const response = await this.TodoModel.updateOne({
      user: user._id, isDeleted: false, status: true, _id: id
    }, { $set: postBody });
    if (response && response.n !== 0) {
      // if (postBody.noteId) {
      //   await CommentService.updateTodoComment({ user }, { todoId: id, id: postBody.noteId }, { description: postBody.notes });
      // } else {
      //   await CommentService.addTodoComment({ user }, { todoId: id }, { description: postBody.notes });
      // }
      return { message: 'Todo has been succesfully updated', ok: true };
    }
    throw new Error(403);
  }

  viewTodo({ user }, params) {
    return this.TodoModel
      .findOne({ _id: params.id, user: user._id })
      .populate({ path: 'user' })
      .lean();
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
            }
            // ,
            // {
            //   isCompleted: true
            // }
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
          scheduledDate: null
          // $or: [
          //   { scheduledDate: null },
          //   // {
          //   //   scheduledDate: {
          //   //     $gt: new Date(moment().hours(23).minutes(59).seconds(59))
          //   //   }
          //   // },
          //   {
          //     scheduledDate: {
          //       $lte: new Date(moment().hours(0).minutes(0).seconds(0))
          //     }
          //   }
          // ]
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
    conditions = { ...conditions, isCompleted: true, $or: [{ parent: { $exists: false } }, { parent: null }] };
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
            priority: '$priority',
            subTasks: '$subTasks'
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: timeZoneValue } },
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
  }

  async upcomingTodo({ user }, {
    first = 10, offset = 1, filter = null, sort = null
  }) {
    const { conditions, sortObject, labelLookUp } = this.constructor.createFilters(user, { filter, sort });
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
        // {
        //   $unwind: {
        //     path: '$comments',
        //     preserveNullAndEmptyArrays: true
        //   }
        // },
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
            notes: '$notes',
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
            // comments: '$comments',
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
          $addFields: {
            subTasks: {
              $filter: {
                input: '$subTasks',
                cond: { $and: [{ $eq: ['$$this.isDeleted', false] }, { $eq: ['$$this.isCompleted', false] }] }
              }
            }
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
                  // comments: { $push: '$comments' },
                  user: { $first: '$user' },
                  title: { $first: '$title' },
                  notes: { $first: '$notes' },
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
      if (todo.comments && todo.comments.length) {
        todo.comments = todo.comments.map(comment => ({
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
    const response = await this.TodoModel.updateOne({
      user: user._id, _id: params.id, isDeleted: false, status: true
    }, {
      isDeleted: true, status: false
    });
    if (response && response.n !== 0) {
      return { ok: true, message: 'Todo deleted successfully' };
    }
    throw new Error(403);
  }
}

module.exports = new TodoService();
