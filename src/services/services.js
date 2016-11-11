import Rx from 'rx';
import 'rx-dom';
import {Actions} from '../actions/Actions';
import {guid, momentToggleFormats, getEnvPropValue, momentGetFromToRange} from '../utils/Utils.js';
import request from 'request';

const LAYER_TYPE_FILTER = "associations";
const blobHostnamePattern = "https://{0}.blob.core.windows.net";

const MAX_ZOOM = 15;

export const SERVICES = {
  getUserAuthenticationInfo(){
   ///Make sure the AAD client id is setup in the config
   let userProfile = window.userProfile;

    if(userProfile && userProfile.given_name)
       return userProfile;

    if(!process.env.REACT_APP_AAD_AUTH_CLIENTID || process.env.REACT_APP_AAD_AUTH_CLIENTID === ''){
      console.log('AAD Auth Client ID config is not setup in Azure for this instance');
      return {};
    }

    window.config = {
      instance: 'https://login.microsoftonline.com/',
      tenant: 'microsoft.com',
      clientId: process.env.REACT_APP_AAD_AUTH_CLIENTID,
      postLogoutRedirectUri: 'http://www.microsoft.com',
      cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
    };

    let authContext = new window.AuthenticationContext(window.config);

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

        window.appInsights.trackEvent("login", {profileId: window.userProfile.unique_name});

        return window.userProfile;
    } else {
        // We are not logged in.  Try to login.
        authContext.login();
    }
  },

  getPopularTermsTimeSeries(siteKey, datetimeSelection, timespanType, selectedTerm){
     let formatter = Actions.constants.TIMESPAN_TYPES[timespanType];
     let hostname = blobHostnamePattern.format(getEnvPropValue(siteKey, process.env.REACT_APP_STORAGE_ACCT_NAME));
     let blobContainer = getEnvPropValue(siteKey, process.env.REACT_APP_BLOB_TIMESERIES);

     let url = `${hostname}/${blobContainer}/${momentToggleFormats(datetimeSelection, formatter.format, formatter.blobFormat)}/${selectedTerm}.json`;

     return Rx.DOM.getJSON(url);
  },

  getDefaultSuggestionList(siteKey){
      return Rx.DOM.ajax({url: getEnvPropValue(siteKey, process.env.REACT_APP_TBL_KEYWORDS),
                          responseType: 'json',
                          headers: {"Accept": "application/json;odata=nometadata"}
                        });
  },

  getHeatmapTiles: function(siteKey, timespanType, zoomLevel, keyword, datetimeSelection, bbox, layerFilters, callback){
    let formatter = Actions.constants.TIMESPAN_TYPES[timespanType];
    let period = momentToggleFormats(datetimeSelection, formatter.format, formatter.blobFormat);
    let host = getEnvPropValue(siteKey, process.env.REACT_APP_SERVICE_HOSTS)

    console.log(`processing tile request [${keyword}, ${period}, ${bbox}, ${layerFilters.join(",")}]`)
    if(bbox && Array.isArray(bbox) && bbox.length === 4){
        var POST = {
            url : `${host}/tilefetcher`,
            method : "POST",
            json: true,
            withCredentials: false,
            body : {
                "bbox": bbox,
                "zoomLevel": MAX_ZOOM,
                "keyword": keyword,
                "period": period,
                "filteredEdges": layerFilters,
                "layerType": LAYER_TYPE_FILTER
            }
        };

        request(POST, callback);
    }else{
        throw new Error(`Invalid bbox format for value [${bbox}]`);
    }
  },

  getFacts: function (pageSize, skip) {
      let url = "http://fortisfactsservice.azurewebsites.net/api/facts?pageSize={0}&skip={1}&fullInfo=false".format(pageSize, skip);
      return Rx.DOM.getJSON(url);
  },

  getFact: function (id) {
      let url = "http://fortisfactsservice.azurewebsites.net/api/facts/" + id;
      return Rx.DOM.getJSON(url);
  },

  FetchMessageSentences: function(site, bbox, datetimeSelection, timespanType, limit, offset, filteredEdges, 
                        langCode, sourceFilter, mainTerm, fulltextTerm, callback){
   let fromDate, toDate;
   let formatter = Actions.constants.TIMESPAN_TYPES[timespanType];
   let dates = momentGetFromToRange(datetimeSelection, formatter.format, formatter.rangeFormat);
   fromDate = dates.fromDate;
   toDate = dates.toDate;

   if(bbox && Array.isArray(bbox) && bbox.length === 4){
        let fragmentView = `fragment FortisDashboardView on FeatureCollection {
                                type
                                runTime
                                    features {
                                        type
                                        coordinates
                                        properties {
                                            messageid,
                                            sentence,
                                            edges,
                                            createdtime,
                                            sentiment,
                                            orig_language,
                                            source
                                        }
                                    }
                                }`;

        let query = `  ${fragmentView}
                       query ByLocation($site: String!, $bbox: [Float]!, $mainTerm: String, $filteredEdges: [String]!, $langCode: String!, $limit: Int!, $offset: Int!, $fromDate: String!, $toDate: String!, $sourceFilter: [String], $fulltextTerm: String) { 
                             byLocation(site: $site, bbox: $bbox, mainTerm: $mainTerm, filteredEdges: $filteredEdges, langCode: $langCode, limit: $limit, offset: $offset, fromDate: $fromDate, toDate: $toDate, sourceFilter: $sourceFilter, fulltextTerm: $fulltextTerm) {
                                ...FortisDashboardView 
                            }
                        }`;

        let host = getEnvPropValue(site, process.env.REACT_APP_SERVICE_HOSTS)
        let variables = {site, bbox, mainTerm, filteredEdges, langCode, limit, offset, fromDate, toDate, sourceFilter, fulltextTerm};
        var POST = {
            url : `${host}/api/Messages`,
            method : "POST",
            json: true,
            withCredentials: false,
            body: { query, variables }
        };

        request(POST, callback);
    }else{
        callback(new Error(`Invalid bbox format for value [${bbox}]`));
    }
  }
}
