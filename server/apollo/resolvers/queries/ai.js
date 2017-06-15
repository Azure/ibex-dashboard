const aiQuery = (root, { query, }) => {
  return { body: `This is your AI query: ${query}` };
};

module.exports = {
  aiQuery,
};