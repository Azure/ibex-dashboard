import Fluxxor from 'fluxxor';
import React from 'react';
import {Actions} from '../actions/Actions';
import numeralLibs from 'numeral';

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
                  "properties": {
                      "name": e.dataItem.dataContext.term
                  }
              };
              self.getFlux().actions.DASHBOARD.changeSearchFilter(entity, this.props.siteKey);
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
              let mentionFmt = numeralLibs(mentions).format(mentions > 1000 ? '+0.0a' : '0a');
              dataProvider.push({displayLabel: displayLabel, term: label, category: category, mentions: mentions, mentionFmt: mentionFmt, color: termColorMap.get(term)});
        }
    }

    this.popularTermsChart.dataProvider = dataProvider;
    if(this.popularTermsChart.valueAxes && this.popularTermsChart.valueAxes.length > 0){
        this.popularTermsChart.valueAxes[0].title = "Top Mentions for {0}".format(this.state.datetimeSelection);
    }

    this.popularTermsChart.datetimeSelection = this.state.datetimeSelection;
    this.popularTermsChart.categoryValue = this.state.categoryValue;
    this.popularTermsChart.validateData();
 },

 updateChart(summaryMap, termColorMap){
     if(!this.popularTermsChart || (this.state.timeSeriesGraphData && this.state.timeSeriesGraphData.aggregatedCounts.length === 0)){
        this.initializeGraph();
     }

     let graphDateScope = this.popularTermsChart.datetimeSelection || '';

     if(graphDateScope !== this.state.datetimeSelection || this.state.categoryValue !== this.popularTermsChart.categoryValue){
        this.refreshChart(summaryMap, termColorMap);
     }
  },
  
  render() {
   if(this.state.timeSeriesGraphData && this.state.timeSeriesGraphData.aggregatedCounts){
        this.updateChart(this.state.timeSeriesGraphData.termSummaryMap, this.state.timeSeriesGraphData.termColorMap);
    }

    return (
        <div>
        </div>
     );
   }
});