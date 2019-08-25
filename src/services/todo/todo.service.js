const { TodoModel } = require('../../models');
const { CommonFunctionUtil } = require('../../utils');

class TodoService {
  constructor() {
    this.TodoModel = TodoModel;
  }

  addTodo(postBody) {
    const todo = this.TodoModel(postBody);
    return todo.save();
  }

  viewTodo(params) {
    return this.TodoModel.findOne({ _id: params.id }).populate({ path: 'user' });
  }

  listTodo({ context, args: params }) {
    const { user } = context;
    const {
      filter, first = 50, offset = 1, sort
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
    const conditions = {
      isDeleted: false,
      user: user._id
    };

    if (typeof (filter) !== 'undefined') {
      conditions.$or = [];
      if (filter.title_contains) {
        conditions.$or.push({ title: { $regex: filter.title_contains, $options: 'gi' } });
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
            isCompleted: '$isCompleted',
            isInProgress: '$isInProgress',
            createdAt: '$createdAt',
            updatedAt: '$updatedAt',
            user: '$user',
            comments: '$comments',
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
            year: { $year: '$createdAt' }
          }
        },
        {
          $match: {
            month: CommonFunctionUtil.getDateInfo('m'),
            day: CommonFunctionUtil.getDateInfo('d'),
            year: CommonFunctionUtil.getDateInfo('y')
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
          $facet: {
            todos: [
              {
                $project: {
                  title: '$title',
                  isCompleted: '$isCompleted',
                  isInProgress: '$isInProgress',
                  createdAt: '$createdAt',
                  updatedAt: '$updatedAt',
                  user: '$user',
                  comments: '$comments'
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
          return Promise.resolve(response);
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
          return Promise.resolve(response);
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
          return Promise.resolve(response);
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
          return Promise.resolve(response);
        }
        return Promise.reject(new Error(403));
      })
      .catch(err => Promise.reject(err));
  }
}

module.exports = new TodoService();
