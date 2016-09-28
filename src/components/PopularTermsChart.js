import Fluxxor from 'fluxxor';
import React from 'react';
import {Actions} from '../actions/Actions';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore"),
      chartDivReference = "popularTermsPieDiv";

export const PopularTermsChart = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getStateFromFlux: function() {
    return this.getFlux().store("DataStore").getState();
  },

  initializeGraph(){
    let self = this;
    let datetimeSelection = this.state.datetimeSelection;

    this.popularTermsChart = window.AmCharts.makeChart(chartDivReference, {
        "theme": "dark",
        "type": "serial",
        "startDuration": 1,
        "graphs": [{
            "balloonText": "[[term]]: <b>[[value]]</b>  mentions",
            "fillAlphas": 1,
            "fillColorsField": "color",
            "lineAlpha": 0.1,
            "gradientRatio": [-0.4, -0.4, -0.4, -0.4, -0.4, -0.4, 0, 0.1, 0.2, 0.1, 0, -0.2, -0.5],
            "type": "column",
            "valueField": "mentions"
        }],
        "depth3D": 20,
        "angle": 30,
        "chartCursor": {
            "categoryBalloonEnabled": false,
            "cursorAlpha": 0,
            "zoomable": false
        },
        "rotate": true,
        "categoryField": "displayLabel",
        "categoryAxis": {
            "gridPosition": "start",
            "fillAlpha": 0.05,
            "position": "left"
        },
        "export": {
            "enabled": true
        },
        "valueAxes": [{
            "title": "Top Keywords for " + datetimeSelection
        }]
    });

    this.popularTermsChart.addListener("clickGraphItem", e => {
        if(e.item.dataContext){
              self.getFlux().actions.DASHBOARD.changeSearchFilter(e.item.dataContext.term, e.item.dataContext.category);
        }
    });
 },

 refreshChart(summaryMap, termColorMap){
    let maxAxesDisplayLabelChars = 16;
    let dataProvider = [];

    for (let [term, mentions] of summaryMap.entries()) {
        let labelSplitArr = term.split('-');

        if(labelSplitArr.length > 1){
              let label = labelSplitArr[1];
              let displayLabel = label.length > maxAxesDisplayLabelChars ? label.substring(0, maxAxesDisplayLabelChars) : label;
              let category = Actions.constants.CATEGORY_KEY_MAPPING[labelSplitArr[0]];
              dataProvider.push({displayLabel: displayLabel, term: label, category: category, mentions: mentions, color: termColorMap.get(term)});
        }
    }

    this.popularTermsChart.dataProvider = dataProvider;
    if(this.popularTermsChart.valueAxes && this.popularTermsChart.valueAxes.length > 0){
        this.popularTermsChart.valueAxes[0].title = "Total Mentions for {0}".format(this.state.datetimeSelection);
    }

    this.popularTermsChart.datetimeSelection = this.state.datetimeSelection;
    this.popularTermsChart.validateData();
 },

 updateChart(summaryMap, termColorMap){
     if(!this.popularTermsChart){
        this.initializeGraph();
     }

     let graphDateScope = this.popularTermsChart.datetimeSelection || '';

     if(graphDateScope !== this.state.datetimeSelection){
        this.refreshChart(summaryMap, termColorMap);
     }
  },
  
  render() {
   if(this.state.timeSeriesGraphData && this.state.timeSeriesGraphData.aggregatedCounts && this.state.timeSeriesGraphData.aggregatedCounts.length > 0){
        this.updateChart(this.state.timeSeriesGraphData.termSummaryMap, this.state.timeSeriesGraphData.termColorMap);
    }

    return (
        <div>
        </div>
     );
   }
});