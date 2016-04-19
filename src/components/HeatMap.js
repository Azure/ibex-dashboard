import Fluxxor from 'fluxxor';
import React, { PropTypes, Component } from 'react';
import {Actions} from '../actions/Actions';
import Leaflet from 'leaflet';
import Tile from 'geotile';
import Rx from 'rx';
import {SERVICES} from '../services/services';
import env_properties from '../../config.json';
import global from '../utils/global';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");
const defaultLat = 20.1463919;
const defaultLong = 2.2705778;
const SENTIMENT_SCALE_INCREMENTS = 15;
const MAGNITUDE_MAX_VALUE = 10;

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
            
            if(props && props.count){
                infoBoxInnerHtml = "<b>{0}</b><br /><ul><li><u>Mentions</u>:{1}</li><li><u>Intensity Level</u>:{2}</li><li><u>Weighting</u>:{3}</li></ul>".format(categoryValue, props.count, props.magnitude, props.weighted);
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
    let defaultZoom = 10;
    
    //this.gradient = new Rainbow();
    //this.gradient.setSpectrum('red', 'yellow', 'green');
    //this.gradient.setNumberRange(SENTIMENT_SCALE_INCREMENTS * -1, SENTIMENT_SCALE_INCREMENTS);
    
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
    let formatter = Actions.constants.TIMESPAN_TYPES[this.state.timespanType];
    
    let url = "{0}{1}/{2}/{3}".format(env_properties.EMOTIONMAPS_BLOB,
                                       this.state.categoryType.toLowerCase(), 
                                       momentToggleFormats(this.state.datetimeSelection, formatter.format, formatter.blobFormat),
                                       tileId);

    SERVICES.getHeatmapTiles(url)
            .subscribe(response => {
                self.heatmap[tileId] = response;
                callback(response);
            }, error => {                
                callback(null);
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
           Object.keys(heatmapTileElement[heatmapElementTileId]).forEach(eventWordText => {
               //Skip the element if the selected keyword doesnt match the event word
               if(self.state.categoryValue && eventWordText.toLowerCase() != self.state.categoryValue.toLowerCase()){
                   return false;
               }
               
               let leafletElement = heatmapTileElement[heatmapElementTileId][eventWordText];
               let heatmapTile = Tile.tileFromTileId(heatmapElementTileId);
               let sentiment = leafletElement['sentiment'];
               
               //I dont like this but currently there's no scale coming back from the aggregation services, so 
               //need to cap the ceiling at 10. This is a hack and need to change it soon.
               //let tileMagnitudeScale = leafletElement['magnitude'] <= MAGNITUDE_MAX_VALUE ? leafletElement['magnitude'] : MAGNITUDE_MAX_VALUE;
               //let colorValueStart = Actions.constants.SENTIMENT_JSON_MAPPING[sentiment];
               //let colorValue = colorValueStart + tileMagnitudeScale;
               //let color =  '#' + self.gradient.colourAt(colorValue);
               
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
      });
      
      if(self.heatmapLayers[layerId]){
         self.heatmapLayers[layerId].addTo(self.map); 
      }
      
      return callback();
    });
  },
  
  style(feature) {
			return {
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7,
				fillColor: this.getColor(feature.properties.magnitude)
			};
 },
 
 // get color depending on population density value
 getColor(d) {
			return d > 1000 ? '#800026' :
			       d > 500  ? '#BD0026' :
			       d > 200  ? '#E31A1C' :
			       d > 100  ? '#FC4E2A' :
			       d > 50   ? '#FD8D3C' :
			       d > 20   ? '#FEB24C' :
			       d > 10   ? '#FED976' :
			                  '#FFEDA0';
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

  render() {
    if(this.map){
        this.clearMap();
        this.updateHeatmap();
    }

    return (
        <div>
        </div>
     );
  }
});