import env_properties from '../../config.json';

export const SERVICES = {
  host: "https://myservice-host.net/",

  sampleRestCall: function(cb){
    $.get("{0}/test".format(this.host), cb.success)
    .fail(cb.failure);
  },

  getUserAuthenticationInfo(){
   ///Make sure the AAD client id is setup in the config
   let userProfile = window.userProfile;

    if(userProfile && userProfile.given_name)
       return userProfile;

    if(!env_properties.AAD_AUTH_CLIENTID || env_properties.AAD_AUTH_CLIENTID === ''){
      console.log('AAD Auth Client ID config is not setup in Azure for this instance');
      return {};
    }

    console.log('AD ID: ' + env_properties.AAD_AUTH_CLIENTID);

    window.config = {
      instance: 'https://login.microsoftonline.com/',
      tenant: 'microsoft.com',
      clientId: env_properties.AAD_AUTH_CLIENTID,
      postLogoutRedirectUri: 'http://www.microsoft.com',
      cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
    };

    let authContext = new AuthenticationContext(config);

    var isCallback = authContext.isCallback(window.location.hash);
    authContext.handleWindowCallback();

    if (isCallback && !authContext.getLoginError()) {
        window.location = authContext._getItem(authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);
    }
    // Check Login Status, Update UI
    var user = authContext.getCachedUser();
    if (user) {
        let sessionId = guid();
        // We are logged in. We're is good!
        window.userProfile = {
          unique_name: user.profile.upn,
          family_name: user.profile.family_name,
          given_name: user.profile.given_name,
          sessionId: sessionId
        };

        appInsights.trackEvent("login", {profileId: window.userProfile.unique_name});

        return window.userProfile;
    } else {
        // We are not logged in.  Try to login.
        authContext.login();
    }
  }
}
