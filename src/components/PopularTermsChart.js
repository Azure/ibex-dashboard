import Fluxxor from 'fluxxor';
import React from 'react';
import numeralLibs from 'numeral';
import 'amcharts3/amcharts/amcharts';
import 'amcharts3/amcharts/serial';
import 'amcharts3/amcharts/pie';
import 'amcharts3-export';
import 'amcharts3-export/export.css';
import 'amcharts3/amcharts/themes/dark';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore"),
      chartDivReference = "popularTermsPieDiv";

const DEFAULT_LANGUAGE = "en";

export const PopularTermsChart = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getStateFromFlux() {
    return this.getFlux().store("DataStore").getState();
  },

  getInitialState(){
      return {
          selectedEdge: undefined
      };
  },

  initializeGraph(){
    let self = this;

    this.popularTermsChart = window.AmCharts.makeChart(chartDivReference, {
        "theme": "dark",
        "type": "pie",
        "startDuration": 1,
        "balloonText": "[[term]]: <b>[[mentionFmt]]</b>  mentions",
        "labelColor": "#fff",
        "radius": 100,
        "labelRadius": 1,
        "innerRadius": 50,
        "colorField": "color",
        "marginLeft":0,
        "marginBottom":0,
        "marginTop":0,
        "marginRight":0,
        "gradientRatio": [-0.4, -0.4, -0.4, -0.4, -0.4, -0.4, 0, 0.1, 0.2, 0.1, 0, -0.2, -0.5],
        "outlineAlpha": 0,
        "valueField": "mentions",
        "labelText": "[[displayLabel]] <br> [[mentionFmt]]",
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
            "text": "TERMS",
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

    this.popularTermsChart.addListener("clickSlice", e => {
            if(e.dataItem.dataContext){
               self.getFlux().actions.DASHBOARD.reloadVisualizationState(this.props.siteKey, self.state.datetimeSelection, 
                                                                        self.state.timespanType, self.state.dataSource, 
                                                                        e.dataItem.dataContext);
            }
    });
 },

 refreshChart(summaryTerms){
    let maxAxesDisplayLabelChars = 16;
    this.popularTermsChart.dataProvider = [];
    const state = this.getStateFromFlux();
    const edgeMap = state.allEdges.get(DEFAULT_LANGUAGE);

    if(summaryTerms && summaryTerms.length > 0){
        this.popularTermsChart.dataProvider = summaryTerms.map(term => {
            const edge = edgeMap.get(term.name.toLowerCase());
            let termName = edge['name_'+state.language];
            let color = state.colorMap.get(edge.name);
            let displayLabel = termName.length > maxAxesDisplayLabelChars ? termName.substring(0, maxAxesDisplayLabelChars) : termName;
            let mentionFmt = numeralLibs(term.mentions).format(term.mentions > 1000 ? '+0.0a' : '0a');
            return Object.assign({}, edge, {displayLabel: displayLabel, term: termName, mentions: term.mentions, mentionFmt: mentionFmt, color: color});
        });

        if(this.popularTermsChart.valueAxes && this.popularTermsChart.valueAxes.length > 0){
            this.popularTermsChart.valueAxes[0].title = "Top Mentions for {0}".format(this.props.timespan);
        }
    }

    this.popularTermsChart.validateData();
 },

 hasChanged(nextProps, propertyName){
      if(Array.isArray(nextProps[propertyName])){
          return nextProps[propertyName].join(",") !== this.props[propertyName].join(",");
      }

      if(this.props[propertyName] && nextProps[propertyName] && nextProps[propertyName] !== this.props[propertyName]){
          return true;
      }

      return false;
 },

 componentDidMount(){
    const {popularTerms} = this.getStateFromFlux();

    if(!this.popularTermsChart){
        this.initializeGraph();
        this.refreshChart(popularTerms);
    }
 },

 componentWillReceiveProps(nextProps){
    const {popularTerms} = this.getStateFromFlux();

    let hasTimeSpanChanged = this.hasChanged(nextProps, "timespan");
    if((this.hasChanged(nextProps, "mainEdge") && this.props.edgeType === "Term") || hasTimeSpanChanged || this.hasChanged(nextProps, "dataSource") || this.hasChanged(nextProps, "language")){
        this.refreshChart(popularTerms);
    }
 },

 render() { 
    return (
        <div>
        </div>
     );
   }
});