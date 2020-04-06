const { fileLoader, mergeTypes } = require('merge-graphql-schemas');

const typeDefs = mergeTypes(fileLoader(`${__dirname}/*.graphql`), { all: true });
module.exports = typeDefs;
