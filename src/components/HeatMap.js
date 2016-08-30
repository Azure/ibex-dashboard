import Fluxxor from 'fluxxor';
import React, { PropTypes, Component } from 'react';
import {Actions} from '../actions/Actions';
import Tile from 'geotile';
import Rx from 'rx';
import {SERVICES} from '../services/services';
import Dialog from 'material-ui/lib/dialog';
import env_properties from '../../config.json';
import global from '../utils/global';
import numeral from 'numeral';
import FlatButton from 'material-ui/lib/flat-button';
import {ActivityFeed} from './ActivityFeed';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");
const defaultLat = 20.1463919;
const defaultLong = 2.2705778;
const rainbowColorCeiling = 1000;
const sentimentFieldName = 'mag_n';
const mentionCountFieldName = 'cnt';
const defaultClusterSize = 40;

export const HeatMap = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getInitialState(){
      this.getFlux().actions.ACTIVITY.load_activity_events();
      
      return{
          latitude: defaultLat,
          longitude: defaultLong,
          openModal: false,
          selectedTileId: false,
          modalTitle: ''
      };
  },

  handleOpen(layerId){
    this.setState({openModal: true, selectedTileId: layerId});
  },

  handleClose(){
    this.setState({openModal: false});
  },
  
  getStateFromFlux: function() {
    return this.getFlux().store("DataStore").getState();
  },
  
  addInfoBoxControl(){
      let info = L.control();
      let self = this;
      
      if(this.map){
          info.onAdd = map => {
			this._div = L.DomUtil.create('div', 'info');
			info.update();
			return this._div;
		  };
          
          info.options = {
            position: 'topleft'  
          },

		  info.update = props => {
            let categoryType = self.state.categoryType;
            let categoryValue = self.state.categoryValue;
            let infoHeaderText = "<h5>{0} Mentions / Sentiment</h5>".format(categoryValue);
            let infoBoxInnerHtml = 'Click a marker to view event details<br>';
            
            Object.keys(Actions.constants.SENTIMENT_COLOR_MAPPING).forEach(element => {
                    infoBoxInnerHtml += "<i class='legend-i' style='background: {0}'></i> <span class='legend-label'>{1}</span><br>".format(Actions.constants.SENTIMENT_COLOR_MAPPING[element], element);
            });
            
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
      if(level >= 0 && level < 30){
          return "small";
      }else if(level >= 30 && level < 55){
          return "medium";
      }else if(level >= 55 && level < 80){
          return "large";
      }else{
          return "xl";
      }
  },
  
  componentDidMount(){
    let latitude = this.state.latitude;
    let longitude = this.state.longitude;
    this.heatmap = {};
    this.tilemap = {};
    let defaultZoom = 5;
    L.Icon.Default.imagePath = "/dist/assets/images";
    this.map = L.map('leafletMap', {zoomControl: false}).setView([latitude, longitude], defaultZoom);
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'dark-v9',
        accessToken: 'pk.eyJ1IjoiZXJpa3NjaGxlZ2VsIiwiYSI6ImNpaHAyeTZpNjAxYzd0c200dWp4NHA2d3AifQ.5bnQcI_rqBNH0rBO0pT2yg'
    }).addTo(this.map);
    
    this.map.addControl(L.control.zoom({position: 'topright'}));
    this.map.selectedTerm = this.state.categoryValue;
    this.map.datetimeSelection = this.state.datetimeSelection;
    var self = this;
    this.map.on('moveend',() => {
      self.viewportChanged();
    });

    this.map.on('zoomend',() => {
      this.clearMap();
      self.viewportChanged();
    });

    this.addClusterGroup();
    this.addInfoBoxControl();
  },

  addClusterGroup(){
      let self = this;

      if(this.map){
          this.markers = L.markerClusterGroup({
                            maxClusterRadius: 120,
                            iconCreateFunction: cluster => {
                                let mentions = 0, maxSentimentLevel = 0;

                                cluster.getAllChildMarkers().forEach(child => {
                                    if(child.feature.properties[mentionCountFieldName]){
                                        mentions += child.feature.properties[mentionCountFieldName];
                                        maxSentimentLevel = Math.max(maxSentimentLevel, child.feature.properties[sentimentFieldName]);
                                    }
                                });

                                let cssClass = "marker-cluster marker-cluster-{0}".format(self.getSentimentCategory((maxSentimentLevel || 0) * 100));

                                return self.customClusterIcon(mentions, cssClass);
                            },
                            singleMarkerMode: true
                        });

            this.markers.on('click', a => {
                //if we're at the leaf level then show the dialog
                if(a.layer.feature.properties.layerId){
                    self.handleOpen(a.layer.feature.properties.layerId);
                }
		    });

            this.map.addLayer(this.markers);
      }
  },

  customClusterIcon(mentions, cssClass){
      let clusterSize = defaultClusterSize;

      if(mentions > 1000 && mentions < 10000){
          clusterSize = 50;
          cssClass += " cluster-size-medium";
      }else if(mentions > 10000 && mentions < 50000){
          clusterSize = 60;
          cssClass += " cluster-size-large";
      }else if(mentions > 50000){
          clusterSize = 70;
          cssClass += " cluster-size-xl";
      }

      return L.divIcon({ html: "<div><span>{0}</span></div>".format(numeral(mentions).format(mentions > 1000 ? '+0.0a' : '0a')), 
                                                         className: cssClass,
                                                         iconSize: L.point(clusterSize, clusterSize) });
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

  mapMarkerFlushCheck(){
      if(this.map.selectedTerm != this.state.categoryValue || this.map.datetimeSelection != this.state.datetimeSelection){
          this.map.datetimeSelection =  this.state.datetimeSelection;
          this.map.selectedTerm = this.state.categoryValue;

          this.clearMap();
      }
  },
  
  updateHeatmap() {
    let self = this;
    
    if(!this.dataStoreValidated()){
        return false;
    }
    
    this.mapMarkerFlushCheck();

    let bounds = self.map.getBounds();
    let zoom = this.map.getZoom();
    let northWest = bounds.getNorthWest();
    let southEast = bounds.getSouthEast();

    let spanningTileIds = Tile.tileIdsForBoundingBox({
                                                      north: northWest.lat, 
                                                      west: northWest.lng, 
                                                      south: southEast.lat, 
                                                      east: southEast.lng
                                                    }, zoom);

    let callback = () => console.log('Finished processing tile(s)');
    
    Rx.Observable.from(spanningTileIds)
                 .subscribe(tile => {
                     self.createLayer(tile, callback);
                 }, error => {
                     console.error('An error occured');
                 }, () => updateDataStore());
  },

  updateDataStore(){
      let aggregateAssociatedTermCnt = {};

      for (let [tileTerms] of this.associatedTerms.values()) {
          Object.keys(tileTerms).forEach(term => {
              let currentAggregatedSize = aggregateAssociatedTermCnt[term] || 0;
              let currentSize = tileTerms[term];
              aggregateAssociatedTermCnt[term] = currentSize + currentAggregatedSize;
          });
      }

      this.getFlux().actions.DASHBOARD.updateAssociatedTerms(aggregateAssociatedTermCnt);
  },
  
  fetchHeatmap(tileId, callback) {
    let self = this;
    //exit the fetch if the tile response is already cached
    if (this.heatmap[tileId]) return false;

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

      //Iterate through all the elemens in the cache for tileId
      self.heatmap[tileId].forEach(heatmapTileElement => {
        Object.keys(heatmapTileElement).forEach(heatmapElementTileId => {               
               let leafletElement = heatmapTileElement[heatmapElementTileId];
               let heatmapTile = Tile.tileFromTileId(heatmapElementTileId);
               let geoJson = self.convertTileToGeoJSON(heatmapTile, leafletElement, layerId);
               
               let heatMapLayer = L.geoJson(geoJson, {});
                        
               self.trackAssociatedTerms(geoJson, tileId);

               if(!self.tilemap[heatmapElementTileId]){
                   self.markers.addLayer(heatMapLayer);
                   self.tilemap[heatmapElementTileId] = true;
               }
        });
      });
      
      return callback();
    });
  },

  /*Place the associated term count in a data structure indexed by layerId*/
  trackAssociatedTerms(geoJsonTile, tileId){
      let self = this;
      let layerAssociations = associatedTerms.get(tileId) || {};

      if(geoJsonTile.properties.associatedTerms){
               geoJsonTile.properties.associatedTerms.map(item => {
                   let term = item.term.toLowerCase();
                   let size = item.cnt;

                   if(layerAssociations[term]){
                       layerAssociations[term] += size;
                   }else{
                       layerAssociations[term] = size;
                   }
               });
      }

      associatedTerms.set(tileId, layerAssociations);
  },

 convertTileToGeoJSON(tile, properties, layerId){
      let tileCentroid = new L.latLngBounds(L.latLng(tile.latitudeSouth, tile.longitudeWest), 
                                                  L.latLng(tile.latitudeNorth, tile.longitudeEast)).getCenter();
      
      let geoJson = new L.Marker(tileCentroid).toGeoJSON();
      geoJson.properties = Object.assign(geoJson.properties, properties, {layerId});
      
      return geoJson;
 },
   
  clearMap(){
       if(this.markers){
         this.markers.clearLayers();
       }

        this.associatedTerms = new Map();
        this.tilemap = {};
        this.heatmap = {};
  },
   
   renderMap(){
     return this.map && this.state.action != 'editingTimeScale';
   },

   render() {
    let contentClassName = "modalContent";

    const modalActions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ];

    if(this.renderMap()){
        this.updateHeatmap();
    }

    return (
        <div>
          <Dialog
            actions={modalActions}
            modal={false}
            contentClassName={contentClassName}
            open={this.state.openModal}
            onRequestClose={this.handleClose} >
                <ActivityFeed />
          </Dialog>
        </div>
     );
  }
});