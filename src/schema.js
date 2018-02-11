/* eslint-disable comma-dangle */
const { makeExecutableSchema } = require('graphql-tools');
const { neo4jgraphql } = require('neo4j-graphql-js'); // eslint-disable-line no-unused-vars
/* eslint-enable comma-dangle */

// WARNING: linting can't help with types here
const typeDefs = '';

const resolvers = {
  // root entry point to GraphQL service
  Query: {},
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema;
