import Fluxxor from 'fluxxor';
import React from 'react';
import {Actions} from '../actions/Actions';
import weightedMean from '../utils/WeightedMean';
import eachLimit from 'async/eachLimit';
import {SERVICES} from '../services/services';
import numeralLibs from 'numeral';
import L from 'leaflet';
import {getEnvPropValue} from '../utils/Utils.js';
import ProgressBar from 'react-progress-bar-plus';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/layers-2x.png';
import 'leaflet/dist/images/layers.png';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import '../styles/HeatMap.css';
import 'react-progress-bar-plus/lib/progress-bar.css';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");
const PARELLEL_TILE_LAYER_RENDER_LIMIT = 200;
const SENTIMENT_FIELD = 'neg_sentiment';
const TERM_NAME_FIELD = "f1";
const TERM_MENTIONS_FIELD = "f2";
const defaultClusterSize = 40;

export const HeatMap = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getInitialState(){
      let siteKey = this.props.siteKey;
      let defaultLocation = getEnvPropValue(siteKey, process.env.REACT_APP_MAP_LOCATION);
      let locationSplit = defaultLocation.split(',');
      if(locationSplit.length !== 2){
          throw Error("Invalid default location " + defaultLocation);
      }

      return{
          latitude: parseFloat(locationSplit[0]),
          longitude: parseFloat(locationSplit[1]),
          mapProgressPercent: -1,
          intervalTime: 200,
          selectedTileId: false,
          modalTitle: ''
      };
  },
  
  getStateFromFlux: function() {
    return this.getFlux().store("DataStore").getState();
  },
  
  addInfoBoxControl(){
      let info = L.control();
      
      if(this.map){
          info.onAdd = map => {
			this._div = L.DomUtil.create('div', 'info');
			info.update();
			return this._div;
		  };
          
          info.options = {
            position: 'topleft'  
          };

		  info.update = props => {
            let infoHeaderText = "<h5>Sentimentometer</h5>";
            let infoBoxInnerHtml = '<div id="sentimentGraph" />';
            
			this._div.innerHTML = infoHeaderText + infoBoxInnerHtml;
		  };

		  info.addTo(this.map);
      }
  },

  addBreadCrumbControl(){
      let info = L.control();

      if(this.map){
          info.onAdd = map => {
			this._div = L.DomUtil.create('div', 'info');
			
			return this._div;
		  };
          
          info.options = {
            position: 'topleft'  
          };

		  info.update = props => {
            let selectionType = this.state.categoryType;
            let mainSearchEntity = this.state.categoryValue;
            let associatedTerms = this.state.associatedKeywords;
            let numberOfDisplayedTerms = 0;
            let maxTerms = 4;
            let infoHeaderText = "<h5>Review Your Selection Below</h5>";
            let infoBoxInnerHtml = `<span class="filterLabelType">
                                        ${selectionType}:
                                    </span>
                                    <span class="label filterLabel">
                                        ${mainSearchEntity}
                                    </span>
                                    <span class="filterSeperation">+</span>
                                    <span class="filterLabelType">
                                        Term(s):
                                    </span>`;
   
            for (var [term, value] of props.entries()) {
                    if(value.enabled && term !== "none" && ++numberOfDisplayedTerms > maxTerms){
                        infoBoxInnerHtml += `<span class="filterLast">and ${props.size - numberOfDisplayedTerms} Others</span>`;
                        break;
                    }else if(value.enabled && term !== "none"){
                         infoBoxInnerHtml += `${numberOfDisplayedTerms > 1 ? '<span class="filterSeperation">+</span>' : ''}
                                              <span class="label filterLabel">
                                                ${term}
                                              </span>`;
                    }
            }
            
			this._div.innerHTML = infoHeaderText + infoBoxInnerHtml;
		  };

		  info.addTo(this.map);
          this.breadCrumbControl = info;
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
    this.tileSummationMap = new Map();
    this.tilemap = new Map();
    this.status = "ready";
    let defaultZoom = getEnvPropValue(siteKey, process.env.REACT_APP_MAP_ZOOM);
    L.Icon.Default.imagePath = "http://cdn.leafletjs.com/leaflet-0.7.3/images";
    this.map = L.map('leafletMap', {zoomControl: false});
    this.map.addControl(L.control.zoom({position: 'topright'}));
    this.map.setView([latitude, longitude], defaultZoom);
    this.map.coordinates = [longitude, latitude];
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 17,
        minZoom: 6,
        id: 'dark-v9',
        accessToken: 'pk.eyJ1IjoiZXJpa3NjaGxlZ2VsIiwiYSI6ImNpaHAyeTZpNjAxYzd0c200dWp4NHA2d3AifQ.5bnQcI_rqBNH0rBO0pT2yg'
    }).addTo(this.map);
    
    this.map.selectedTerm = this.state.categoryValue;
    this.map.datetimeSelection = this.state.datetimeSelection;

    this.map.on('moveend',() => {
      this.viewportChanged();
    });

    this.addClusterGroup();
    this.addInfoBoxControl();
    this.addBreadCrumbControl();
  },

  createSentimentDistributionGraph(){
     if(!this.sentimentIndicatorGraph){
         this.sentimentIndicatorGraph = window.AmCharts.makeChart("sentimentGraph", {
            "type": "serial",
            "rotate": true,
            "theme": "dark",
            "autoMargins": false,
            "marginTop": 10,
            "marginLeft": 70,
            "marginBottom": 30,
            "marginRight": 25,
            "dataProvider": [ {
                "category": "Avg<br>Sentiment",
                "full": 100,
                "limit": 15,
                "bullet": 15
            } ],
            "valueAxes": [ {
                "maximum": 100,
                "stackType": "regular",
                "gridAlpha": 0,
                "labelFunction": (value, formattedValue, valueAxis) =>{ if(value === 0) return "Positive"; else if(value === 50) return "Neautral"; else if(value === 100) return "Negative";}
            } ],
            "startDuration": 1,
            "graphs": [ {
                "valueField": "full",
                "showBalloon": false,
                "type": "column",
                "lineAlpha": 0,
                "fillAlphas": 0.8,
                "fillColors": [ "#337ab7", "#f6d32b", "#fb2316" ],
                "gradientOrientation": "horizontal",
            }, {
                "clustered": false,
                "columnWidth": 0.5,
                "fillAlphas": 1,
                "lineColor": "rgb(47, 64, 141)",
                "stackable": false,
                "type": "column",
                "valueField": "bullet"
            }, {
                "columnWidth": 0.7,
                "lineColor": "rgb(46, 189, 89)",
                "lineThickness": 3,
                "noStepRisers": true,
                "stackable": false,
                "type": "step",
                "valueField": "limit"
            } ],
            "columnWidth": 1,
            "categoryField": "category",
            "categoryAxis": {
                "gridAlpha": 0,
                "position": "left"
            }
            } );
     }
  },

  addClusterGroup(){
      let self = this;

      if(this.map){
          this.markers = L.markerClusterGroup({
                            maxClusterRadius: 120,
                            chunkedLoading: true,
                            iconCreateFunction: cluster => {
                                let maxSentimentLevel = 0, totalMentions = cluster.getAllChildMarkers().reduce((prevTotal, child) => {
                                        maxSentimentLevel = Math.max(maxSentimentLevel, child.feature.properties[SENTIMENT_FIELD]);

                                        return child.feature.properties.mentionCount + prevTotal;
                                }, 0);

                                let cssClass = "marker-cluster marker-cluster-{0}".format(self.getSentimentCategory((maxSentimentLevel || 0) * 100));

                                return self.customClusterIcon(totalMentions, cssClass);
                            },
                            singleMarkerMode: true
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

      return L.divIcon({ html: "<div><span>{0}</span></div>".format(numeralLibs(mentions).format(mentions > 1000 ? '+0.0a' : '0a')), 
                                                         className: cssClass,
                                                         iconSize: L.point(clusterSize, clusterSize) });
  },
  
  viewportChanged() {
    if (this.map) {
        this.viewPortChanged = true;
        this.updateHeatmap();
    }
  },  
  
  dataStoreValidated(){
      return this.state && this.state.datetimeSelection
                        && this.state.timespanType
                        && this.state.categoryValue
   },

  mapMarkerFlushCheck(){
      if(this.map.selectedTerm !== this.state.categoryValue || this.map.datetimeSelection !== this.state.datetimeSelection || this.state.renderMap || this.viewportChanged){
          this.map.datetimeSelection =  this.state.datetimeSelection;
          this.map.selectedTerm = this.state.categoryValue;

          this.clearMap();
      }
  },

  sortTerms(locationA, locationB){
      if(locationB[1].mentions > locationA[1].mentions){ 
         return 1;
      }else if(locationB[1].mentions < locationA[1].mentions){
          return -1;
      }

      if(locationA[0] > locationB[0]){
          return 1;
      }else if(locationA[0] < locationB[1]){
          return -1;
      }

      return 0;
  },

  updateDataStore(errors, bbox){
      let aggregatedAssociatedTermMentions = new Map(), aggregatedLocations = new Map();

      let weightedSentiment = weightedMean(this.weightedMeanValues) * 100;
      //bind the weigthed sentiment to the bullet chart data provider
      this.sentimentIndicatorGraph.dataProvider[0].limit = weightedSentiment;
      this.sentimentIndicatorGraph.dataProvider[0].bullet = weightedSentiment;
      this.sentimentIndicatorGraph.validateData();

      for (let tileTerms of this.tileSummationMap.values()) {
          let tileMentionCount = aggregatedLocations.get(tileTerms.location) || 0;
          aggregatedLocations.set(tileTerms.location, {"mentions": tileMentionCount + tileTerms.mentionCount, "enabled": true});

          if(tileTerms.edges){
            tileTerms.edges.forEach(term => {
                let totMentions = 0, termLookup = aggregatedAssociatedTermMentions.get(term[TERM_NAME_FIELD]);
                if(termLookup){
                    totMentions = termLookup.mentions;
                }

                aggregatedAssociatedTermMentions.set(term[TERM_NAME_FIELD].toLowerCase(), {"mentions": totMentions + term[TERM_MENTIONS_FIELD], "enabled": true});
            });
          }
      }

      //merge the disabled associated keys as long as the map view hasnt changed.
      if(!this.viewPortChanged){
          aggregatedAssociatedTermMentions = new Map([...this.state.associatedKeywords, ...aggregatedAssociatedTermMentions]);
      }

      this.viewPortChanged = false;
      this.status = 'loaded';
      //this.setProgressPercent(100);
      //sort the associated terms by mention count.
      let sortedEdgeMap = new Map([...aggregatedAssociatedTermMentions.entries()].sort(this.sortTerms));
      this.getFlux().actions.DASHBOARD.updateAssociatedTerms(sortedEdgeMap, bbox);
      this.breadCrumbControl.update(sortedEdgeMap);
  },

  filterSelectedAssociatedTerms(){
      let filteredTerms = [];

      if(!this.viewPortChanged){
        for (var [term, value] of this.state.associatedKeywords.entries()) {
            if(value.enabled){
                filteredTerms.push(term);
            }
        }
      }
      
      return filteredTerms;
  },

  moveMapToNewLocation(location, zoom){
      let originalLocation = this.map.coordinates;

      if(location && location.length > 0 && location[0] !== originalLocation[0] && location[1] !== originalLocation[1]){
          this.map.setView([location[1], location[0]], zoom);
          this.map.coordinates = [location[0], location[1]];
      } 
  },
  
  updateHeatmap() {    
    if(!this.dataStoreValidated()){
        return false;
    }
    
    this.createSentimentDistributionGraph();
    this.mapMarkerFlushCheck();
    this.status = "loading";
    let siteKey = this.props.siteKey;
    this.moveMapToNewLocation(this.state.selectedLocationCoordinates, this.map.getZoom());
    let bounds = this.map.getBounds();
    let zoom = this.map.getZoom();
    let northWest = bounds.getNorthWest();
    let southEast = bounds.getSouthEast();
    let bbox = [northWest.lng, southEast.lat, southEast.lng, northWest.lat];
    let self = this;
    //this.setProgressPercent(0);
    this.weightedMeanValues = [];
    this.tileSummationMap.clear();

    SERVICES.getHeatmapTiles(siteKey, this.state.timespanType, zoom, this.state.categoryValue, this.state.datetimeSelection, bbox, this.filterSelectedAssociatedTerms(), [this.state.selectedLocationCoordinates], 
            (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    self.createLayers(body, errors => self.updateDataStore(errors, bbox))
                }else{
                    this.status = 'failed';
                    console.error(`[${error}] occured while processing tile request [${this.state.categoryValue}, ${this.state.datetimeSelection}, ${bbox}]`);
                }
            });
  },
  
  createLayers(response, completedCB) {
    let self = this;

    if(response && response.data){
        let graphQLResponse = response.data[Object.keys(response.data)[0]];
        if(graphQLResponse.features){
            eachLimit(graphQLResponse.features, PARELLEL_TILE_LAYER_RENDER_LIMIT, (tileFeature, cb) => {
                 self.processMapCluster(tileFeature, cb);
            }, completedCB);
        }
    }
  },

  processMapCluster(tileFeature, callback){
       let tileId = tileFeature.properties.tileId || "N/A";
       let cachedTileMarker = this.tilemap.get(tileId);

       if(!cachedTileMarker && tileFeature.properties.tileId){
           cachedTileMarker = this.addTileFeatureToMap(tileFeature);
       }

       if(Array.isArray(tileFeature.properties.edges) && tileFeature.properties.edges.length > 0){
           this.tileSummationMap.set(tileId, {"edges": tileFeature.properties.edges});
       }
       
       this.weightedMeanValues.push([tileFeature.properties[SENTIMENT_FIELD], tileFeature.properties.mentionCount]);

       callback();
  },
  
  addTileFeatureToMap(tileFeature){
       try{
            let mapMarker = this.featureToLeafletMarker(tileFeature);
            this.tilemap.set(tileFeature.properties.tileId, mapMarker);
            let heatMapLayer = L.geoJson(mapMarker, {});
            this.markers.addLayer(heatMapLayer);
            
            return heatMapLayer;
        }catch(e){
           console.error(`An error occured trying to grab the tile details. [${e}]`);
       }
  },

 featureToLeafletMarker(tileFeature){
      if(tileFeature && tileFeature.coordinates && Array.isArray(tileFeature.coordinates)){
        let leafletMarker = new L.Marker(L.latLng(tileFeature.coordinates[1], tileFeature.coordinates[0])).toGeoJSON();
            leafletMarker.properties = Object.assign({}, leafletMarker.properties || {}, tileFeature.properties);
        
        return leafletMarker;
      }else{
          throw new Error(`invalid tile feature error[${JSON.stringify(tileFeature)}]`);
      }
 },
   
 clearMap(){
       if(this.markers){
         this.markers.clearLayers();
       }
        
       this.tilemap.clear();
  },
   
  renderMap(){
     return this.map && this.state.renderMap && this.status !== "loading";
  },

  render() {
    let progressPercentage = this.status === "loaded" ? 100 : -1;

    if(this.renderMap()){
        this.updateHeatmap();
        progressPercentage = 0;
    }

    return (
        <div>
          <ProgressBar  percent={progressPercentage} 
                        intervalTime={this.state.intervalTime}
                        autoIncrement={true}
                        className="react-progress-bar-percent-override"
                        spinner="right" />
        </div>
     );
  }
});