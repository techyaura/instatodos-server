const { sharedTypes } = require('./shared.types');
const { todoTypes } = require('./todo.types');
const { userTypes } = require('./user.types');
const { thoughtTypes } = require('./thought.types');

const typeDefs = () => `
  ${sharedTypes}
  ${todoTypes}
  ${userTypes}
  ${thoughtTypes}
`;
module.exports = typeDefs();
