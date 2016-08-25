import {SERVICES} from '../services/services';
import Fluxxor from 'fluxxor';
import React, { PropTypes, Component } from 'react';
import {Actions} from '../actions/Actions';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore"),
      chartDivReference = "popularTermsPieDiv";

export const PopularTermsPie = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getStateFromFlux: function() {
    return this.getFlux().store("DataStore").getState();
  },

  initializeGraph(){
    let self = this;
    this.popularTermsPie = AmCharts.makeChart(chartDivReference, {
        "type": "pie",
        "theme": "dark",
        "innerRadius": "20%",
        "fontSize": "8",
        "outlineThickness":"0",
        "marginTop": 0,
        "labelsEnabled": false,
        "legend":{
          "fontSize": 8,
          "spacing": 10,
          "marginTop":0,
          "marginBottom":0,
          "verticalGap": 0,
          "valueText": "[[percents]]%"
        },
        "marginLeft":0,
        "marginRight":0,
        "labelRadius": 5,
        "marginBottom": 0,
        "gradientRatio": [-0.4, -0.4, -0.4, -0.4, -0.4, -0.4, 0, 0.1, 0.2, 0.1, 0, -0.2, -0.5],
        "dataProvider": [],
        "pullOutOnlyOne": true,
        "maxLabelWidth":"60",
        "valueField": "mentions",
        "titleField": "term"
    });

    this.popularTermsPie.addListener("clickSlice", e => {
        let labelSplitArr = e.dataItem.title.split('-');

        if(labelSplitArr.length > 1){
              let label = labelSplitArr[1];
              let category = Actions.constants.CATEGORY_KEY_MAPPING[labelSplitArr[0]];
              if(category){
                  self.getFlux().actions.DASHBOARD.changeSearchFilter(label, category);
              }
          }
    });
 },

 refreshChart(summaryMap){
    let dataProvider = [];

    for (let [term, mentions] of summaryMap.entries()) {
        dataProvider.push({term, mentions});
    }

    this.popularTermsPie.dataProvider = dataProvider;
    this.popularTermsPie.datetimeSelection = this.state.datetimeSelection;
    this.popularTermsPie.validateData();
 },

 updateChart(summaryMap){
     if(!this.popularTermsPie){
        this.initializeGraph();
     }

     let graphDateScope = this.popularTermsPie.datetimeSelection || '';

     if(graphDateScope != this.state.datetimeSelection){
        this.refreshChart(summaryMap);
     }
  },
  
  render() {
   if(this.state.timeSeriesGraphData && this.state.timeSeriesGraphData.aggregatedCounts && this.state.timeSeriesGraphData.aggregatedCounts.length > 0){
        this.updateChart(this.state.timeSeriesGraphData.termSummaryMap);
    }

    return (
        <div>
        </div>
     );
   }
});