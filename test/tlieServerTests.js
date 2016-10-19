"use strict"

let assert = require('assert'),
    tileFetchService = require('../build/src/services/restify/TileService');

describe('Validate Tile Fetch service', () => {
    it('We can succesfully fetch a tile in libya', done => {
    
      let bbox = [110.83, -76.71, 142.82, -67.68];
      let zoomLevel = 14;
      let associations = ["hospitals"];
      let keyword = "refugees";
      let period = "month-2016-09";
      let layerType = "associations"

      tileFetchService.FetchTiles(bbox, zoomLevel, associations, keyword, period, layerType, (error, response) => {    
          assert(!error);
          assert(response.features);

          done();
      });
    });
});