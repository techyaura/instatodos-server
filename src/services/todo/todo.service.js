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

  listTodo() {
    return this.TodoModel.find({ isDeleted: false, status: true }).populate({ path: 'user' });
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
