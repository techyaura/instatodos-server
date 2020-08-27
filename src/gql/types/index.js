const { mergeTypeDefs } = require('@graphql-tools/merge');
const { loadFilesSync } = require('@graphql-tools/load-files');

const typeDefs = mergeTypeDefs(loadFilesSync(`${__dirname}/*.graphql`), { all: true });
module.exports = typeDefs;
