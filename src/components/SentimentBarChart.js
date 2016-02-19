import Chart from 'chart.js';
import ChartExt from 'chart-stackedbar-js';
import {SERVICES} from '../services/services';
import Fluxxor from 'fluxxor';
import React, { PropTypes, Component } from 'react';
import {Actions} from '../actions/Actions';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");

const chartOptions = {
        width: 600,
        height: 400,
        legend: { position: 'top', maxLines: 3 },
        bar: { groupWidth: '75%' },
        isStacked: true,
        scaleShowHorizontalLines: true
};

export const SentimentBarChart = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getInitialState(){
      this.getFlux().actions.GRAPHING.load_sentiment_bar_chart();
  },
  
  getStateFromFlux: function() {
    return this.getFlux().store("DataStore").getState();
  },
  
  componentDidMount(){
      
      this.bindChartDataToState();
  },
  
  /*Only doing for test demo purpose until we get some real data*/ 
  randomize(){
      let maxNumber = 5000;
      let minNumber = 50;
      
      if(this.barChart){
          this.barChart.datasets.map(ds => {
              ds.bars.map(bar => {
                  bar.value = parseInt(bar.value).randomize(minNumber, maxNumber);
              });
          });
          
          this.barChart.update();
      }
  },
  
  onClickHandler(evt){
      if(this.barChart && this.barChart.getBarsAtEvent(evt).length > 0){
          let activeBars = this.barChart.getBarsAtEvent(evt);
          let selectedLabel = activeBars[0].label;
          
          this.barChart.datasets.map((ds, dsIdx) => {
              ds.bars.map((bar, barIdx) => {
                  if(bar.label === selectedLabel){
                      this.barChart.datasets[dsIdx].bars[barIdx].fillColor = "#7db5d3";
                      this.barChart.datasets[dsIdx].bars[barIdx].highlightFill = "#7db5d3";
                  }
              });
          });
          
          this.barChart.update();
      }
  },
  
  bindChartDataToState(){
    if(this.state.sentimentChartData){
        let labels = [];
        let positiveData = {
				label: "Postive",
                fillColor : "#07d159",
				strokeColor : "rgba(220,220,220,0.8)",
				highlightFill: "#358c3f",
				highlightStroke: "rgba(220,220,220,1)",
				data : []
	    }
        let negativeData = {
                label: "Negative",
				fillColor : "#b74e4f",
				strokeColor : "rgba(151,187,205,0.8)",
				highlightFill : "#d76c6e",
				highlightStroke : "rgba(151,187,205,1)",
				data : []
	    }
        
        this.state.sentimentChartData.map(item => {
            let positiveSentiment = item[Actions.constants.SENTIMENT_JSON_MAPPING["positive"]];
            let negativeSentiment = item[Actions.constants.SENTIMENT_JSON_MAPPING["negative"]];
            let occurences = item["occurences"];
            let positivePercentage = (positiveSentiment / (positiveSentiment + negativeSentiment));
            let positiveSentimentVal = (positivePercentage * occurences).toFixed(0);
            let negativeSentimentVal = occurences - positiveSentimentVal;
            labels.push(item.dataValue);
            positiveData.data.push(positiveSentimentVal);
            negativeData.data.push(negativeSentimentVal);
        });
        
        var ctx = document.getElementById("BarChart").getContext("2d");
	    this.barChart = new Chart(ctx).StackedBar({
            labels: labels,
            datasets : [positiveData, negativeData],
        },
        {
			responsive : true,
            scaleShowHorizontalLines: true,
            //String - A legend template
            legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
		});
        
        this.barChart.generateLegend();
        this.barChart.chart.canvas.onclick = this.onClickHandler;
    }  
  },
  
  render() {
   if(this.barChart){
       this.randomize();
   }
   
    return (
        <div>
        </div>
     );
  }
});