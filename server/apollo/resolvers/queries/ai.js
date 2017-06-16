const aiQuery = (root, { query, appId, apiKey }) => {
  return { body: `This is your AI query: ${query} ${appId} ${apiKey}` };
};

module.exports = {
  aiQuery,
};