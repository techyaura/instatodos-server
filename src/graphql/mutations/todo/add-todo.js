const {
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const { TodoModel } = require('../../../models');

const toDoSuccessType = require('../../types/todo/success');

module.exports = {
  type: toDoSuccessType,
  args: {
    title: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve: (root, args, context, info) => {
    if (typeof (context.user) === 'undefined') {
      return {
        message: 'Not Authorized',
        ok: false
      };
    }
    const todo = new TodoModel(args);
    return todo.save()
      .then(() => ({ message: 'Todo has been succesfully added', ok: true }))
      .catch(err => err);
  }
};
