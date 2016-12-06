import Rx from 'rx';
import 'rx-dom';
import {Actions} from '../actions/Actions';
import {guid, momentToggleFormats, getEnvPropValue, momentGetFromToRange} from '../utils/Utils.js';
import request from 'request';

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

 getPopularTermsTimeSeries(siteKey, datetimeSelection, timespanType, selectedTerm, callback){
     let formatter = Actions.constants.TIMESPAN_TYPES[timespanType];
     let hostname = blobHostnamePattern.format(getEnvPropValue(siteKey, process.env.REACT_APP_STORAGE_ACCT_NAME));
     let blobContainer = getEnvPropValue(siteKey, process.env.REACT_APP_BLOB_TIMESERIES);

     let url = `${hostname}/${blobContainer}/${momentToggleFormats(datetimeSelection, formatter.format, formatter.blobFormat)}/${selectedTerm}.json`;

     let GET = {
            url : url,
            json: true,
            withCredentials: false
     };

     request(GET, callback);
  },

  getPopularTerms(site, datetimeSelection, timespanType, selectedTerm, sourceFilter, callback){
      let formatter = Actions.constants.TIMESPAN_TYPES[timespanType];
      let timespan = momentToggleFormats(datetimeSelection, formatter.format, formatter.blobFormat);
      let additionalTerms = selectedTerm ? [selectedTerm] : [];

      let fragment = `fragment FortisDashboardView on EdgeList {
                        runTime
                        edges {
                            name
                            mentions
                        }
                      }`;

      let query = `  ${fragment}
                      query WhatsBuzzing($site: String!, $additionalTerms: [String], $timespan: String!, $sourceFilter: [String]) {
                        whatsBuzzing(site: $site, additionalTerms: $additionalTerms, timespan: $timespan, sourceFilter: $sourceFilter) {
                            ...FortisDashboardView
                        }
                      }`;

      let variables = {site, additionalTerms, timespan, sourceFilter};
      let host = getEnvPropValue(site, process.env.REACT_APP_SERVICE_HOSTS);
      let POST = {
            url : `${host}/api/terms`,
            method : "POST",
            json: true,
            withCredentials: false,
            body: { query, variables }
      };

      request(POST, callback);
  },

  getDefaultSuggestionList(site, langCode, type, callback){
      let fragment = `fragment FortisDashboardTermEdges on TermCollection {
                            runTime
                            edges {
                                name
                                type
                            }
                        }

                        fragment FortisDashboardLocationEdges on LocationCollection {
                            runTime
                            edges {
                                name
                                type
                                coordinates
                                population
                            }
                        }`;

      let query = `  ${fragment}
                      query FetchAllEdge($site: String!, $langCode: String) {
                            locations: locations(site: $site, langCode: $langCode) {
                                ...FortisDashboardLocationEdges
                            }
                            terms: terms(site: $site, langCode: $langCode) {
                                ...FortisDashboardTermEdges
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

  getMostPopularPlaces(site, datetimeSelection, timespanType, langCode, zoomLevel, sourceFilter, callback){
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
                      query PopularLocations($site: String!, $langCode: String, $timespan: String!, $zoomLevel: Int, $sourceFilter: [String]) {
                            popularLocations(site: $site, langCode: $langCode, timespan: $timespan, zoomLevel: $zoomLevel, sourceFilter: $sourceFilter) {
                            ...FortisDashboardView
                        }
                      }`;

      let variables = {site, timespan, langCode, zoomLevel, sourceFilter};
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
                            filteredEdges, locations, sourceFilter, callback){
    const formatter = Actions.constants.TIMESPAN_TYPES[timespanType];
    const timespan = momentToggleFormats(datetimeSelection, formatter.format, formatter.blobFormat);
    const zoomLevel = MAX_ZOOM;

    console.log(`processing tile request [${mainEdge}, ${timespan}, ${bbox}, ${filteredEdges.join(",")}]`)
    if(bbox && Array.isArray(bbox) && bbox.length === 4){
        const featuresFragmentView = `fragment FortisDashboardViewFeatures on FeatureCollection {
                                        runTime
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

        const edgesFragmentView = `fragment FortisDashboardViewEdges on EdgeCollection {
                                        runTime
                                        edges {
                                            type
                                            name
                                            mentionCount
                                        }
                                    }`;

        let query, variables;
        
        if(locations && locations.length > 0 && locations[0].length > 0){
            query = `${edgesFragmentView}
                     ${featuresFragmentView}
                        query FetchAllEdgesAndTilesByLocations($site: String!, $locations: [[Float]]!, $filteredEdges: [String], $timespan: String!, $sourceFilter: [String]) {
                            features: fetchTilesByLocations(site: $site, locations: $locations, filteredEdges: $filteredEdges, timespan: $timespan, sourceFilter: $sourceFilter) {
                                ...FortisDashboardViewFeatures
                            }
                            edges: fetchEdgesByLocations(site: $site, locations: $locations, timespan: $timespan, sourceFilter: $sourceFilter) {
                                ...FortisDashboardViewEdges
                            }
                        }`;

            variables = {site, locations, filteredEdges, timespan, sourceFilter};
        }else{
            query =`${edgesFragmentView}
                    ${featuresFragmentView}
                      query FetchAllEdgesAndTilesByBBox($site: String!, $bbox: [Float]!, $mainEdge: String!, $filteredEdges: [String], $timespan: String!, $zoomLevel: Int, $sourceFilter: [String]) {
                            features: fetchTilesByBBox(site: $site, bbox: $bbox, mainEdge: $mainEdge, filteredEdges: $filteredEdges, timespan: $timespan, zoomLevel: $zoomLevel, sourceFilter: $sourceFilter) {
                                ...FortisDashboardViewFeatures
                            }
                            edges: fetchEdgesByBBox(site: $site, bbox: $bbox, zoomLevel: $zoomLevel, mainEdge: $mainEdge, timespan: $timespan, sourceFilter: $sourceFilter) {
                                ...FortisDashboardViewEdges
                            }
                        }`;

            variables = {site, bbox, mainEdge, filteredEdges, timespan, zoomLevel, sourceFilter};
        }

        let host = getEnvPropValue(site, process.env.REACT_APP_SERVICE_HOSTS)
        
        var POST = {
            url : `${host}/api/tiles`,
            method : "POST",
            json: true,
            withCredentials: false,
            body: { query, variables }
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
                        langCode, sourceFilter, mainTerm, fulltextTerm, coordinates, callback){
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
                                            language,
                                            source
                                        }
                                    }
                                }`;

        let query, variables;

        if(coordinates && coordinates.length === 2){
            query = `  ${fragmentView}
                       query ByLocation($site: String!, $coordinates: [Float]!, $filteredEdges: [String]!, $langCode: String!, $limit: Int!, $offset: Int!, $fromDate: String!, $toDate: String!, $sourceFilter: [String], $fulltextTerm: String) { 
                             byLocation(site: $site, coordinates: $coordinates, filteredEdges: $filteredEdges, langCode: $langCode, limit: $limit, offset: $offset, fromDate: $fromDate, toDate: $toDate, sourceFilter: $sourceFilter, fulltextTerm: $fulltextTerm) {
                                ...FortisDashboardView 
                            }
                        }`;
            variables = {site, coordinates, filteredEdges, langCode, limit, offset, fromDate, toDate, sourceFilter, fulltextTerm};
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
  },

  getAdminFbPages: function(){
       return Rx.Observable.from([[{
           url:"BritishCouncilLibya",
       },
       {
           url:"truthlibya",
       },
       {
           url:"ukinlibya",
       }
       ]]);
  },
  getAdminLanguage:function(){
      return Rx.Observable.from(["en"]);
  },
  getAdminTargetRegion :function(){
      return Rx.Observable.from(["29.626,16.216"]);
  },

  getAdminLocalities: function(){
       return Rx.Observable.from([[{
           ar_name:"Mudīrīyat أم الرزم",
           name: "Mudīrīyat Umm ar Rizam"
       },
       {
           ar_name: "زيغان",
           name: "Bardīyah"
       }
       ]]);
  },

  translate: function (sentence, fromLanguage, toLanguage, callback) {
      let query = `
        fragment TranslationView on TranslationResult{
            translatedSentence
            } 

            query FetchEvent($sentence: String!, $fromLanguage: String!, $toLanguage: String!) {

            translate(sentence: $sentence, fromLanguage: $fromLanguage, toLanguage: $toLanguage){
                ...TranslationView
            }
        }`
      let variables = {sentence, fromLanguage, toLanguage};
      let host = "http://fortisfactsservice.azurewebsites.net"
      var POST = {
           url : `${host}/api/Messages`,
            method : "POST",
            json: true,
            withCredentials: false,
            body: { query, variables }
        };
        
        request(POST, callback);
  },
}
