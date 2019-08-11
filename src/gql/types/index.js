const { todoTypes } = require('./todo.types');
const { userTypes } = require('./user.types');

const typeDefs = () => `
  ${todoTypes}
  ${userTypes}
`;
module.exports = typeDefs();
