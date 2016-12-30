import Fluxxor from 'fluxxor';
import React from 'react';
import numeralLibs from 'numeral';
import 'amcharts3/amcharts/amcharts';
import 'amcharts3/amcharts/serial';
import 'amcharts3/amcharts/pie';
import 'amcharts3-export';
import 'amcharts3-export/export.css';
import 'amcharts3/amcharts/themes/dark';

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
        "pullOutRadius": 0,
        "radius": 100,
        "labelRadius": 1,
        "marginLeft":0,
        "marginBottom":0,
        "marginTop":0,
        "marginRight":0,
        "innerRadius": 50,
        "gradientRatio": [-0.4, -0.4, -0.4, -0.4, -0.4, -0.4, 0, 0.1, 0.2, 0.1, 0, -0.2, -0.5],
        "outlineAlpha": 0,
        "valueField": "mentions",
        "labelText": "[[displayLabel]] - [[mentionFmt]]",
        "titleField": "displayLabel",
        "export": {
            "enabled": true
        },
        "allLabels": [{
            "text": "TOP 5",
            "bold": true,
            "size": 16,
            "color": "#e6e7e9",
            "x": 0,
            "align": "center",
            "y": "35%"
        },
        {
            "y": "47%",
            "align": "center",
            "size": 16,
            "bold": true,
            "text": "PLACES",
            "color": "#e6e7e9"
        },
        {
            "y": "57%",
            "align": "center",
            "size": 10,
            "bold": false,
            "text": "BY MENTIONS",
            "color": "#e6e7e9"
        }]
    });

    this.popularLocationsChart.addListener("clickSlice", e => {
        if(e.dataItem.dataContext){
              self.getFlux().actions.DASHBOARD.reloadVisualizationState(this.props.siteKey, self.state.datetimeSelection, 
                                                                        self.state.timespanType, self.state.dataSource, 
                                                                        e.dataItem.dataContext);
        }
    });
 },

 refreshChart(locations, lang){
    let maxAxesDisplayLabelChars = 16;
    let dataProvider = [];
    const state = this.getStateFromFlux();
    const edgeMap = state.allEdges.get(DEFAULT_LANGUAGE);

    locations.forEach(location => {
              const edge = edgeMap.get(location.name.toLowerCase());
              const label = edge['name_'+lang];
              let mentions = location.mentions;
              let population = numeralLibs(location.population).format(location.population > 1000 ? '+0.0a' : '0a');
              let displayLabel = label.length > maxAxesDisplayLabelChars ? label.substring(0, maxAxesDisplayLabelChars) : label;
              let mentionFmt = numeralLibs(mentions).format(mentions > 1000 ? '+0.0a' : '0a');
              dataProvider.push(Object.assign({}, edge, {displayLabel: displayLabel, term: label, mentions: mentions, category: "Location",
                                 mentionFmt: mentionFmt, color: '#ccc', population: population}));
    });

    this.popularLocationsChart.dataProvider = dataProvider;
    this.popularLocationsChart.validateData();
 },

  componentWillReceiveProps(nextProps){
      const {popularLocations} = this.getStateFromFlux();

      if(!this.popularLocationsChart){
          this.initializeGraph();
          this.refreshChart(popularLocations, nextProps.language);
      }else if(this.props.datetimeSelection !== nextProps.datetimeSelection || this.props.dataSource !== nextProps.dataSource 
            || this.props.language !== nextProps.language){
          this.refreshChart(popularLocations, nextProps.language);
      }
  },
  
  render() {
    return (
        <div>
        </div>
     );
   }
});