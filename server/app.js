// server/app.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

function getFiles(dir, files_) {
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files){
    var name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()){
      getFiles(name, files_);
    } else {
      files_.push(name);
    }
  }
  return files_;
}

app.get('/api/dashboard.js', (req, res) => {

  let privateDashboard = path.join(__dirname, 'dashboards', 'dashboard.private.js');
  let preconfDashboard = path.join(__dirname, 'dashboards', 'preconfigured', 'bot-framework.js');
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

app.post('/api/dashboard.js', (req, res) => {
  var content = (req.body && req.body.script) || '';
  console.dir(content);

  fs.writeFile(path.join(__dirname, 'dashboards', 'dashboard.private.js'), content, err => {
    if (err) {
      console.error(err);
      return res.end(err);
    }

    res.end(content);
  })
});

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;