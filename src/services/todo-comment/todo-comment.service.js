const { TodoModel } = require('../../models');

class TodoCommentService {
  constructor() {
    this.TodoModel = TodoModel;
  }

  async addTodoComment({ user }, params, postBody) {
    const { _id: userId } = user;
    const { todoId } = params;
    const { description } = postBody;
    const response = await this.TodoModel.updateOne({
      user: userId, isDeleted: false, _id: todoId
    }, { $push: { comments: { description, userId } } });
    if (response && response.n !== 0) {
      return { message: 'Todo has been succesfully commented', ok: true };
    }
    throw new Error(403);
  }

  async updateTodoComment({ user }, params, postBody) {
    const { _id: userId } = user;
    const { todoId, id: commentId } = params;
    const { description } = postBody;
    const response = await this.TodoModel.updateOne({
      user: userId, isDeleted: false, _id: todoId, 'comments._id': commentId
    }, { $set: { 'comments.$.description': description } });
    if (response && response.n !== 0) {
      return { message: 'Todo has been succesfully updated', ok: true };
    }
    throw new Error(403);
  }
}

module.exports = new TodoCommentService();
