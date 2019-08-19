const todoTypes = () => `
  
  scalar Date

  type User {
    email: String!
  }

  enum sortType {
    ASC
    DESC
  }

  input TodoSortType {
    createdAt: sortType
    updatedAt: sortType
  }

  type TodoType {
      _id: String!
      title: String!
      user: User
      isCompleted: Boolean!
      isDeleted: Boolean!
      createdAt: Date!
      updatedAt: Date!
  }

  type TodoListType {
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
    todoList (first: Int, offset: Int, sort: TodoSortType ): TodoListType
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
