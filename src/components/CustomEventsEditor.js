import {DataGrid} from './DataGrid';
import React from 'react';
import Fluxxor from 'fluxxor';

const FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin("AdminStore");

export const CustomEventsEditor = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin],

    getInitialState(){
        return {
            locationMap: new Map(),
            rowsToRemove: []
        };
    },
    componentDidMount(){
        let state = this.getFlux().store("AdminStore").getState();
        let locationMap = this.state.locationMap;
        state.locations.forEach(location=>{
            locationMap.set(location.name, location.coordinates);
        });
        this.setState({locationMap});
    },
    getStateFromFlux() {
        return this.getFlux().store("AdminStore").getState();
    },
    getColumns(){
        const locationMap = this.state.locationMap;
        let self = this;
        const locationFieldValidation = input => {
            let validRow = locationMap.has(input.toLowerCase());

            if(!validRow){
                return `${input} is not a place included in the active watchlist.`
            }else{
                return false;
            }
        };

        const languageFieldValidation = input => {
            let validLanguage = self.state.settings.properties.supportedLanguages.indexOf(input) > -1;

            if(!validLanguage){
                return `${input} is not a supported language. Check in site settings to see if this language is available.`
            }else{
                return false;
            }
        };

        return [
            {   editable: false, 
                key: "RowKey", 
                name: "Event ID",
                resizable: false
            },
            {
                editable:true,
                sortable : true,
                filterable: false,
                resizable: true,
                expectedDateFormat: "MM/DD/YYYY HH:mm",
                required: true,
                name: "Event Date(MM/DD/YYYY HH:mm)",
                key: "created_at"
            },
            {
                editable:true,
                sortable : true,
                filterable: true,
                resizable: true,
                validateWith: locationFieldValidation,
                name: "Location",
                key: "geo"
            },
            {
                editable:true,
                sortable : true,
                required: true,
                filterable: true,
                resizable: true,
                name: "Source",
                key: "source"
            },
            {
                editable:true,
                sortable : true,
                filterable: false,
                resizable: true,
                name: "Sourced Link",
                key: "link"
            },
            {
                editable:true,
                sortable : true,
                filterable: true,
                resizable: true,
                required: true,
                name: "Title",
                key: "title"
            },
            {
                editable:true,
                sortable : true,
                filterable: true,
                required: true,
                resizable: true,
                validateWith: languageFieldValidation,
                name: "Language Code",
                key: "language"
            },
            {
                editable:true,
                sortable : true,
                filterable: false,
                resizable: true,
                required: true,
                name: "Event Text",
                key: "message"
            }
        ];
    },
    handleSave(mutatedRows, columns){
        let eventsWithFeatureCollection = []; 
        
        mutatedRows.forEach(event=>{
            const coordinates = this.state.locationMap.get(event.geo);
            if(!coordinates){
                let errMsg = `Failed location lookup for event ${JSON.stringify(event)}`;
                console.error(errMsg);
            }else{
                let eventWithGeo = Object.assign({}, event, {
                                                                featureCollection: {
                                                                    type: "FeatureCollection", 
                                                                    features: [{"type": "Point", "coordinates": coordinates.split(",").map(coord=>parseFloat(coord))}]
                                                                }
                                                              });
                
                delete eventWithGeo.geo;
                eventsWithFeatureCollection.push(eventWithGeo);
            }
        });

        this.getFlux().actions.ADMIN.publish_events(eventsWithFeatureCollection);
    },
    handleRemove(deletedRows){
        const rowsToRemove = deletedRows.map(row=>row.RowKey);
        this.setState({rowsToRemove});
    },
    render(){
        return (
         this.state.locations.length > 0 ? 
            <DataGrid rowHeight={40}
                      minHeight={500}
                      rowKey="RowKey"
                      guidAutofillColumn="RowKey"
                      handleSave={this.handleSave}
                      handleRemove={this.handleRemove}
                      rowsToRemove={this.state.rowsToRemove}
                      columns={this.getColumns()}
                      rows={[]} />
            : <div />
        );
    }
});