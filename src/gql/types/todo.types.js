
const todoTypes = () => `
  
  enum TodoPriorityEnumType {
    p1
    p2
    p3
    p4
  }

  input TodoLabelInputType {
    name: String!
  }

  type TodoLabelListType {
    name: String
    _id: String
  }

  input TodoCommentInputType {
    description: String!
  }

  input TodoInputType {
    title: String!
    isCompleted: Boolean
    isInProgress: Boolean
    priority: TodoPriorityEnumType
    label: ID
  }

  input TodoSortInputType {
    createdAt: SortEnumType
    updatedAt: SortEnumType
  }

  input TodoFilterInputType {
    isCompleted: Boolean
    title_contains: String
    label: ID
  }

  type TodoCommentType {
    description: String
    _id: String
  }

  type TodoType {
      _id: String!
      title: String!
      user: User
      priority: TodoPriorityEnumType
      isCompleted: Boolean
      isInProgress: Boolean
      createdAt: Date!
      updatedAt: Date
      comments: [TodoCommentType]
      label: TodoLabelListType
  }

  type TodoCompletedType {
    _id: String!
    list: [TodoType]
    count: Int
}

  type TodoListType {
    totalCount: Int
    data: [TodoType]
  }

  type TodoListCompletedType {
    totalCount: Int
    data: [TodoCompletedType]
  }

  type Query {
    todoCompleted: TodoListCompletedType
    todoList (filter: TodoFilterInputType, first: Int, offset: Int, sort: TodoSortInputType ): TodoListType
    todoView(id: ID!): TodoType
    todoLabelList: [TodoLabelListType]
  }

  type Mutation {
    addTodo(input: TodoInputType!): SuccessType!
    updateTodo(id: ID!, input: TodoInputType!): SuccessType!
    deleteTodo(id: ID!): SuccessType!
    addTodoComment(todoId: ID!, input: TodoCommentInputType!): SuccessType!
    updateTodoComment(id: ID!, todoId: ID!, input: TodoCommentInputType!): SuccessType!
    addTodoLabel(input: TodoLabelInputType): SuccessType!
    updateTodoLabel(id: ID!, input: TodoLabelInputType): SuccessType!
    deleteTodoLabel(id: ID!): SuccessType!
  }
`;

module.exports = {
  todoTypes: todoTypes()
};
