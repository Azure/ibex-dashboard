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

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore"),
      chartDivReference = "popularTermsPieDiv";

export const PopularTermsChart = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getStateFromFlux: function() {
    return this.getFlux().store("DataStore").getState();
  },

  getInitialState: function(){
      return {
          selectedEdge: undefined
      };
  },

  initializeGraph: function(){
    let self = this;

    this.popularTermsChart = window.AmCharts.makeChart(chartDivReference, {
        "theme": "dark",
        "type": "pie",
        "startDuration": 1,
        "balloonText": "[[term]]: <b>[[mentionFmt]]</b>  mentions",
        "labelColor": "#fff",
        "radius": 70,
        "labelRadius": 1,
        "marginLeft": 20,
        "innerRadius": 22,
        "colorField": "color",
        "gradientRatio": [-0.4, -0.4, -0.4, -0.4, -0.4, -0.4, 0, 0.1, 0.2, 0.1, 0, -0.2, -0.5],
        "outlineAlpha": 0,
        "valueField": "mentions",
        "labelText": "[[displayLabel]] <br> [[mentionFmt]]",
        "titleField": "displayLabel",
        "export": {
            "enabled": true
        },
        "allLabels": [{
            "text": "Top 5 Terms",
            "bold": true,
            "size": 12,
            "color": "#fff",
            "x": 0,
            "align": "center",
            "y": 200
        }]
 });

    this.popularTermsChart.addListener("clickSlice", e => {
            if(e.dataItem.dataContext){
                let entity = {
                    "type": "Term",
                    "name": e.dataItem.dataContext.term
                };
                self.getFlux().actions.DASHBOARD.changeSearchFilter(entity, this.props.siteKey);
            }
        });
 },

 refreshChart: function(summaryTerms){
    let maxAxesDisplayLabelChars = 16;
    let colorMap = new Map();
    this.popularTermsChart.dataProvider = [];
    let sliceColors = ['#fdd400', '#84b761', '#b6d2ff', '#CD0D74', '#2f4074', '#7e6596'];
    
    if(summaryTerms && summaryTerms.length > 0){
        this.popularTermsChart.dataProvider = summaryTerms.map(term => {
            let color = sliceColors.pop();
            let displayLabel = term.name.length > maxAxesDisplayLabelChars ? term.name.substring(0, maxAxesDisplayLabelChars) : term.name;
            let mentionFmt = numeralLibs(term.mentions).format(term.mentions > 1000 ? '+0.0a' : '0a');
            colorMap.set(term.name, color);
            return {displayLabel: displayLabel, term: term.name, mentions: term.mentions, mentionFmt: mentionFmt, color: color};
        });

        if(this.popularTermsChart.valueAxes && this.popularTermsChart.valueAxes.length > 0){
            this.popularTermsChart.valueAxes[0].title = "Top Mentions for {0}".format(this.props.timespan);
        }
    }

    this.popularTermsChart.validateData();

    //Set the default term to the most popular
    if(!this.state.selectedEdge){
        this.changeMainTermToMostPopular(summaryTerms[0].name, colorMap);
    }else{
        this.getFlux().actions.DASHBOARD.termsColorMap(colorMap);
    }
 },

 changeMainTermToMostPopular: function(term, colorMap){
        let entity = {
            "type": "Term",
            "name": term
        };

    this.setState({selectedEdge: entity.name});
    this.getFlux().actions.DASHBOARD.changeSearchFilter(entity, this.props.siteKey, colorMap);
 },

 hasChanged: function(nextProps, propertyName){
      if(Array.isArray(nextProps[propertyName])){
          return nextProps[propertyName].join(",") !== this.props[propertyName].join(",");
      }

      if(this.props[propertyName] && nextProps[propertyName] && nextProps[propertyName] !== this.props[propertyName]){
          return true;
      }

      return false;
 },

 componentDidMount: function(){
    if(!this.popularTermsChart){
            this.initializeGraph();
            this.updateChart(this.props.mainEdge, this.props.timespan, this.props.timespanType, this.props.dataSource);
    }
 },

 componentWillReceiveProps: function(nextProps){
    let hasTimeSpanChanged = this.hasChanged(nextProps, "timespan");
    if((this.hasChanged(nextProps, "mainEdge") && this.props.edgeType === "Term") || hasTimeSpanChanged || this.hasChanged(nextProps, "dataSource")){
        this.updateChart(!hasTimeSpanChanged ? nextProps.mainEdge : undefined, nextProps.timespan, nextProps.timespanType, nextProps.dataSource);
    }
 },

 updateChart: function(mainEdge, timespan, timespanType, dataSource){
     let self = this;

     SERVICES.getPopularTerms(this.props.siteKey, timespan, timespanType, mainEdge, Actions.DataSources(dataSource), 
            (error, response, body) => {
                if(!error && response.statusCode === 200 && body.data) {
                    let graphQLResponse = body.data[Object.keys(body.data)[0]];

                    self.refreshChart(graphQLResponse.edges);
                }else{
                    console.error(`[${error}] occured while processing popular terms graphql request`);
                }
            });
 },

 render: function() { 
    return (
        <div>
        </div>
     );
   }
});