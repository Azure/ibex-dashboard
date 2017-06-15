const { aiQuery } = require('./queries/ai');

const resolvers = {
  Query: {
    AI: aiQuery,
  },
};

module.exports = {
  resolvers,
};