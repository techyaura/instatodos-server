const thoughtTypes = () => `
     
  type ThoughtType {
    title: String
    description: String
    _id: String
  }

  input ThoughtInputType {
    title: String!
    description: String
  }

  type ThoughtListType {
    totalCount: Int
    data: [ThoughtType]
  }

  extend type Query {
    listThought (first: Int, offset: Int ): ThoughtListType
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
