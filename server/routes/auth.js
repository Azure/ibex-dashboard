
const fs = require('fs');
const path = require('path');
const express = require('express');
const passport = require('passport');
const passportAzureAD = require('passport-azure-ad');

const OIDCStrategy = passportAzureAD.OIDCStrategy;

let config = null;
let authEnabled = false;
let redirectPath = null;

if (fs.existsSync(path.join(__dirname, '..', 'config.private.js'))) {
  config = require('../config.private');
  authEnabled = true;
}

// array to hold logged in users
var users = [];
function findByEmail(email, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
  console.info('we are using user: ', user);
    if (user.email === email) {
      return fn(null, user);
    }
  }
  return fn(null, null);
};

/** 
 * Initialize passport variable once authentication is enabled
*/
function initializePassport() {
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

  if (!config) {
    config = require('../config.private');
  }

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
if (authEnabled) { initializePassport(); }

const router = new express.Router();

/** 
 * A path to enable initializing authentication configuration and add 
 * authentication to middleware pipeline
*/
router.get('/init', function (req, res) {
  if (!authEnabled) {
    initializePassport();
    addAuthRoutes();
    authEnabled = true;
    res.redirect('/');
  }
});

/** 
 * Dynamically adding authentication routes once passport is initialized
*/
function addAuthRoutes() {
  // Authentications Routes

  // app.get('/account', ensureAuthenticated, function(req, res){
  //   res.render('account', { user: req.user });
  // });

  router.get('/login',
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
  router.get('/openid',
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
  router.get('/openid/return',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
    function(req, res) {
      console.info('We received a return from AzureAD.');
      res.redirect(redirectPath || '/');
      redirectPath = null;
    });

  // GET /auth/openid/return
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function function will be called,
  //   which, in this example, will redirect the user to the home page.
  router.post('/openid/return',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
    function(req, res) {
      console.info('We received a return from AzureAD.');
      res.redirect(redirectPath || '/');
      redirectPath = null;
    });

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
}
if (authEnabled) { addAuthRoutes(); }

/** 
 * Adding all authentication middleware on process start.
 * Some of the middlewares will only be activated once authentication is enabled.
 * Including:
 *  Initialize passport variables
 *  call passport initalize in middleware
 *  call passport session in middleware
 *  call request authenticator
*/
let authenticationMiddleware = function (...excludePaths) {

  let passportInitialize = null;
  let passportSession = null;
  function basicAuthCheck (req, res, next) {

    if (!authEnabled) { return next(); }

    // Only initialize passport middleware once authentication is enabled (passport is set)
    // And middleware hasn't been initialized yet
    if (authEnabled && passport && !passportSession) {
      passportInitialize = passport.initialize();
      passportSession = passport.session();
    }

    return next();
  };

  // Call passport initialize middleware only when it is available
  function callPassportInitialize(req, res, next) {
    if (!passportInitialize) { return next(); }

    return passportInitialize.call(passportInitialize, req, res, next);
  }

  // Call passport session middleware only when it is available
  function callPassportSession(req, res, next) {
    if (!passportSession) { return next(); }

    return passportSession.call(passportSession, req, res, next);
  }

  // Once authentication is enabled, ensure it is activated on all requests not under '/auth'
  function ensureAuthenticated(req, res, next) {
    if (!authEnabled || req.isAuthenticated()) { return next(); }
    redirectPath = req.path;
    res.redirect('/auth/login');
  }
  
  // Returning an array of all middlewares to be called sequentially
  return [
    basicAuthCheck,
    callPassportInitialize,
    callPassportSession,
    exclude(excludePaths, ensureAuthenticated)
  ]
};

function exclude(paths, middleware) {
  return function(req, res, next) {

    // Exclude a string from an array
    if (Array.isArray(paths)) {
      for (let pathIdx in paths) {
        if (req.path.startsWith(paths[pathIdx])) { return next(); }
      }
    }

    return middleware(req, res, next);    
  };
};

module.exports = {

  // Returning a middleware array
  authenticationMiddleware,
  router
}