const thoughtTypes = () => `
     
  input ThoughtFilterInputType {
    isPinned: Boolean
    isAchieved: Boolean
    q: String
  }

  input ThoughtSortInputType {
    createdAt: SortEnumType
    updatedAt: SortEnumType
    isPinned: SortEnumType
    isAchieved: SortEnumType
    accomplishTenure: SortEnumType
  }

  type ThoughtType {
    _id: String
    title: String
    description: String
    accomplishTenure: Date
    isPinned: Boolean
    isAchieved: Boolean
    createdAt: Date
  }

  input ThoughtInputType {
    title: String!
    description: String!
    accomplishTenure: Date
    isPinned: Boolean
    isAchieved: Boolean
  }

  type ThoughtListType {
    totalCount: Int
    data: [ThoughtType]
  }

  extend type Query {
    listThought (filter: ThoughtFilterInputType, sort: ThoughtSortInputType, limit: Int, offset: Int ): ThoughtListType
    thought(id: ID!): ThoughtType
  }

  extend type Mutation {
    addThought(input: ThoughtInputType!): SuccessType!
    updateThought(id: ID!, input: ThoughtInputType!): SuccessType!
    deleteThought(id: ID!): SuccessType!
  }
`;

module.exports = {
  thoughtTypes: thoughtTypes()
};
