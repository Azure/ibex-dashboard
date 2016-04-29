var borders = require('./OSMBorderDescedents');
var fs = require('fs');
var https = require('https');
var rootPath = './osmShapes/'
var mapZenHost = 'https://whosonfirst.mapzen.com/data/';
var featureCollectionObj = {"type": "FeatureCollection", "features": []};

var parseDirectoryStructure = (regionId) => {
    var regionStr = regionId.toString();
    
    if(regionStr.length < 7){
        throw new Error('Expecting region: ' + regionId + ' to be >= 7 characters');
    }
    var directoryArray = [3];
    directoryArray[0] = regionStr.substring(0, 3);
    directoryArray[1] = regionStr.substring(3, 6);
    directoryArray[2] = regionStr.substring(6);
    
    return directoryArray;
};

var geoJsonFetcher = (hostDirectory, shapeId) => {
        var url = mapZenHost + hostDirectory;
        console.log(url);
        
        https.get(mapZenHost + hostDirectory, res => {
            var geoJson = '';
            
            res.on('data', (d) => {
                geoJson += d;
            });
            
            res.on('end', () => {
              var jsonBody = JSON.parse(geoJson);
                    fs.writeFile(rootPath + shapeId + '.geojson', JSON.stringify(jsonBody));
                    featureCollectionObj.features.push(jsonBody);
                    fs.writeFile(rootPath + 'libyanAreas.geojson', JSON.stringify(featureCollectionObj));
            });
        });
};

var borderExtractor = () => {
    borders.map(region => {
        var shapes = [region.regionId].concat(region.descendents);
        
        shapes.map(shapeId => {
            var directoryArr = parseDirectoryStructure(shapeId);
        
            if(directoryArr.length != 3){
                throw new Error('Invalid regionID number for region ' + shapeId);
            }
            var directoryArr = parseDirectoryStructure(shapeId);
            var directoryPath = directoryArr[0] + '/' + directoryArr[1] + '/' + directoryArr[2] + '/' + shapeId + '.geojson';
            
            console.log('Extracting ' + directoryPath);
            
            geoJsonFetcher(directoryPath, shapeId);
            console.log('Extracted ' + shapeId);
        });
    });
};

borderExtractor();
            
console.log('Finished');