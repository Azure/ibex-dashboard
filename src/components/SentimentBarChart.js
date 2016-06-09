import Chart from 'chart.js';
import ChartExt from 'chart-stackedbar-js';
import {SERVICES} from '../services/services';
import Fluxxor from 'fluxxor';
import React, { PropTypes, Component } from 'react';
import {Actions} from '../actions/Actions';

/*Uses Chart.js stacked bar chart extension https://github.com/Regaddi/Chart.StackedBar.js/blob/master/docs/Stacked-Bar-Chart.md*/
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
  
  getStateFromFlux: function() {
    return this.getFlux().store("DataStore").getState();
  },
  
  onClickHandler(evt){
      if(this.barChart && this.barChart.getBarsAtEvent(evt).length > 0){
          let activeBars = this.barChart.getBarsAtEvent(evt);
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
  
  renderBarChart(){
    if(this.state.sentimentChartData.length > 0){
        let labels = [];
        let maxLabelCharacters = 14;
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
            let occurences = item.occurences;
            let negativeSentimentVal = item.mag_n;
            let positiveSentimentVal = occurences - negativeSentimentVal;
            labels.push(item.label.length > maxLabelCharacters ? item.label.substring(0, maxLabelCharacters) : item.label);
            positiveData.data.push(positiveSentimentVal);
            negativeData.data.push(negativeSentimentVal);
        });
        
        if(this.barChart){
            this.barChart.destroy();
        }
        
        var ctx = document.getElementById("BarChart").getContext("2d");
        this.barChart = new Chart(ctx).StackedBar({
                labels: labels,
                datasets : [positiveData, negativeData],
        },{
                responsive : true,
                scaleShowHorizontalLines: true,
                //String - A legend template
                legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
        });
            
        this.barChart.generateLegend();
        this.barChart.chart.canvas.onclick = this.onClickHandler;
    }else if(this.barChart){
        this.barChart.destroy();
    }
  },
  
  render() {
   if(this.state.sentimentChartData){
       this.renderBarChart();
   }
   
    return (
        <div>
        </div>
     );
  }
});