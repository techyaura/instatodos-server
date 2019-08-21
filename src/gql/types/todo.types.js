const todoTypes = () => `
  
  scalar Date

  type User {
    email: String!
  }

  enum TodoSortEnumType {
    ASC
    DESC
  }

  input TodoCommentInputType {
    description: String!
  }

  input TodoInputType {
    title: String!
    isCompleted: Boolean
  }

  input TodoSortInputType {
    createdAt: TodoSortEnumType
    updatedAt: TodoSortEnumType
  }

  input TodoFilterInputType {
    title_contains: String
  }

  type TodoCommentType {
    description: String
    _id: String
  }

  type TodoType {
      _id: String!
      title: String!
      user: User
      isCompleted: Boolean!
      isDeleted: Boolean!
      createdAt: Date!
      updatedAt: Date!
      comments: [TodoCommentType]
  }

  type TodoListType {
    totalCount: Int
    data: [TodoType]
  }

  type SuccessType {
    ok: Boolean!,
    message: String!
  }

  type Query {
    todoList (filter: TodoFilterInputType, first: Int, offset: Int, sort: TodoSortInputType ): TodoListType
    todoView(id: ID!): TodoType
  }

  type Mutation {
    addTodo(input: TodoInputType!): SuccessType!
    updateTodo(id: ID!, input: TodoInputType!): SuccessType!
    deleteTodo(id: ID!): SuccessType!
    addTodoComment(todoId: ID!, input: TodoCommentInputType!): SuccessType!
    updateTodoComment(id: ID!, todoId: ID!, input: TodoCommentInputType!): SuccessType!
  }
`;

module.exports = {
  todoTypes: todoTypes()
};
