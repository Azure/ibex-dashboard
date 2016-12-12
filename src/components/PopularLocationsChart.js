import Fluxxor from 'fluxxor';
import React from 'react';
import numeralLibs from 'numeral';
import {SERVICES} from '../services/services';
import {Actions} from '../actions/Actions';
import 'amcharts3/amcharts/amcharts';
import 'amcharts3/amcharts/serial';
import 'amcharts3/amcharts/pie';
import 'amcharts3-export';
import 'amcharts3-export/export.css';
import 'amcharts3/amcharts/themes/dark';


const MAX_ZOOM = 15;
const DEFAULT_LANGUAGE = "en";
const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore"),
      chartDivReference = "popularLocationsPieDiv";

export const PopularLocationsChart = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getStateFromFlux: function() {
    return this.getFlux().store("DataStore").getState();
  },

  initializeGraph(){
    let self = this;

    this.popularLocationsChart = window.AmCharts.makeChart(chartDivReference, {
        "theme": "dark",
        "type": "pie",
        "startDuration": 1,
        "balloonText": "[[term]]: <b>[[mentionFmt]]</b>  mentions<br>Est Pop: <b>[[population]]</b> people",
        "labelColor": "#fff",
        "radius": 70,
        "pullOutRadius": 0,
        "labelRadius": 1,
        "innerRadius": 22,
        "gradientRatio": [-0.4, -0.4, -0.4, -0.4, -0.4, -0.4, 0, 0.1, 0.2, 0.1, 0, -0.2, -0.5],
        "outlineAlpha": 0,
        "valueField": "mentions",
        "labelText": "[[displayLabel]] - [[mentionFmt]]",
        "titleField": "displayLabel",
        "export": {
            "enabled": true
        },
        "allLabels": [{
            "text": "Top 5 Locations",
            "bold": true,
            "size": 12,
            "color": "#fff",
            "x": 0,
            "align": "center",
            "y": 200
        }]
    });

    this.popularLocationsChart.addListener("clickSlice", e => {
        if(e.dataItem.dataContext){
              let entity = {
                  "type": "Location",
                  "name": e.dataItem.dataContext.name,
                  "coordinates": e.dataItem.dataContext.coordinates
              };
              self.getFlux().actions.DASHBOARD.changeSearchFilter(entity, this.props.siteKey);
        }
    });
 },

 refreshChart(locations, lang){
    let maxAxesDisplayLabelChars = 16;
    let dataProvider = [];

    locations.forEach(location => {
              let label = location.properties['name_'+lang];
              let mentions = location.properties.mentions;
              let coordinates = location.coordinates;
              let population = numeralLibs(location.properties.population).format(location.properties.population > 1000 ? '+0.0a' : '0a');
              let displayLabel = label.length > maxAxesDisplayLabelChars ? label.substring(0, maxAxesDisplayLabelChars) : label;
              let mentionFmt = numeralLibs(mentions).format(mentions > 1000 ? '+0.0a' : '0a');
              dataProvider.push(Object.assign({}, location.properties, {coordinates: coordinates, population: population,
                                 displayLabel: displayLabel, term: label, category: "Location",
                                 mentions: mentions, mentionFmt: mentionFmt, color: '#ccc'}));
    });

    this.popularLocationsChart.dataProvider = dataProvider;
    this.popularLocationsChart.validateData();
 },

 updateChart(period, timespanType, dataSource){
     let self = this;

     SERVICES.getMostPopularPlaces(this.props.siteKey, period, timespanType, DEFAULT_LANGUAGE, MAX_ZOOM, Actions.DataSources(dataSource), (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    if(body && body.data && body.data.popularLocations && body.data.popularLocations.features){
                        let popularLocations =  body.data.popularLocations.features.map(location =>{
                            self.state.settings.properties.supportedLanguages.forEach(lang => {
                                location.properties['name_'+lang] = self.state.settings.properties.edgesByLanguages[location.properties.location.toLowerCase()][lang];
                            });
                            location.properties['name'] = self.state.settings.properties.edgesByLanguages[location.properties.location.toLowerCase()]['en'];
                            return location;
                        });             
                        self.refreshChart(popularLocations, self.props.language);
                    }

                }else{
                    console.error(`[${error}] occured while processing tile request [${this.state.categoryValue.name}, ${this.state.datetimeSelection}`);
                }
      });
  },

  componentWillReceiveProps(nextProps){
      if(!this.popularLocationsChart){
          this.initializeGraph();
          this.updateChart(nextProps.datetimeSelection, nextProps.timespanType, nextProps.dataSource);
      }else if(this.props.datetimeSelection !== nextProps.datetimeSelection || this.props.dataSource !== nextProps.dataSource 
            || this.props.language !== nextProps.language){
          this.updateChart(nextProps.datetimeSelection, nextProps.timespanType, nextProps.dataSource);
      }
  },
  
  render() {
    return (
        <div>
        </div>
     );
   }
});