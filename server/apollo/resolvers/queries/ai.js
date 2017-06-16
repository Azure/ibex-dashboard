const request = require('xhr-request');

const aiQuery = (root, { query, appId, apiKey }) => {
  return new Promise((resolve, reject) => {
    request('http://localhost:4000/applicationinsights/query', {
      method: 'POST',
      json: true,
      body: { query, appId, apiKey },
    }, (err, result) => {
      if (err) reject(err);
      else resolve({ body: JSON.stringify(result, null, 2) });
    })
  });
};

module.exports = {
  aiQuery,
};