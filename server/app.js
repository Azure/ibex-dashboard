// server/app.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const app = express();

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('/api/config.js', (req, res) => {
  fs.readFile(path.join(__dirname, 'dashboards', 'bot-framework.js'), 'utf8', (err, data) => {
    if (err) throw err;

    // Ensuing this dashboard is loaded into the dashboards array on the page
    data += `
      window.dashboards = window.dashboards || [];
      window.dashboards.push(dashboard);
    `;

    res.send(data);
  });
});

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;