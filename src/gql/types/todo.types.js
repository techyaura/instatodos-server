const todoTypes = () => `
  type TodoType {
      _id: String!
      title: String!
      status: Boolean!
      isDeleted: Boolean!
  }

  input TodoInputType {
    title: String!
  }

  type SuccessType {
    ok: Boolean!,
    message: String!
  }

  type Query {
    todoList: [TodoType]
    todoView(id: ID!): TodoType
  }

  type Mutation {
    addTodo(input: TodoInputType!): SuccessType!
    updateTodo(id: ID!, input: TodoInputType!): SuccessType!
    deleteTodo(id: ID!): SuccessType!
  }
`;

module.exports = {
  todoTypes: todoTypes()
};
