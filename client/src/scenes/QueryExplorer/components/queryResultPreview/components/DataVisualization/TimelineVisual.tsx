import * as React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import * as KustoUtils from '../../../../../../utils/kusto/kustoUtils';

export interface TimelineVisualProps {
  queryResponse?: KustoQueryResults;
}

export default class TimelineVisual extends React.Component<TimelineVisualProps> {
  public render() {
    // if (!this.isValidTimelineData(this.props.queryResponse)) {
    //   return (<span></span>);
    // }

    const data = [
      {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
      {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
      {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
    ];

    // Convert kusto results to valid JSON
    let kustoResponseAsJsons = KustoUtils.convertKustoResultsToJsonObjects(this.props.queryResponse);
    let chartData = kustoResponseAsJsons[0];

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
          <XAxis dataKey="TIMESTAMP"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Legend />
          <Line type="monotone" dataKey="count_" stroke="#8884d8" activeDot={{r: 8}}/>
        </LineChart>
      </ResponsiveContainer>
    );
  }

  private isValidTimelineData(queryResponse: KustoQueryResults): boolean {
    if (!queryResponse || !queryResponse.Tables || !queryResponse.Tables[0]) {
      return false;
    }

    // Timeline data must have one datetime 
    let datetimeColumns = queryResponse.Tables[0].Columns
                                       .filter(column => column.ColumnType === 'datetime');

    if (!datetimeColumns || datetimeColumns.length !== 1) {
      return false;
    }

    return true;
  }
}