"use strict"

let restify = require('restify');
let TileService = require('./src/services/restify/TileService');

let DEFAULT_LAYER_TYPE = "associations";

let server = restify.createServer();
server.use(restify.bodyParser());

server.post('/TileFetcher', (req, res, next) => {
   let layerType = req.params.layerType || DEFAULT_LAYER_TYPE;

   if(req.params.bbox && req.params.zoomLevel && req.params.associations && req.params.keyword && req.params.period){
      TileService.FetchTiles(req.params.bbox, req.params.zoomLevel, req.params.associations, req.params.keyword, 
                              req.params.period, layerType, (error, response) => {      
          if(error){
            let errorMsg = `Internal tile server error: [${JSON.stringify(error)}]`;

            res.send(500, errorMsg);
          }else{
            res.send(201, response);
          }
          
          return next();
      });
   }else{
     return next();
   }
 });

//server.head('/TileFetcher', respond);

server.listen(900, function() {
  console.log('%s listening at %s', server.name, server.url);
});