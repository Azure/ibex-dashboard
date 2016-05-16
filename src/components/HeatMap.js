import Fluxxor from 'fluxxor';
import React, { PropTypes, Component } from 'react';
import {Actions} from '../actions/Actions';
import Leaflet from 'leaflet';
import Tile from 'geotile';
import Rx from 'rx';
import {SERVICES} from '../services/services';
import env_properties from '../../config.json';
import global from '../utils/global';
import Rainbow from 'rainbowvis.js';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");
const defaultLat = 20.1463919;
const defaultLong = 2.2705778;
const rainbowColorCeiling = 1000;

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
            let categoryType = self.state.categoryType;
            let categoryValue = self.state.categoryValue;
            let infoHeaderText = "<h4>{0} Sentiment Details</h4>".format(categoryType);
            let infoBoxInnerHtml = 'Hover over a tile to see more details<br><br>';
            
            if(props && props.cnt){
                let sentimentListItem = "<i class='legend-i' style='background: {0}'></i> <span class='legend-label'>{1}</span>".format(self.getColor((props.mag_n || 0) * rainbowColorCeiling), self.getSentimentCategory((props.mag_n || 0) * 100));
                infoBoxInnerHtml = "<b>{0}</b><br /><ul><li><b>Mentions</b>:{1}</li><li><b>Sentiment:</b>{2}</li><li><b>Intensity Level</b>:{3}</li></ul>".format(categoryValue, props.cnt, sentimentListItem, Number(((props.mag_n || 0) * 100).toFixed(0)));
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
  
  getSentimentCategory(level){
      if(level >= 0 && level <= 15){
          return "Very Positive";
      }else if(level > 15 && level <= 25){
          return "Positive";
      }else if(level > 25 && level <= 40){
          return "Slightly Positive";
      }else if(level > 40 && level <= 55){
          return "Neutral";
      }else if(level > 55 && level <= 70){
          return "Slightly Negative";
      }else if(level > 70 && level <= 85){
          return "Negative";
      }else if(level > 85){
          return "Very Negative";
      }
  },
  
  componentDidMount(){
    let latitude = this.state.latitude;
    let longitude = this.state.longitude;
    this.heatmapLayers = {};
    this.heatmap = {};
    let defaultZoom = 5;
    
    this.gradient = new Rainbow();
    this.gradient.setSpectrum('green', 'yellow', 'red');
    this.gradient.setNumberRange(0, rainbowColorCeiling);
    
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
  
  dataStoreValidated(){
      return this.state && this.state.datetimeSelection
                        && this.state.timespanType
                        && this.state.categoryType
   },

  /*Thank You Tim Park*/
  updateHeatmap() {
    let self = this;
    
    if(!this.dataStoreValidated()){
        throw new Error("Either date or category type is not set");
    }
    
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

    SERVICES.getHeatmapTiles(this.state.categoryType, this.state.timespanType, this.state.categoryValue, this.state.datetimeSelection, tileId)
            .subscribe(response => {
                self.heatmap[tileId] = response;
                callback(response);
            }, error => {
            });
  },
  
  createLayer(tileId, callback) {
    let self = this;
    let dataStore = this.getFlux().store("DataStore").dataStore;
    
    let layerId = this.buildLayerId(tileId, dataStore);

    this.fetchHeatmap(tileId, response => {
      if (!self.heatmap[tileId]) return callback();
      if (self.heatmapLayers[layerId]) self.map.removeLayer(self.heatmapLayers[layerId]);
            
      //Iterate through all the elemens in the cache for tileId
      self.heatmap[tileId].forEach(heatmapTileElement => {
        Object.keys(heatmapTileElement).forEach(heatmapElementTileId => {               
               let leafletElement = heatmapTileElement[heatmapElementTileId];
               let heatmapTile = Tile.tileFromTileId(heatmapElementTileId); 
               
               let rectangle = Leaflet.rectangle([
                    [ heatmapTile.latitudeNorth, heatmapTile.longitudeWest ],
                    [ heatmapTile.latitudeSouth, heatmapTile.longitudeEast ]
               ]);
               
               let geoJson = self.convertTileToGeoJSON(rectangle.toGeoJSON(), leafletElement, layerId);
               
               if(self.heatmapLayers[layerId]){
                   self.heatmapLayers[layerId].addData(geoJson);
               }else{
                   self.heatmapLayers[layerId] = Leaflet.geoJson(geoJson,
                        {style: self.style, onEachFeature : self.onEachFeature});
               }
        });
      });
      
      if(self.heatmapLayers[layerId]){
         self.heatmapLayers[layerId].addTo(self.map); 
      }
      
      return callback();
    });
  },
  
  style(feature) {
			return {
			    weight: 0,
				opacity: 1,
				//color: 'white',
				//dashArray: '3',
				fillOpacity: 0.7,
				fillColor: this.getColor((feature.properties.mag_n || 0) * rainbowColorCeiling)
			};
 },
 
 getColor(d) {
			return "#{0}".format(this.gradient.colourAt(d));
 },
  
 convertTileToGeoJSON(geoJson, properties, layerId){
      geoJson.properties = Object.assign(geoJson.properties, properties, {layerId});
      
      return geoJson;
 },

  onEachFeature(feature, layer) {
			layer.on({
                mouseover: this.highlightFeature,
				mouseout: this.resetHighlight,
				click: this.zoomToFeature
			});
  },
  
  resetHighlight(e) {
			let rectangle = e.target;
            let geoJson = this.heatmapLayers[rectangle.feature.properties.layerId];
            
            if(geoJson){
                geoJson.resetStyle(rectangle);
            }
            
			this.infoControl.update();
  },
  
  highlightFeature(e){
			var layer = e.target;

			layer.setStyle({
				weight: 5,
				color: '#666',
				dashArray: '',
				fillOpacity: 0.7
			});

			this.infoControl.update(layer.feature.properties);
   },
   
   zoomToFeature(e) {
			this.map.fitBounds(e.target.getBounds());
   },
   
   clearMap(){
       for (var layerId in this.heatmapLayers) {
                this.map.removeLayer(this.heatmapLayers[layerId]);
        }
        this.heatmap = {};
        this.heatmapLayers = {};
   },
   
   renderMap(){
     return this.map && this.state.action != 'editingTimeScale';
   },

   render() {
    if(this.renderMap()){
        this.clearMap();
        this.updateHeatmap();
    }

    return (
        <div>
        </div>
     );
  }
});