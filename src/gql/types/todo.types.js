const todoTypes = () => `
  type User {
    email: String!
  }

  type TodoType {
      _id: String!
      title: String!
      user: User
      isCompleted: Boolean!
      isDeleted: Boolean!
  }

  type TodoListDataType {
    totalCount: Int!
    data: [TodoType]
  }

  input TodoInputType {
    title: String!
    isCompleted: Boolean
  }

  type SuccessType {
    ok: Boolean!,
    message: String!
  }

  type Query {
    todoList (first: Int, offset: Int ): TodoListDataType
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
