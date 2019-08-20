const todoTypes = () => `
  
  scalar Date

  input TodoFilterType {
    title_contains: String
  }

  type User {
    email: String!
  }

  enum TodoSortEnumType {
    ASC
    DESC
  }

  input TodoSortType {
    createdAt: TodoSortEnumType
    updatedAt: TodoSortEnumType
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
    totalCount: Int
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
    todoList (filter: TodoFilterType, first: Int, offset: Int, sort: TodoSortType ): TodoListType
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
