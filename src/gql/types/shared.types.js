const sharedTypes = () => `
  
  scalar Date
 
  type User {
    email: String!
  }

  type SuccessType {
    ok: Boolean!,
    message: String!
  }

  enum SortEnumType {
    ASC
    DESC
  }

`;

module.exports = {
  sharedTypes: sharedTypes()
};
