import Rx from 'rx';
import 'rx-dom';
import {Actions} from '../actions/Actions';
import {guid, momentToggleFormats, getEnvPropValue, momentGetFromToRange} from '../utils/Utils.js';
import request from 'request';
import geotile from 'geotile';

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

  getDefaultSuggestionList(site, langCode, callback){
      let fragment = `fragment FortisDashboardView on EdgeCollection {
                        edges {
                            type
                            properties {
                                name
                                coordinates
                            }
                        }
                      }`;

      let query = `  ${fragment}
                      query Search($site: String!, $langCode: String){
                            search(site: $site, langCode: $langCode) {
                            ...FortisDashboardView
                        }
                      }`;

      let variables = {site, langCode};
      let host = getEnvPropValue(site, process.env.REACT_APP_SERVICE_HOSTS);
      let POST = {
            url : `${host}/api/edges`,
            method : "POST",
            json: true,
            withCredentials: false,
            body: { query, variables }
      };

      request(POST, callback);
  },

  getMostPopularPlaces(site, datetimeSelection, timespanType, langCode, zoomLevel, callback){
      let formatter = Actions.constants.TIMESPAN_TYPES[timespanType];
      let timespan = momentToggleFormats(datetimeSelection, formatter.format, formatter.blobFormat);

      let fragment = `fragment FortisDashboardView on FeatureCollection {
                            type
                            runTime
                            features {
                                coordinates
                                properties {
                                    location
                                    population
                                    mentions
                                }
                            }
                        }`;

      let query = `  ${fragment}
                      query PopularLocations($site: String!, $langCode: String, $timespan: String!, $zoomLevel: Int) {
                            popularLocations(site: $site, langCode: $langCode, timespan: $timespan, zoomLevel: $zoomLevel) {
                            ...FortisDashboardView
                        }
                      }`;

      let variables = {site, timespan, langCode, zoomLevel};
      let host = getEnvPropValue(site, process.env.REACT_APP_SERVICE_HOSTS);
      let POST = {
            url : `${host}/api/places`,
            method : "POST",
            json: true,
            withCredentials: false,
            body: { query, variables }
      };

      request(POST, callback);
  },

  getHeatmapTiles: function(site, timespanType, zoom, mainEdge, datetimeSelection, bbox, 
                            filteredEdges, locations, callback){
    let formatter = Actions.constants.TIMESPAN_TYPES[timespanType];
    let timespan = momentToggleFormats(datetimeSelection, formatter.format, formatter.blobFormat);
    let zoomLevel = MAX_ZOOM;

    console.log(`processing tile request [${mainEdge}, ${timespan}, ${bbox}, ${filteredEdges.join(",")}]`)
    if(bbox && Array.isArray(bbox) && bbox.length === 4){
        let fragmentView = `fragment FortisDashboardView on FeatureCollection {
                                type
                                runTime
                                edges {
                                    type
                                    name
                                    mentionCount
                                }
                                features {
                                    type
                                    coordinates
                                    properties {
                                    neg_sentiment
                                    pos_sentiment
                                    location
                                    mentionCount
                                    tileId
                                    population
                                    location
                                    }
                                }
                                }`;

        let query, variables;
        
        if(locations && locations.length > 0 && locations[0].length > 0){
            query = `${fragmentView} 
                        query FetchAllEdgesAndTilesByLocations($site: String!, $locations: [[Float]]!, $filteredEdges: [String], $timespan: String!) {
                              fetchAllEdgesAndTilesByLocations(site: $site, locations: $locations, filteredEdges: $filteredEdges, timespan: $timespan) {
                                    ...FortisDashboardView
                              }
                        }`;

            variables = {site, locations, filteredEdges, timespan};
        }else{
            query =`${fragmentView}
                       query FetchAllEdgesAndTilesByBBox($site: String!, $bbox: [Float]!, $mainEdge: String!, $filteredEdges: [String], $timespan: String!, $zoomLevel: Int) {
                             fetchAllEdgesAndTilesByBBox(site: $site, bbox: $bbox, mainEdge: $mainEdge, filteredEdges: $filteredEdges, timespan: $timespan, zoomLevel: $zoomLevel) {
                                ...FortisDashboardView 
                             }
                        }`;

            variables = {site, bbox, mainEdge, filteredEdges, timespan, zoomLevel};
        }

        let host = getEnvPropValue(site, process.env.REACT_APP_SERVICE_HOSTS)
        
        var POST = {
            url : `${host}/api/tiles`,
            method : "POST",
            json: true,
            withCredentials: false,
            body: { query, variables }
        };

        console.log(query, JSON.stringify(variables));
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
                        langCode, sourceFilter, mainTerm, fulltextTerm, searchLocation, callback){
   let formatter = Actions.constants.TIMESPAN_TYPES[timespanType];
   let dates = momentGetFromToRange(datetimeSelection, formatter.format, formatter.rangeFormat);
   let fromDate = dates.fromDate, toDate = dates.toDate;

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

        let query, variables;

        if(searchLocation && searchLocation.length === 2){
            let tileId = geotile.tileIdFromLatLong(searchLocation[1], searchLocation[0], MAX_ZOOM);
            query = `  ${fragmentView}
                       query ByTile($site: String!, $tileId: String!, $filteredEdges: [String]!, $langCode: String!, $limit: Int!, $offset: Int!, $fromDate: String!, $toDate: String!, $sourceFilter: [String], $fulltextTerm: String) { 
                             byTile(site: $site, tileId: $tileId, filteredEdges: $filteredEdges, langCode: $langCode, limit: $limit, offset: $offset, fromDate: $fromDate, toDate: $toDate, sourceFilter: $sourceFilter, fulltextTerm: $fulltextTerm) {
                                ...FortisDashboardView 
                            }
                        }`;
            variables = {site, tileId, filteredEdges, langCode, limit, offset, fromDate, toDate, sourceFilter, fulltextTerm};
        }else{
            query = `  ${fragmentView}
                       query ByBbox($site: String!, $bbox: [Float]!, $mainTerm: String, $filteredEdges: [String]!, $langCode: String!, $limit: Int!, $offset: Int!, $fromDate: String!, $toDate: String!, $sourceFilter: [String], $fulltextTerm: String) { 
                             byBbox(site: $site, bbox: $bbox, mainTerm: $mainTerm, filteredEdges: $filteredEdges, langCode: $langCode, limit: $limit, offset: $offset, fromDate: $fromDate, toDate: $toDate, sourceFilter: $sourceFilter, fulltextTerm: $fulltextTerm) {
                                ...FortisDashboardView 
                            }
                        }`;
            variables = {site, bbox, mainTerm, filteredEdges, langCode, limit, offset, fromDate, toDate, sourceFilter, fulltextTerm};
        }

        let host = getEnvPropValue(site, process.env.REACT_APP_SERVICE_HOSTS)
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
