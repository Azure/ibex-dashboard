import Fluxxor from 'fluxxor';
import React, { PropTypes, Component } from 'react';
import {Actions} from '../actions/Actions';
import Leaflet from 'leaflet';
import Tile from 'geotile';
import Rx from 'rx';
import Rainbow from 'rainbowvis.js';
import {SERVICES} from '../services/services';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");
const defaultLat = 51.4826352;
const defaultLong = 11.8515167;

export const HeatMap = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getInitialState(){
      return{
          latitude: defaultLat,
          longitude: defaultLong
      };
  },
  
  getStateFromFlux: function() {
    return this.getFlux().store("DataStore").getState();
  },
  
  addInfoBoxControl(){
      let info = Leaflet.control();
      let categoryType = this.state.categoryType;
      let categoryValue = this.state.categoryValue;
      let infoHeaderText = "<h4>{0} Geo-Location Tile Details</h4>".format(categoryType);
      let self = this;
      
      if(this.map){
          info.onAdd = map => {
			this._div = Leaflet.DomUtil.create('div', 'info');
			info.update();
			return this._div;
		  };
          
          info.options = {
            position: 'topleft'  
          },

		  info.update = props => {
            var infoBoxInnerHtml = 'Hover over a tile to see more details<br><br>';
            
            if(props && props.sentiments && props.sentiments.length > 0){
                infoBoxInnerHtml = "<b>{0}</b> - <b>{1}</b> mentions<br /><br>".format(categoryValue, props.occurences);
                props.sentiments.forEach(element => {
                    infoBoxInnerHtml += "Sentiment: {0} - Score: {1}<br>".format(element.sentiment, element.sentimentScore);
                });
            }else{
                Object.keys(Actions.constants.SENTIMENT_COLOR_MAPPING).forEach(element => {
                    infoBoxInnerHtml += "<i class='legend-i' style='background: {0}'></i> <span class='legend-label'>{1}</span><br>".format(Actions.constants.SENTIMENT_COLOR_MAPPING[element], element);
                });
            }
            
			this._div.innerHTML = infoHeaderText + infoBoxInnerHtml;
		  };

		  info.addTo(this.map);
          this.infoControl = info;
      }
  },
  
  getSentimentColor(sentiment){
      return Actions.constants.SENTIMENT_COLOR_MAPPING[sentiment];
  },
  
  componentDidMount(){
    let latitude = this.state.latitude;
    let longitude = this.state.longitude;
    this.heatmapLayers = {};
    this.heatmap = {};
    let defaultZoom = 6;
    
    this.gradient = new Rainbow();
    this.gradient.setSpectrum('red', 'yellow');
    this.gradient.setNumberRange(-10.0, 10.0);
    
    this.map = Leaflet.map('leafletMap', {zoomControl: false}).setView([latitude, longitude], defaultZoom);
    Leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.outdoors',
        accessToken: 'pk.eyJ1IjoiZXJpa3NjaGxlZ2VsIiwiYSI6ImNpaHAyeTZpNjAxYzd0c200dWp4NHA2d3AifQ.5bnQcI_rqBNH0rBO0pT2yg'
    }).addTo(this.map);
    
    this.map.addControl(Leaflet.control.zoom({position: 'topright'}));
    
    var self = this;
    this.map.on('moveend',() => {
      self.viewportChanged();
    });
        
    this.viewportChanged();
    this.addInfoBoxControl();
  },
  
  viewportChanged() {
    if (this.map) this.updateHeatmap();
  },  
  
  buildLayerId(tileId, dataStore) {
    return "{0}|{1}".format(tileId, dataStore.timespanType);
  },
  
  /*Thank You Tim Park*/
  updateHeatmap() {
    let self = this;
    let dataStore = this.getFlux().store("DataStore").dataStore;
    
    let bounds = self.map.getBounds();
    let zoom = this.map.getZoom();
    let northWest = bounds.getNorthWest();
    let southEast = bounds.getSouthEast();

    let spanningTileIds = Tile.tileIdsForBoundingBox(northWest.lat, northWest.lng, southEast.lat, southEast.lng, zoom);

    let layerIds = spanningTileIds.map(tileId => {
       return self.buildLayerId(tileId, dataStore);
    });

    let deleteList = [];
    let callback = () => console.log('Finished processing tile(s)');

    for (let layerId in this.heatmapLayers) {
      if (layerIds.indexOf(layerId) === -1) {
        deleteList.push(layerId);
        this.map.removeLayer(this.heatmapLayers[layerId]);
      }
    }
    
    
    Rx.Observable.from(spanningTileIds)
                 .subscribe(tile => {
                     self.createLayer(tile, callback);
                 }, error => {
                     deleteList.forEach(layerId => {
                        delete self.heatmapLayers[layerId];
                     });
                 });
  },
  
  fetchHeatmap(tileId, callback) {
    let self = this;
    //exit the fetch if the tile response is already cached
    if (this.heatmap[tileId]) return callback();

    let timespanFragment = "{0}-{1}".format(this.state.timespanType, this.state.timespan);

    let url = '';//ENV.APP.EMOTIONMAPS_BLOB + timespanFragment + '/' + tileId;
    SERVICES.getHeatmapTiles(url)
            .subscribe(response => {
                self.heatmap[tileId] = response;
                callback(response);
            });
  },
  
  sortSentimentByScore(heatmapElement){
      let sortedList = [];
      
      this.state.sentimentValues.forEach(sentiment => {
          let sentimentKey = Actions.constants.SENTIMENT_JSON_MAPPING[sentiment];
          
          sortedList.push({
              color: Actions.constants.SENTIMENT_COLOR_MAPPING[sentiment],
              sentimentScore: heatmapElement[sentimentKey],
              sentiment: sentiment
          });
      });
      
      sortedList.sort((sentimentA, sentimentB) => {
          let scoreDifference = sentimentB.sentimentScore - sentimentA.sentimentScore;
          
          //Place a higher weighting on negative sentiments for a matching score
          if(scoreDifference == 0 && sentimentB.sentimentScore > 0 && sentimentB.sentiment === 'negative'){
              return 1;
          }else{
              return scoreDifference;
          }
      });
      
      return sortedList;
  },
  
  createLayer(tileId, callback) {
    let self = this;
    let dataStore = this.getFlux().store("DataStore").dataStore;
    
    let layerId = this.buildLayerId(tileId, dataStore);

    this.fetchHeatmap(tileId, response => {
      if (!self.heatmap[tileId]) return callback();

      let heatmapTiles = [];
      
      //Iterate through all the elemens in the cache for tileId
      self.heatmap[tileId].forEach(element => {
        Object.keys(element).forEach(heatmapElementTileId => {
          let heatmapElement = element[heatmapElementTileId];
          let heatmapTile = Tile.tileFromTileId(heatmapElementTileId);
          let sortSentimentByScore = self.sortSentimentByScore(heatmapElement);
          let highestScoredSentiment = sortSentimentByScore[0];
          let sentimentValue = parseInt(highestScoredSentiment.sentimentScore);
          //let opacity = sentimentValue / 10.0;
          let colorValue = heatmapElement[Actions.constants.SENTIMENT_JSON_MAPPING['negative']] * -1 + 
                      heatmapElement[Actions.constants.SENTIMENT_JSON_MAPPING['positive']]
          let color =  '#' + self.gradient.colourAt(colorValue);
          
          if (sentimentValue > 0.0) {
                let rectangle = Leaflet.rectangle([
                    [ heatmapTile.latitudeNorth, heatmapTile.longitudeWest ],
                    [ heatmapTile.latitudeSouth, heatmapTile.longitudeEast ]
                ], {
                    color: color,//highestScoredSentiment.color,
                    weight: 1,
                    fillOpacity: 0.5,
                    occurences: heatmapElement.occurences,
                    sentiments: sortSentimentByScore,
                    dashArray: '3',
                    timestamp: heatmapElement.timestamp
                });
                self.onEachLayer(rectangle);
                
                heatmapTiles.push(rectangle);
          }
        });
      });

      if (self.heatmapLayers[layerId]) self.map.removeLayer(self.heatmapLayers[layerId]);

      self.heatmapLayers[layerId] = Leaflet.featureGroup(heatmapTiles);
      self.map.addLayer(self.heatmapLayers[layerId]);

      return callback();
    });
  },
 
  onEachLayer(layer) {
			layer.on({
                mouseover: this.highlightFeature,
				mouseout: this.resetHighlight,
				click: this.zoomToFeature
			});
  },
  
  resetHighlight(e) {
			let rectangle = e.target;
            
            rectangle.setStyle({
				weight: 1
			});
			this.infoControl.update();
  },
  
  highlightFeature(e){
			var layer = e.target;

			layer.setStyle({
				weight: 5
			});

			this.infoControl.update(layer.options);
   },
   
   zoomToFeature(e) {
			this.map.fitBounds(e.target.getBounds());
   },

  render() {
    if(this.map){
        this.updateHeatmap();
    }

    return (
        <div>
        </div>
     );
  }
});