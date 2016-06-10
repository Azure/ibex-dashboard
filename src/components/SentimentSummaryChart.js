import Chart from 'chart.js';
import {SERVICES} from '../services/services';
import Fluxxor from 'fluxxor';
import React, { PropTypes, Component } from 'react';
import {Actions} from '../actions/Actions';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");

export const SentimentSummaryChart = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getStateFromFlux: function() {
    return this.getFlux().store("DataStore").getState();
  },
  
  onClickHandler(evt){
      if(this.radarChart && this.radarChart.getBarsAtEvent(evt).length > 0){
          let activeBars = this.radarChart.getBarsAtEvent(evt);
          let selectedLabel = activeBars[0].label;
          let labelSplitArr = selectedLabel.split('-');
          let dataStore = this.getFlux().store("DataStore").dataStore;
          
          if(labelSplitArr.length > 1){
              let label = labelSplitArr[1];
              let category = Actions.constants.CATEGORY_KEY_MAPPING[labelSplitArr[0]];
              if(category){
                  this.getFlux().actions.DASHBOARD.changeSearchFilter(label, category);
              }
          }
      }
  },

  createChart(){
        let labels = [];
        let positiveData = {
				label: "Postive",
                /*fillColor : "#07d159",
				strokeColor : "rgba(220,220,220,0.8)",
				highlightFill: "#358c3f",
				highlightStroke: "rgba(220,220,220,1)",*/
                backgroundColor: "rgba(179,181,198,0.2)",
                borderColor: "#358c3f",
                pointBackgroundColor: "rgba(179,181,198,1)",
                pointBorderColor: "#358c3f",
                pointHoverBackgroundColor: "#358c3f",
                pointRadius: 6,
                hitRadius: 6,
                pointHoverRadius: 6,
                pointHoverBorderColor: "rgba(179,181,198,1)",
				data : []
	    }
        let negativeData = {
                label: "Negative",
				/*fillColor : "#b74e4f",
				strokeColor : "rgba(151,187,205,0.8)",
				highlightFill : "#d76c6e",
				highlightStroke : "rgba(151,187,205,1)",*/
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                pointBackgroundColor: "rgba(255,99,132,1)",
                pointBorderColor: "rgba(255,99,132,1)",
                pointRadius: 6,
                hitRadius: 6,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: "rgba(255,99,132,1)",
                pointHoverBorderColor: "rgba(255,99,132,1)",                
				data : []
	    }

            let ctx = document.getElementById("BarChart");
            let data = {    labels: labels,
                            datasets : [positiveData, negativeData] };
            let config = {  type: 'radar', data, 
                            options: {
                                legend: { 
                                    position: 'top'
                                },
                                responsive : true,
                                reverse: false,
                                maintainAspectRatio: false,
                                ticks: { beginAtZero: true },
                                scale: {
                                    pointLabels:{
                                            fontSize: 16,
                                            fontColor: '#337ab7'
                                        }
                                },
                                title: {
                                    display: true,
                                    text: 'Sentiment Summary Breakdown',
                                    fontSize: 18
                                }
            }};

            Chart.defaults.global.defaultFontSize = 14;
            this.radarChart = new Chart(ctx, config);
  },

  clearChart(){
      this.radarChart.data.labels = [];
      this.radarChart.data.datasets[0].data = [];
      this.radarChart.data.datasets[1].data = [];
  },

  updateChart(){
      let maxLabelCharacters = 18;

      if(this.radarChart && this.state.sentimentChartData.length > 0){
          this.clearChart();

          this.state.sentimentChartData.map(item => {
                let occurences = item.occurences;
                let negativeSentimentVal = item.mag_n;
                let positiveSentimentVal = occurences - negativeSentimentVal;
                this.radarChart.data.labels.push(item.label.substring(0, item.label.length > maxLabelCharacters ? maxLabelCharacters : item.label.length));
                this.radarChart.data.datasets[0].data.push(positiveSentimentVal);
                this.radarChart.data.datasets[1].data.push(negativeSentimentVal);
          });

          this.radarChart.update();
      }
  },
  
  renderRadarChart(){
    if(this.state.sentimentChartData.length > 0){
        if(this.radarChart){
            this.updateChart();
        }else{
            this.createChart();
        }
       // this.barChart.chart.canvas.onclick = this.onClickHandler;
    }
  },
  
  render() {
   if(this.state.sentimentChartData && this.state.action != 'loadedGraphData'){
       this.renderRadarChart();
   }
   
    return (
        <div>
        </div>
     );
  }
});