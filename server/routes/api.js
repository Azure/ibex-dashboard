const fs = require('fs');
const path = require('path');
const express = require('express');

const router = new express.Router();

router.get('/dashboard.js', (req, res) => {

  let privateDashboard = path.join(__dirname, '..', 'dashboards', 'dashboard.private.js');
  let preconfDashboard = path.join(__dirname, '..', 'dashboards', 'preconfigured', 'bot-framework.js');
  let dashboardPath = fs.existsSync(privateDashboard) ? privateDashboard : preconfDashboard;

  fs.readFile(dashboardPath, 'utf8', (err, data) => {
    if (err) throw err;

    // Ensuing this dashboard is loaded into the dashboards array on the page
    let script = `
      (function (window) {
        var dashboard = (function () {
          ${data}
        })();
        window.dashboards = window.dashboards || [];
        window.dashboards.push(dashboard);
      })(window);
    `;

    res.send(script);
  });
});

router.post('/dashboard.js', (req, res) => {
  var content = (req.body && req.body.script) || '';
  console.dir(content);

  fs.writeFile(path.join(__dirname, '..', 'dashboards', 'dashboard.private.js'), content, err => {
    if (err) {
      console.error(err);
      return res.end(err);
    }

    res.end(content);
  })
});

router.get('/setup', (req, res) => {

  let privateSetup = path.join(__dirname, '..', 'config', 'setup.private.json');
  let initialSetup = path.join(__dirname, '..', 'config', 'setup.initial.json');
  let configPath = fs.existsSync(privateSetup) ? privateSetup : initialSetup;

  fs.readFile(configPath, 'utf8', (err, json) => {
    if (err) { throw err; }

    res.send(json);
  });
});

router.post('/setup', (req, res) => {
  var content = (req.body && req.body.json) || '';
  console.dir(content);

  fs.writeFile(path.join(__dirname, '..', 'config', 'setup.private.json'), content, err => {
    if (err) {
      console.error(err);
      return res.end(err);
    }

    res.end(content);
  })
});

module.exports = {
  router
}