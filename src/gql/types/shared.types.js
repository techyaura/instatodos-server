const sharedTypes = () => `
  
  scalar Date
 
  type User {
    email: String!
  }

  type SuccessType {
    ok: Boolean!,
    message: String!
  }
`;

module.exports = {
  sharedTypes: sharedTypes()
};
