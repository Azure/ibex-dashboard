const express = require('express');
const path = require('path');
const request = require('xhr-request');
const router = new express.Router();
const crypto = require('crypto');

const paths = require('./api').paths, 
      getFileContents = require('./api').getFileContents,
      isValidFile = require('./api').isValidFile, 
      getField = require('./api').getField;

router.post('/dashboard/:id', (req, res) => {
  const { id } = req.params;
  const { privateDashboard } = paths();
  const dashboardPath = path.join(privateDashboard, id + '.private.js');
  const fileContents = getFileContents(dashboardPath);
  if (!isValidFile(dashboardPath)) {
    return res.send({ error: new Error('Failed to get dashboard') });
  }

  let docdb = getField(/("?cosmos-db"?:\s*)({.*?})/im, fileContents);
  if (docdb.startsWith("{") && docdb.endsWith("}")) {
    docdb = JSON.parse(docdb.replace(/(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9]+)(['"])?:/g, '$1"$3":'));
  }
  if (!docdb.key || !docdb.host) {
    console.error('Missing CosmosDB host/key config');
    return this.failure('CosmosDB host/key config required');
  }

  const date = new Date().toUTCString();
  const verb = req.body.verb;
  const resourceType = req.body.resourceType; //'docs';
  const resourceLink = `dbs/${req.body.databaseId}/colls/${req.body.collectionId}`; //req.body.resourceLink;
  const masterKey = docdb.key;
  const auth = getAuthorizationTokenUsingMasterKey(verb, resourceType, resourceLink, date, masterKey);

  let cosmosQuery = {
    query: req.body.query,
    parameters: req.body.parameters,
  };

  const host = docdb.host;
  const url = `https://${host}.documents.azure.com/${resourceLink}/docs`;

  request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/query+json',
      'Accept': 'application/json',
      'Authorization': auth,
      'x-ms-date': date,
      'x-ms-version': '2015-04-08',
      'x-ms-documentdb-isquery': true,
    },
    body: cosmosQuery,
    responseType: 'json',
    json: true,
  }, (err, doc) => {
    if (err) {
      console.log(err);
      return res.send({ error: err });
    }
    res.send(doc);
  });

});

function getAuthorizationTokenUsingMasterKey(verb, resourceType, resourceLink, date, masterKey) {
  var key = new Buffer(masterKey, "base64");
  var text = (verb || "").toLowerCase() + "\n" +
    (resourceType || "").toLowerCase() + "\n" +
    (resourceLink || "") + "\n" +
    date.toLowerCase() + "\n" +
    "" + "\n";
  var body = new Buffer(text, "utf8");
  var signature = crypto.createHmac("sha256", key).update(body).digest("base64");
  var MasterToken = "master";
  var TokenVersion = "1.0";
  return encodeURIComponent("type=" + MasterToken + "&ver=" + TokenVersion + "&sig=" + signature);
}

module.exports = {
  router
}