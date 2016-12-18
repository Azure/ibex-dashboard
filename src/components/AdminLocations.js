//import {DataGrid} from './DataGrid';
import React from 'react';
import Fluxxor from 'fluxxor';
import {DataGrid} from './DataGrid';
import turfInside from 'turf-inside';
import turfBbox from 'turf-bbox-polygon';
import 'leaflet-area-select';
import L from 'leaflet';
import 'leaflet-geocoder-mapzen';
import 'leaflet-geocoder-mapzen/dist/leaflet-geocoder-mapzen.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/layers-2x.png';
import 'leaflet/dist/images/layers.png';
import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-icon.png';
import '../styles/Admin.css'
import 'leaflet.markercluster';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin("AdminStore");

const styles = {
    settings: {
            input: {
                width: '95%',
                marginLeft: '4px',
                fontSize: '12px'
            },
            row: {
                display:'inline-flex',
                alignItems: 'center',
                width: '100%'
            },
            mapColumn: {
                marginLeft: '13px'
            },
            label: {
                display: 'inline-table'
            },
            locationGridColumn: {
                marginTop: '14px',
                marginLeft: '10px',
                width: '63%'
            }
    }
};

export const AdminLocations = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin],
    getInitialState(){
        return {
            targetBbox: [],
            localAction: false,
            locationsAdded: []
        }
    },
    addLocationsToCluster(locations){
        if(this.markers && locations.length > 0){
            locations.forEach(location=>{
                let locationSplit = location.coordinates.split(",");
                let marker = new L.Marker(L.latLng(parseFloat(locationSplit[1]), parseFloat(locationSplit[0])), {title: location.name})
                marker.bindPopup(location.name);
                this.markers.addLayer(marker);
            });
        }
    },
    addClusterGroup(locations){
      if(this.map){
            this.markers = L.markerClusterGroup({
                            chunkedLoading: true,
                            zoomToBoundsOnClick: true});
          
            this.map.addLayer(this.markers);
      }
    },
    componentDidMount(){
        if(!this.map){
            this.bindLeafletMap(this.state.locations);
            const targetBbox = this.state.settings.properties.targetBbox;
            this.setState({targetBbox});
        }
    },
    refreshMapClusters(){
        if(this.markers){
            this.markers.clearLayers();
            this.addLocationsToCluster(this.state.locations.concat(this.state.locationsAdded));
        }
    },
    bindLeafletMap(locations){
        const defaultLocation = this.state.settings.properties.defaultLocation;
        const defaultZoom = this.state.settings.properties.defaultZoomLevel;
        const bbox = this.state.settings.properties.targetBbox;
        const latitude = defaultLocation[1];
        const longitude = defaultLocation[0];
        L.Icon.Default.imagePath = "http://cdn.leafletjs.com/leaflet-0.7.3/images";
        this.map = L.map('map', {selectArea: true, zoomControl: false});
        this.setView(latitude, longitude, defaultZoom - 1);
        this.map.addControl(L.control.zoom({position: 'bottomleft'}));
        L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'dark-v9',
            accessToken: 'pk.eyJ1IjoiZXJpa3NjaGxlZ2VsIiwiYSI6ImNpaHAyeTZpNjAxYzd0c200dWp4NHA2d3AifQ.5bnQcI_rqBNH0rBO0pT2yg'
        }).addTo(this.map);
        this.addAreaSelectedEventListener();
        this.drawBBox(bbox);
        this.map.selectArea.setShiftKey(false);
        this.addClusterGroup(locations);
        this.addGeocoder(bbox);
    },
    duplicateLocation(locationName){
        const locationFromState = this.state.locations.filter(location => location.name.toLowerCase() === locationName.toLowerCase());

        return (locationFromState.length > 0);
    },
    addGeocoder(bbox){
        if(this.map && bbox && bbox.length === 4){
          if(this.geocoder){
              this.geocoder.removeFrom(this.map);
          }

          let self = this;
           const options = {
               bounds: L.latLngBounds(L.latLng(bbox[1], bbox[0]),  L.latLng(bbox[3], bbox[2])),
               position: 'topright',
               sources: 'gn',
               layers: 'coarse'
            };

            const geocoder = L.control.geocoder(this.state.settings.properties.mapzenApiKey, options);
            geocoder.on('select', e => {
               let locationsAdded = self.state.locationsAdded;
               const localAction = 'changed';
               const selectedLocation = {
                   name: e.feature.properties.name,
                   name_ar: "",
                   population: e.feature.properties.population || 0,
                   coordinates: e.feature.geometry.coordinates.join(","),
                   RowKey: e.feature.properties.id,
                   region: e.feature.properties.region || "",
                   country_iso: e.feature.properties.country_a || ""
               };

               if(!self.duplicateLocation(selectedLocation.name)){
                   locationsAdded.unshift(selectedLocation);
                   self.setState({locationsAdded, localAction});
               }else{
                   alert(`${selectedLocation.name} is already being monitored.`);
               }
               
                geocoder.reset();
            });

            geocoder.addTo(this.map);
            this.geocoder = geocoder;
        }
    },
    setView(latitude, longitude, zoom){
        this.map.setView([latitude, longitude], zoom);
    },
    addAreaSelectedEventListener(){
        if(this.map){
            let self = this;

            this.map.on({
                'areaselected': evt => {
                    const targetBbox = evt.bounds.toBBoxString().split(",");
                    self.drawBBox(targetBbox);
                    const selectedRowKeys = self.locationsOutsideofBbox(turfBbox(targetBbox));
                    self.setState({targetBbox, selectedRowKeys});
                }
          });
        }
    },
    locationsOutsideofBbox(bboxPolygon){
        const pointGeoJsonBase = {
            "type": "Feature",
            "geometry": {
                   "type": "Point"
            }
        };

        const locations = this.state.locations.concat(this.state.locationsAdded);

        return locations.filter(location=>!turfInside( Object.assign({}, pointGeoJsonBase, 
                                                                    {
                                                                        geometry: {
                                                                            "type": "Point",
                                                                            coordinates: location.coordinates.split(",").map(point=>parseFloat(point))
                                                                        }
                                                                    }), 
                                                                  bboxPolygon)
                                            )
                                     .map(location=>location.RowKey);
    },
    drawBBox(bbox){
        if(this.bbox) {
            this.map.removeLayer(this.bbox);
            this.bbox = null;
        }
        if(bbox && bbox.length === 4){
            const bounds = [[bbox[1], bbox[0]], [bbox[3], bbox[2]]];
            // create a teal rectangle
            this.bbox = L.rectangle(bounds, {weight: 2, color: '#0ff', fillOpacity: 0, clickable: false}).addTo(this.map);
            // zoom the map to the rectangle bounds
            this.map.fitBounds(bounds);
            this.addGeocoder(bbox);
        }
    },
    getStateFromFlux() {
        return this.getFlux().store("AdminStore").getState();
    },
    handleLocationsSave(mutatedRows, columns){
        const reducedRows = mutatedRows.map(location=>Object.assign({}, location, {coordinates: location.coordinates && location.coordinates.length > 0 ? location.coordinates.split(",") : []}));
        this.getFlux().actions.ADMIN.save_locations(this.props.siteKey, reducedRows);
    },
    handleRemove(deletedRows){
        const reducedRows = deletedRows.map(location=>Object.assign({}, {RowKey: location.RowKey}));
        this.getFlux().actions.ADMIN.remove_locations(this.props.siteKey, reducedRows);
    },
    render(){
        let state = this.getFlux().store("AdminStore").getState();
        this.refreshMapClusters();

        return (
         this.state.locationGridColumns.length > 0 ? 
                <div className="row">
                    <div className="col-lg-4" style={styles.settings.mapColumn}>
                        <div className="row" style={styles.settings.row}>
                            <label style={styles.settings.label}>Target Bbox</label>
                            <input readOnly value={this.state.targetBbox ? this.state.targetBbox.join(",") : "N/A"} type="text" style={styles.settings.input} className="form-control"/>
                        </div>
                        <div className="row">
                            <div id="map"></div>
                        </div>
                        <div className="row">
                            {
                                this.state.locationsAdded.length > 0 ? `Added ${this.state.locationsAdded.length} location(s) to watchlist.` : undefined
                            }
                        </div>
                    </div>
                    <div className="col-lg-7" style={styles.settings.locationGridColumn}>
                        <div className="row">
                            <DataGrid rowHeight={40}
                                minHeight={450}
                                rowKey="RowKey"
                                handleSave={this.handleLocationsSave}
                                localAction={this.state.localAction}
                                handleRemove={this.handleRemove}
                                rowAddDisabled={true}
                                rowsToMerge={this.state.locationsAdded}
                                selectedRowKeys={this.state.selectedRowKeys || false}
                                columns={this.state.locationGridColumns}
                                rows={state.locations} />
                        </div>
                    </div>
                </div>
           : <div />
        );
    }
});