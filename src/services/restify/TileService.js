"use strict"

let PostgresService = require('./PGClient');

module.exports = {
    FetchTiles: function(bbox, zoomLevel, associatedKeywords, keyword, timespan, layertype, callback)
    {
        if(bbox && Array.isArray(bbox) && bbox.length == 4 && keyword && keyword.length > 0 && timespan && associatedKeywords){
            let query = `SELECT st_asgeojson(geog) as feature, sentiment, mentions, keyword
                            FROM tiles
                            WHERE tiles.geog && ST_MakeEnvelope(${bbox.join(", ")}, 4326)
                            and zoom = ${zoomLevel} and keyword = '${keyword}' and period = '${timespan}'
                            and associations::jsonb ?| array[\'${associatedKeywords.join("\',\'")}\'] and layertype = '${layertype}'`;
            
            PostgresService(query, (error, results) => {
                if(!error){
                    callback(undefined, 
                    {
                            "type": "FeatureCollection",
                            "features": results.rows.map(item => Object.assign({}, JSON.parse(item.feature), {
                                "properties": {
                                    "normSentimentScore":item.sentiment,
                                    "mentionCount":item.mentions,
                                    "keyword":item.keyword,
                                    "associations": item.associations
                                }
                            }))
                    }
                    );
                }else{
                    callback(error, undefined);
                }
            });

        }else{
            console.error(`Invalid parameter data provided.`);
        }
    }
};