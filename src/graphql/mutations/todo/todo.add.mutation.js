const {
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const { TodoService } = require('../../../services');

const { successType } = require('../../types');

const { addTodoValidator } = require('../../../validators');

module.exports = {
  type: successType,
  args: {
    title: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve: (root, args, context) => {
    const { res, next, user } = context;
    if (typeof (user) === 'undefined') {
      return {
        message: 'Not Authorized',
        ok: false
      };
    }

    return addTodoValidator(args).then(() => TodoService.addTodo(args))
      .then(() => ({ message: 'Todo has been succesfully added', ok: true }))
      .catch(err => next(err));
  }
};
