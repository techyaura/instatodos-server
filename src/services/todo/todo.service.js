const mongoose = require('mongoose');
const { TodoModel } = require('../../models');
const { TodoLabelModel } = require('../../models');

class TodoService {
  constructor() {
    this.TodoModel = TodoModel;
    this.TodoLabelModel = TodoLabelModel;
  }

  addTodo(postBody) {
    const todo = this.TodoModel(postBody);
    return todo.save()
      .then(() => ({ message: 'Todo has been succesfully added', ok: true }))
      .catch((err) => {
        throw err;
      });
  }

  viewTodo(params) {
    return this.TodoModel.findOne({ _id: params.id }).populate({ path: 'user' });
  }

  completedTodo({ context, args: params }) {
    const { user } = context;
    const conditions = {
      user: mongoose.Types.ObjectId(user._id),
      isCompleted: true
    };
    return this.TodoModel
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
      ])
      .then((response) => {
        const { todos, todosCount } = response[0];
        // const mapTodos = (todos.list).map((todo) => {
        //   const { email } = todo.user[0];
        //   let title = null;
        //   if (todo.label && todo.label.length) {
        //     const { name } = todo.label[0];
        //     title = name;
        //   }
        //   return {
        //     ...todo,
        //     user: {
        //       email
        //     },
        //     label: {
        //       name: title
        //     }
        //   };
        // });
        const { count } = todosCount[0] || 0;
        return Promise.resolve({
          totalCount: count,
          data: todos
        });
      })
      .catch(err => Promise.reject(err));
  }

  listTodo({ context, args: params }) {
    const { user } = context;
    const {
      filter, first = 100, offset = 1, sort
    } = params;
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
    let conditions = {
      user: mongoose.Types.ObjectId(user._id)
    };

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

    if (filter && typeof (filter) !== 'undefined') {
      if (filter.title_contains) {
        conditions.$and = conditions.$and || [];
        conditions.$and.push({ title: { $regex: filter.title_contains, $options: 'gi' } });
      }
      if (filter.label) {
        const customObjectId = mongoose.Types.ObjectId(filter.label);
        conditions = { ...conditions, label: customObjectId };
      }
      if ('isCompleted' in filter) {
        conditions = { ...conditions, isCompleted: filter.isCompleted };
      }
    }
    return this.TodoModel
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
      ])
      .then((response) => {
        const { todos, todosCount } = response[0];
        const mapTodos = todos.map((todo) => {
          const { email } = todo.user[0];
          let title = null;
          if (todo.label && todo.label.length) {
            const { name } = todo.label[0];
            title = name;
          }
          return {
            ...todo,
            user: {
              email
            },
            label: {
              name: title
            }
          };
        });
        const { count } = todosCount[0] || 0;
        return Promise.resolve({
          totalCount: count,
          data: mapTodos
        });
      })
      .catch(err => Promise.reject(err));
  }

  updateTodo(user, todoId, postBody) {
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
      user: user._id, isDeleted: false, status: true, _id: todoId
    }, { $set: postBody })
      .then((response) => {
        if (response && response.n !== 0) {
          return { message: 'Todo has been succesfully updated', ok: true };
        }
        return Promise.reject(new Error(403));
      })
      .catch(err => Promise.reject(err));
  }

  deleteTodo(user, params) {
    return this.TodoModel.deleteOne({
      user: user._id, isDeleted: false, status: true, _id: params.id
    })
      .then((response) => {
        if (response && response.n !== 0) {
          return { ok: true, message: 'Todo deleted successfully' };
        }
        return Promise.reject(new Error(403));
      })
      .catch(err => Promise.reject(err));
  }

  addTodoComment(context, params, body) {
    const { user } = context;
    const { _id: userId } = user;
    const { todoId } = params;
    const { description } = body;
    return this.TodoModel.updateOne({
      user: userId, isDeleted: false, _id: todoId
    }, { $push: { comments: { description } } })
      .then((response) => {
        if (response && response.n !== 0) {
          return { message: 'Todo has been succesfully commented', ok: true };
        }
        return Promise.reject(new Error(403));
      })
      .catch(err => Promise.reject(err));
  }

  updateTodoComment(context, params, body) {
    const { user } = context;
    const { _id: userId } = user;
    const { todoId, commentId } = params;
    const { description } = body;
    return this.TodoModel.updateOne({
      user: userId, isDeleted: false, _id: todoId, 'comments._id': commentId
    }, { $set: { 'comments.$.description': description } })
      .then((response) => {
        if (response && response.n !== 0) {
          return { message: 'Todo has been succesfully updated', ok: true };
        }
        return Promise.reject(new Error(403));
      })
      .catch(err => Promise.reject(err));
  }

  todoLabelList(context) {
    const { user } = context;
    const { _id: userId } = user;
    return this.TodoLabelModel.find({ user: userId })
      .then(response => Promise.resolve(response))
      .catch(err => Promise.reject(err));
  }

  addTodoLabel(context, body) {
    const { user } = context;
    const { _id: userId } = user;
    return this.TodoLabelModel({ ...body, user: userId }).save()
      .then(() => ({ message: 'Todo label has been succesfully added', ok: true }))
      .catch(err => Promise.reject(err));
  }

  updateTodoLabel({ user }, { todoLabelId }, body) {
    const { _id: userId } = user;
    const { name } = body;
    return this.TodoLabelModel.updateOne({
      user: userId, _id: todoLabelId
    }, { $set: { name } })
      .then((response) => {
        if (response && response.n !== 0) {
          return { message: 'TodoLabel has been succesfully updated', ok: true };
        }
        return Promise.reject(new Error(403));
      })
      .catch(err => Promise.reject(err));
  }

  deleteTodoLabel({ user }, { todoLabelId }) {
    return this.TodoLabelModel.deleteOne({
      user: user._id, _id: todoLabelId
    })
      .then((response) => {
        if (response && response.n !== 0) {
          return { ok: true, message: 'TodoLabel deleted successfully' };
        }
        return Promise.reject(new Error(403));
      })
      .catch(err => Promise.reject(err));
  }
}

module.exports = new TodoService();
