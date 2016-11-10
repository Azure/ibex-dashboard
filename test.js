"use strict"

var request = require('request');

const LAYER_TYPE_FILTER = "associations";
const blobHostnamePattern = "https://{0}.blob.core.windows.net";

function FetchMessageSentences(site, bbox, fromDate, toDate, limit, offset, filteredEdges, 
                        langCode, sourceFilter, callback){
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
                       query ByLocation($site: String!, $bbox: [Float]!, $filteredEdges: [String]!, $langCode: String!, $limit: Int!, $offset: Int!, $fromDate: String!, $toDate: String!) { 
                             byLocation(site: $site, bbox: $bbox, filteredEdges: $filteredEdges, langCode: $langCode, limit: $limit, offset: $offset, fromDate: $fromDate, toDate: $toDate) {
                                ...FortisDashboardView 
                            }
                        }`;

        let variables = {site, bbox, filteredEdges, langCode, limit, offset, fromDate, toDate};
        var POST = {
            url : `http://fortis-azure-services.azurewebsites.net//api/Messages`,
            method : "POST",
            json: true,
            withCredentials: false,
            body: { query, variables }
        };

        request(POST, callback);
    }else{
        throw new Error(`Invalid bbox format for value [${bbox}]`);
    }
  }

  FetchMessageSentences("ocha", [7.734374999999999,26.725986812271756,24.697265625,32.45415593941475],
                        "11/5/2016", "11/7/2016", 20, 0, ["attack"], "en", undefined, (err, result)=>{
                            console.log(err);
                            console.log(JSON.stringify(result));
                        });