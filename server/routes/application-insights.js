const express = require('express');
const request = require('xhr-request');
const router = new express.Router();

const host = 'api.applicationinsights.io';

router.post('/:appId/query', (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const { appId } = req.params;
  const { query } = req.body;
  const queryTimespan = req.query['timespan'];

  if (!apiKey || !appId) {
    return res.send({ error: 'Invalid request parameters' });
  }

  let url = `https://${host}/beta/apps/${appId}/query`;
  if (queryTimespan) url += `?timespan=${queryTimespan}`;

  request(url, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
    },
    body: {
      query,
    },
    json: true,
  }, (err, result) => {
    if (err) {
      console.log(err);
      return res.send({ error: err });
    }
    res.send(result);
  });

});

module.exports = {
  router,
};