import Rx from 'rx';
import 'rx-dom';
import { Actions } from '../actions/Actions';
import { momentToggleFormats, momentGetFromToRange } from '../utils/Utils.js';
import request from 'request';

const blobHostnamePattern = "https://{0}.blob.core.windows.net";
const TIMESERIES_BLOB_CONTAINER_NAME = "processed-timeseries-bysource";
const MAX_ZOOM = 15;

export const SERVICES = {
    getPopularTermsTimeSeries(siteKey, accountName, datetimeSelection, timespanType, selectedTerm, dataSource, callback) {
        let formatter = Actions.constants.TIMESPAN_TYPES[timespanType];
        let hostname = blobHostnamePattern.format(accountName);
        let blobContainer = TIMESERIES_BLOB_CONTAINER_NAME;

        let url = `${hostname}/${blobContainer}/${dataSource}/${momentToggleFormats(datetimeSelection, formatter.format, formatter.blobFormat)}/${selectedTerm}.json`;
        let GET = {
            url: url,
            json: true,
            withCredentials: false
        };

        request(GET, callback);
    },

    getPopularTerms(site, datetimeSelection, timespanType, selectedTerm, sourceFilter, callback) {
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

        let variables = { site, additionalTerms, timespan, sourceFilter };
        let host = process.env.REACT_APP_SERVICE_HOST;
        let POST = {
            url: `${host}/api/terms`,
            method: "POST",
            json: true,
            withCredentials: false,
            body: { query, variables }
        };

        request(POST, callback);
    },

    fetchEdges(site, langCode, edgeType, callback) {
        const locationEdgeFragment = `fragment FortisDashboardLocationEdges on LocationCollection {
                                        runTime
                                        edges {
                                            name
                                            type
                                            coordinates
                                            population
                                        }
                                    }`;

        const termsEdgeFragment = ` fragment FortisDashboardTermEdges on TermCollection {
                                    runTime
                                    edges {
                                        name
                                        type
                                        name_ar
                                        RowKey
                                    }
                                }`;

        const locationsQuery = `locations: locations(site: $site, langCode: $langCode) {
                                ...FortisDashboardLocationEdges
                            }`;

        const termsQuery = `terms: terms(site: $site, langCode: $langCode) {
                                ...FortisDashboardTermEdges
                         }`;

        const fragments = `${edgeType === "All" || edgeType === "Location" ? locationEdgeFragment : ``}
                        ${edgeType === "All" || edgeType === "Term" ? termsEdgeFragment : ``}`;

        const queries = `${edgeType === "All" || edgeType === "Location" ? locationsQuery : ``}
                      ${edgeType === "All" || edgeType === "Term" ? termsQuery : ``}`;

        let query = `  ${fragments}
                      query FetchAllEdge($site: String!, $langCode: String) {
                            ${queries}
                        }`;

        let variables = { site, langCode };
        let host = process.env.REACT_APP_SERVICE_HOST;
        let POST = {
            url: `${host}/api/edges`,
            method: "POST",
            json: true,
            withCredentials: false,
            body: { query, variables }
        };

        request(POST, callback);
    },

    getMostPopularPlaces(site, datetimeSelection, timespanType, langCode, zoomLevel, sourceFilter, callback) {
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

        let variables = { site, timespan, langCode, zoomLevel, sourceFilter };
        let host = process.env.REACT_APP_SERVICE_HOST;
        let POST = {
            url: `${host}/api/places`,
            method: "POST",
            json: true,
            withCredentials: false,
            body: { query, variables }
        };

        request(POST, callback);
    },

    getHeatmapTiles: function (site, timespanType, zoom, mainEdge, datetimeSelection, bbox,
        filteredEdges, locations, sourceFilter, callback) {
        const formatter = Actions.constants.TIMESPAN_TYPES[timespanType];
        const timespan = momentToggleFormats(datetimeSelection, formatter.format, formatter.blobFormat);
        const zoomLevel = MAX_ZOOM;

        console.log(`processing tile request [${mainEdge}, ${timespan}, ${bbox}, ${filteredEdges.join(",")}]`)
        if (bbox && Array.isArray(bbox) && bbox.length === 4) {
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

            if (locations && locations.length > 0 && locations[0].length > 0) {
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

                variables = { site, locations, filteredEdges, timespan, sourceFilter };
            } else {
                query = `${edgesFragmentView}
                    ${featuresFragmentView}
                      query FetchAllEdgesAndTilesByBBox($site: String!, $bbox: [Float]!, $mainEdge: String!, $filteredEdges: [String], $timespan: String!, $zoomLevel: Int, $sourceFilter: [String]) {
                            features: fetchTilesByBBox(site: $site, bbox: $bbox, mainEdge: $mainEdge, filteredEdges: $filteredEdges, timespan: $timespan, zoomLevel: $zoomLevel, sourceFilter: $sourceFilter) {
                                ...FortisDashboardViewFeatures
                            }
                            edges: fetchEdgesByBBox(site: $site, bbox: $bbox, zoomLevel: $zoomLevel, mainEdge: $mainEdge, timespan: $timespan, sourceFilter: $sourceFilter) {
                                ...FortisDashboardViewEdges
                            }
                        }`;

                variables = { site, bbox, mainEdge, filteredEdges, timespan, zoomLevel, sourceFilter };
            }

            let host = process.env.REACT_APP_SERVICE_HOST

            var POST = {
                url: `${host}/api/tiles`,
                method: "POST",
                json: true,
                withCredentials: false,
                body: { query, variables }
            };

            request(POST, callback);
        } else {
            throw new Error(`Invalid bbox format for value [${bbox}]`);
        }
    },

    getSiteDefintion(siteId, retrieveSiteList, callback) {
        let fragment = `fragment FortisSiteDefinitionView on SiteCollection {
                            sites {
                                name
                                properties {
                                    targetBbox
                                    defaultZoomLevel
                                    logo
                                    title
                                    fbToken
                                    defaultLocation
                                    storageConnectionString
                                    featuresConnectionString
                                    supportedLanguages
                                }
                            }
                        }
                        ${retrieveSiteList ? `fragment FortisSitesListView on SiteCollection {
                            sites {
                                name
                            }
                        }`: ``}`;

        let query = `  ${fragment}
                        query Sites($siteId: String) {
                            siteDefinition: sites(siteId: $siteId) {
                                ...FortisSiteDefinitionView
                            }
                            ${retrieveSiteList ? `siteList: sites(siteId: "") {
                                ...FortisSitesListView
                            }`: ``}
                        }`;

        let variables = { siteId };

        console.log('getSiteDefintion called');
        let host = process.env.REACT_APP_SERVICE_HOST
        var POST = {
            url: `${host}/api/settings`,
            method: "POST",
            json: true,
            withCredentials: false,
            body: { query, variables }
        };

        request(POST, callback);
    },

    saveTwitterAccounts(site, accounts, mutation, callback) {
        let fragment = `fragment FortisTwitterAcctView on TwitterAccountCollection {
                            accounts {
                                    accountName
                                    consumerKey
                                    token
                                    consumerSecret
                                    tokenSecret
                            }
                        }`;
        let query = ` ${fragment} 
                      mutation ModifyTwitterAccounts($input: TwitterAccountDefintion!) {
                            streams: ${mutation}(input: $input) {
                                ...FortisTwitterAcctView
                            }
                        }`;

        let variables = { input: { accounts, site } };
        let host = process.env.REACT_APP_SERVICE_HOST
        var POST = {
            url: `${host}/api/settings`,
            method: "POST",
            json: true,
            withCredentials: false,
            body: { query, variables }
        };

        request(POST, callback);
    },

    getTwitterAccounts(siteId, callback) {
        let fragment = `fragment FortisTwitterAcctView on TwitterAccountCollection {
                            accounts {
                                    accountName
                                    consumerKey
                                    token
                                    consumerSecret
                                    tokenSecret
                            }
                        }`;

        let query = `  ${fragment}
                        query TwitterAccounts($siteId: String!) {
                            streams: twitterAccounts(siteId: $siteId) {
                                ...FortisTwitterAcctView
                            }
                        }`;

        let variables = { siteId };

        let host = process.env.REACT_APP_SERVICE_HOST
        var POST = {
            url: `${host}/api/settings`,
            method: "POST",
            json: true,
            withCredentials: false,
            body: { query, variables }
        };

        request(POST, callback);
    },

    saveKeywords(site, edges, callback) {
        const termsEdgeFragment = ` fragment FortisDashboardTermEdges on TermCollection {
                                    edges {
                                        name
                                        type
                                        name_ar
                                        RowKey
                                    }
                                }`;
        const query = `${termsEdgeFragment} 
                        mutation AddKeywords($input: EdgeTerms!) {
                            addKeywords(input: $input) {
                                ...FortisDashboardTermEdges
                            }
                        }`;

        const variables = { input: { site, edges } };

        const host = process.env.REACT_APP_SERVICE_HOST
        const POST = {
            url: `${host}/api/edges`,
            method: "POST",
            json: true,
            withCredentials: false,
            body: { query, variables }
        };

        request(POST, callback);
    },

    createOrReplaceSite(siteName, siteDefinition, callback) {
        let query = `  mutation CreateOrReplaceSite($input: SiteDefinition!) {
                            createOrReplaceSite(input: $input) {
                                name
                            }
                        }`;

        let variables = { input: siteDefinition };

        let host = process.env.REACT_APP_SERVICE_HOST
        var POST = {
            url: `${host}/api/settings`,
            method: "POST",
            json: true,
            withCredentials: false,
            body: { query, variables }
        };

        request(POST, callback);
    },

    removeKeywords(site, edges, callback) {
        const termsEdgeFragment = ` fragment FortisDashboardTermEdges on TermCollection {
                                    edges {
                                        name
                                        type
                                        name_ar
                                        RowKey
                                    }
                                }`;
        const query = `${termsEdgeFragment} 
                        mutation RemoveKeywords($input: EdgeTerms!) {
                            removeKeywords(input: $input) {
                                ...FortisDashboardTermEdges
                            }
                        }`;

        const variables = { input: { site, edges } };

        let host = process.env.REACT_APP_SERVICE_HOST
        var POST = {
            url: `${host}/api/edges`,
            method: "POST",
            json: true,
            withCredentials: false,
            body: { query, variables }
        };

        request(POST, callback);
    },

    getFacts: function (pageSize, skip) {
        let url = "http://fortisfactsservice.azurewebsites.net/api/facts?pageSize={0}&skip={1}&fullInfo=false".format(pageSize, skip);
        return Rx.DOM.getJSON(url);
    },

    getFactsWithFilter: function (pageSize, skip, tagFilterArray = []) {
        let tagFilterQuery = "";
        if (tagFilterArray.length > 0) {
            tagFilterQuery = "&tagFilter=" + tagFilterArray.map(encodeURI).join(":");
        }
        let url = "http://fortisfactsservice-staging.azurewebsites.net/api/facts/?pageSize={0}&skip={1}&fullInfo=false{2}".format(pageSize, skip, tagFilterQuery);
        return Rx.DOM.getJSON(url);
    },

    getFactTags: function () {
        return Rx.DOM.getJSON("http://fortisfactsservice-staging.azurewebsites.net/api/facts/?tagsOnly=true");
    },

    getFact: function (id) {
        let url = "http://fortisfactsservice.azurewebsites.net/api/facts/" + id;
        return Rx.DOM.getJSON(url);
    },

    FetchMessageDetail: function(site, messageId, dataSources, fields, additionalVars, callback) {
        let properties = fields.join(' ');
        let fragmentView = `fragment FortisDashboardView on Feature { 
                                type 
                                coordinates 
                                properties { 
                                    ${properties}
                                } 
                            }`;
         let query = `  ${fragmentView} 
                        query FetchEvent($site: String!, $messageId: String!, $dataSources: [String]!, $langCode: String) { 
                            event(site: $site, messageId: $messageId, dataSources: $dataSources, langCode: $langCode) {
                                ...FortisDashboardView 
                            }
                        }`;
         let variables = { site, messageId, dataSources, ...additionalVars };
         let host = process.env.REACT_APP_SERVICE_HOST;
         var POST = {
                url: `${host}/api/Messages`,
                method: "POST",
                json: true,
                withCredentials: false,
                body: { query, variables }
            };
         request(POST, callback);
    },

    FetchMessageSentences: function (site, bbox, datetimeSelection, timespanType, limit, offset, filteredEdges,
        langCode, sourceFilter, mainTerm, fulltextTerm, coordinates, callback) {
        let formatter = Actions.constants.TIMESPAN_TYPES[timespanType];
        let dates = momentGetFromToRange(datetimeSelection, formatter.format, formatter.rangeFormat);
        let fromDate = dates.fromDate, toDate = dates.toDate;

        if (bbox && Array.isArray(bbox) && bbox.length === 4) {
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

            if (coordinates && coordinates.length === 2) {
                query = `  ${fragmentView}
                       query ByLocation($site: String!, $coordinates: [Float]!, $filteredEdges: [String]!, $langCode: String!, $limit: Int!, $offset: Int!, $fromDate: String!, $toDate: String!, $sourceFilter: [String], $fulltextTerm: String) { 
                             byLocation(site: $site, coordinates: $coordinates, filteredEdges: $filteredEdges, langCode: $langCode, limit: $limit, offset: $offset, fromDate: $fromDate, toDate: $toDate, sourceFilter: $sourceFilter, fulltextTerm: $fulltextTerm) {
                                ...FortisDashboardView 
                            }
                        }`;
                variables = { site, coordinates, filteredEdges, langCode, limit, offset, fromDate, toDate, sourceFilter, fulltextTerm };
            } else {
                query = `  ${fragmentView}
                       query ByBbox($site: String!, $bbox: [Float]!, $mainTerm: String, $filteredEdges: [String]!, $langCode: String!, $limit: Int!, $offset: Int!, $fromDate: String!, $toDate: String!, $sourceFilter: [String], $fulltextTerm: String) { 
                             byBbox(site: $site, bbox: $bbox, mainTerm: $mainTerm, filteredEdges: $filteredEdges, langCode: $langCode, limit: $limit, offset: $offset, fromDate: $fromDate, toDate: $toDate, sourceFilter: $sourceFilter, fulltextTerm: $fulltextTerm) {
                                ...FortisDashboardView 
                            }
                        }`;
                variables = { site, bbox, mainTerm, filteredEdges, langCode, limit, offset, fromDate, toDate, sourceFilter, fulltextTerm };
            }

            let host = process.env.REACT_APP_SERVICE_HOST
            var POST = {
                url: `${host}/api/Messages`,
                method: "POST",
                json: true,
                withCredentials: false,
                body: { query, variables }
            };

            request(POST, callback);
        } else {
            callback(new Error(`Invalid bbox format for value [${bbox}]`));
        }
    },

    getAdminFbPages: function () {
        return Rx.Observable.from([[{
            url: "BritishCouncilLibya",
        },
        {
            url: "truthlibya",
        },
        {
            url: "ukinlibya",
        }
        ]]);
    },
    getAdminLanguage: function () {
        return Rx.Observable.from(["en"]);
    },
    getAdminTargetRegion: function () {
        return Rx.Observable.from(["29.626,16.216"]);
    },

    getAdminLocalities: function () {
        return Rx.Observable.from([[{
            ar_name: "Mudīrīyat أم الرزم",
            name: "Mudīrīyat Umm ar Rizam"
        },
        {
            ar_name: "زيغان",
            name: "Bardīyah"
        }
        ]]);
    }
}
