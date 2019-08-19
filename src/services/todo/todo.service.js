const { TodoModel } = require('../../models');

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

  listTodo({ args: params }) {
    const { first = 10, offset = 1, sort } = params;
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

    return this.TodoModel
      .aggregate([
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
                  createdAt: '$createdAt',
                  updatedAt: '$updatedAt',
                  user: '$user'
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
        const { count } = todosCount[0];
        return Promise.resolve({
          totalCount: count,
          data: mapTodos
        });
      })
      .catch(err => Promise.reject(err));
  }

  updateTodo(user, todoId, postBody) {
    return this.TodoModel.updateOne({
      user: user._id, isDeleted: false, status: true, _id: todoId
    }, { $set: postBody })
      .then((response) => {
        if (response && response.n !== 0) {
          return Promise.resolve(response);
        }
        return Promise.reject(new Error('You are not authorized to update'));
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
        return Promise.reject(new Error('You are not authorized to delete'));
      })
      .catch(err => Promise.reject(err));
  }
}

module.exports = new TodoService();
