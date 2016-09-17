import Fluxxor from 'fluxxor';
import React, { PropTypes, Component } from 'react';
import {Actions} from '../actions/Actions';
import Tile from 'geotile';
import eachLimit from 'async/eachLimit';
import {SERVICES} from '../services/services';
import Dialog from 'material-ui/lib/dialog';
import env_properties from '../../config.json';
import global from '../utils/global';
import numeral from 'numeral';
import FlatButton from 'material-ui/lib/flat-button';
import {ActivityFeed} from './ActivityFeed';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");
const maxRequestLimit = 400;
const sentimentFieldName = 'mag_n';
const mentionCountFieldName = 'cnt';
const defaultClusterSize = 40;

export const HeatMap = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getInitialState(){
      let siteKey = this.props.siteKey;
      this.getFlux().actions.ACTIVITY.load_activity_events();
      let defaultLatitude = getEnvPropValue(siteKey, "MAP_LAT");
      let defaultLongitude = getEnvPropValue(siteKey, "MAP_LONG");
      
      return{
          latitude: defaultLatitude,
          longitude: defaultLongitude,
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
    let siteKey = this.props.siteKey;
    let latitude = this.state.latitude;
    let longitude = this.state.longitude;
    this.loadedTileBuckets = new Map();
    this.visibleClusters = new Set();
    this.associatedTerms = new Map();
    this.tilemap = new Map();
    let defaultZoom = getEnvPropValue(siteKey, "MAP_ZOOM");
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

    this.map.on('moveend',() => {
      this.viewportChanged();
    });

    this.map.on('zoomend',() => {
      this.clearMap();
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
                        && this.state.categoryValue
   },

  mapMarkerFlushCheck(){
      if(this.map.selectedTerm != this.state.categoryValue || this.map.datetimeSelection != this.state.datetimeSelection || this.state.renderMap){
          this.map.datetimeSelection =  this.state.datetimeSelection;
          this.map.selectedTerm = this.state.categoryValue;

          this.clearMap();
      }
  },
  
  updateHeatmap() {    
    if(!this.dataStoreValidated()){
        return false;
    }
    
    this.mapMarkerFlushCheck();

    let bounds = this.map.getBounds();
    let zoom = this.map.getZoom();
    let northWest = bounds.getNorthWest();
    let southEast = bounds.getSouthEast();

    let spanningTileIds = Tile.tileIdsForBoundingBox({
                                                      north: northWest.lat, 
                                                      west: northWest.lng, 
                                                      south: southEast.lat, 
                                                      east: southEast.lng
                                                    }, zoom);

    eachLimit(spanningTileIds, maxRequestLimit, this.createLayer, this.updateDataStore);
  },

  updateDataStore(){
      let aggregateAssociatedTermCnt = {};

      for (let tileTerms of this.associatedTerms.values()) {
          Object.keys(tileTerms).forEach(term => aggregateAssociatedTermCnt[term] = aggregateAssociatedTermCnt[term] || 0 + tileTerms[term]);
      }

      this.getFlux().actions.DASHBOARD.updateAssociatedTerms(aggregateAssociatedTermCnt);
  },
  
  fetchHeatmap(tileId, callback) {
    let self = this;
    let siteKey = this.props.siteKey;
    let cachedTileBucket = this.loadedTileBuckets.get(tileId);

    if (cachedTileBucket) return callback(this.shouldFilterCachedTile(cachedTileBucket, tileId));

    SERVICES.getHeatmapTiles(siteKey, this.state.categoryType, this.state.timespanType, this.state.categoryValue, this.state.datetimeSelection, tileId)
            .subscribe(response => {
                callback(response);
            }, error => {
                callback([]);
            });
  },

  shouldFilterCachedTile(parentTileChildren, parentTileId){
      let self = this;

      if(Array.isArray(parentTileChildren)){
          parentTileChildren.forEach(childTileId => self.processMapCluster(parentTileId, childTileId, {}, {}));
      }

      return [];
  },
  
  createLayer(tileId, callback) {
    let self = this;
    let dataStore = this.getFlux().store("DataStore").dataStore;
    let layerId = this.buildLayerId(tileId, dataStore);

    this.fetchHeatmap(tileId, response => {
      response.forEach(heatmapTileElement => {
        Object.keys(heatmapTileElement).forEach(heatmapElementTileId => self.processMapCluster(tileId, heatmapElementTileId, heatmapTileElement[heatmapElementTileId], layerId));
      });
      
      return callback();
    });
  },

  processMapCluster(bucketTileId, tileId, tilePayload, layerId){
       let tileGeoJson = this.tilemap.get(tileId);

       if(!tileGeoJson && tilePayload){
           tileGeoJson = this.addGeoJsonTileToMap(tileId, tilePayload, layerId, bucketTileId);
       }

       let filterCluster = this.filterMapCluster(tileGeoJson, tileId);

       if(!this.visibleClusters.has(tileId) && !filterCluster){
           this.visibleClusters.add(tileId);
           this.markers.addLayer(tileGeoJson);
       }else if(filterCluster){
           this.visibleClusters.delete(tileId);
           this.markers.removeLayer(tileGeoJson);
       }
  },

  addGeoJsonTileToMap(tileId, tilePayload, layerId, bucketTileId){
       try{
            let heatmapTile = Tile.tileFromTileId(tileId);
            let tileBucketCache = this.loadedTileBuckets.get(bucketTileId) || [];
            tileBucketCache.push(tileId);

            this.loadedTileBuckets.set(bucketTileId, tileBucketCache);
            let geoJson = this.convertTileToGeoJSON(heatmapTile, tilePayload, layerId);
            let heatMapLayer = L.geoJson(geoJson, {});
            this.tilemap.set(tileId, heatMapLayer);
            this.trackAssociatedTerms(geoJson, tileId);

        return heatMapLayer;
       }catch(e){
           console.error("An error occured trying to grab the tile details.");
       }
  },

  /*Place the associated term count in a data structure indexed by layerId*/
  trackAssociatedTerms(geoJsonTile, tileId){
      let layerAssociations = this.associatedTerms.get(tileId) || {};

      if(geoJsonTile.properties.associatedTerms){
               geoJsonTile.properties.associatedTerms.forEach(termMentions =>  {
                   let term = Object.keys(termMentions)[0];
                   layerAssociations[term] = layerAssociations[term] || 0 + termMentions[term];
               });

               this.associatedTerms.set(tileId, layerAssociations);
      }
  },

 convertTileToGeoJSON(tile, properties, layerId){
      let tileCentroid = new L.latLngBounds(L.latLng(tile.latitudeSouth, tile.longitudeWest), 
                                                  L.latLng(tile.latitudeNorth, tile.longitudeEast)).getCenter();
      
      let geoJson = new L.Marker(tileCentroid).toGeoJSON();
      geoJson.properties = Object.assign(geoJson.properties, properties, {layerId});
      
      return geoJson;
 },

 filterMapCluster(geoJsonTile, tileId) {
    let termFilters = this.state.filteredTerms;
    let layerAssociations = this.associatedTerms.get(tileId);

    if(Object.keys(termFilters).length == 0){
        return false;
    }

    return Object.keys(layerAssociations || {})
                 .filter(key => termFilters[key])
                 .length > 0;
 },
   
  clearMap(){
       if(this.markers){
         this.markers.clearLayers();
       }

        this.associatedTerms.clear();
        this.tilemap.clear();
        this.visibleClusters.clear();
        this.loadedTileBuckets.clear();
  },
   
   renderMap(){
     return this.map && this.state.renderMap;
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