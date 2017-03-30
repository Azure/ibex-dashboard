
const fs = require('fs');
const path = require('path');
const express = require('express');
const expressSession = require('express-session');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const passportAzureAD = require('passport-azure-ad');

const OIDCStrategy = passportAzureAD.OIDCStrategy;

let config = null;
let authEnabled = false;

if (fs.existsSync(path.join(__dirname, 'config.private.js'))) {
  config = require('./config.private');
  authEnabled = true;
}

// array to hold logged in users
var users = [];
var findByEmail = function(email, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
  console.info('we are using user: ', user);
    if (user.email === email) {
      return fn(null, user);
    }
  }
  return fn(null, null);
};

if (authEnabled) {
  // Passport session setup. (Section 2)

  //   To support persistent login sessions, Passport needs to be able to
  //   serialize users into and deserialize users out of the session.  Typically,
  //   this will be as simple as storing the user ID when serializing, and finding
  //   the user by ID when deserializing.
  passport.serializeUser(function(user, done) {
    done(null, user.email);
  });

  passport.deserializeUser(function(id, done) {
    findByEmail(id, function (err, user) {
      done(err, user);
    });
  });

  // Use the OIDCStrategy within Passport. (Section 2) 
  // 
  //   Strategies in passport require a `validate` function, which accept
  //   credentials (in this case, an OpenID identifier), and invoke a callback
  //   with a user object.
  passport.use(new OIDCStrategy({
      redirectUrl: config.creds.redirectUrl,
      allowHttpForRedirectUrl: config.creds.allowHttpForRedirectUrl,
      realm: config.creds.realm,
      clientID: config.creds.clientID,
      clientSecret: config.creds.clientSecret,
      oidcIssuer: config.creds.issuer,
      identityMetadata: config.creds.identityMetadata,
      skipUserProfile: config.creds.skipUserProfile,
      responseType: config.creds.responseType,
      responseMode: config.creds.responseMode,
      validateIssuer: config.creds.validateIssuer
    },
    function(iss, sub, profile, accessToken, refreshToken, done) {

      profile.email = profile.email || profile.upn;

      if (!profile.email) {
        return done(new Error("No email found"), null);
      }
      // asynchronous verification, for effect...
      process.nextTick(function () {
        findByEmail(profile.email, function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            // "Auto-registration"
            users.push(profile);
            return done(null, profile);
          }
          return done(null, user);
        });
      });
    }
  ));
}

const app = express();

app.use(cookieParser());
app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: false }));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended : true }));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
if (authEnabled) {
  app.use(passport.initialize());
  app.use(passport.session());
}

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(exclude('/auth/', ensureAuthenticated));
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


// Authentications Routes

// app.get('/account', ensureAuthenticated, function(req, res){
//   res.render('account', { user: req.user });
// });

app.get('/auth/login',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
  function(req, res) {
    console.info('Login was called in the Sample');
    res.redirect('/');
});

// POST /auth/openid
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in OpenID authentication will involve redirecting
//   the user to their OpenID provider.  After authenticating, the OpenID
//   provider will redirect the user back to this application at
//   /auth/openid/return
app.get('/auth/openid',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
  function(req, res) {
    console.info('Authentication was called in the Sample');
    res.redirect('/');
  });

// GET /auth/openid/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/openid/return',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
  function(req, res) {
    console.info('We received a return from AzureAD.');
    res.redirect('/');
  });

// GET /auth/openid/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.post('/auth/openid/return',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
  function(req, res) {
    console.info('We received a return from AzureAD.');
    res.redirect('/');
  });

app.get('/auth/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


// Always return the main index.html, so react-router render the route in the client
app.get('*', ensureAuthenticated, (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;

// Simple route middleware to ensure user is authenticated. (Section 4)

//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (!authEnabled || req.isAuthenticated()) { return next(); }
  res.redirect('/auth/login')
}

function exclude(paths, middleware) {
  return function(req, res, next) {

    // Exclude single string path
    if (typeof paths === 'string') {
      if (req.path.startsWith(paths)) { return next(); }
    }

    // Exclude a string from an array
    if (Array.isArray(paths)) {
      for (let path in paths) {
        if (req.path.startsWith(path)) { return next(); }
      }
    }

    return middleware(req, res, next);    
  };
};