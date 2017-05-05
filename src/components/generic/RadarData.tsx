import * as React from 'react';
import { GenericComponent, IGenericProps, IGenericState } from './GenericComponent';
import Card from '../Card';
import { RadarChart, Radar, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

import * as _ from 'lodash';
import * as moment from 'moment';

import colors from '../colors';
var { ThemeColors } = colors;

interface IRadarProps extends IGenericProps {
  props: {
   
  };
};

interface IRadarState extends IGenericState {
  values: Object[];
}

export default class RadarData extends GenericComponent<IRadarProps, IRadarState> {
  
  state = {
    values: [],
    bars: []
  };

  constructor(props: any) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(data: any, index: number) {
    this.trigger('onBarClick', data.payload);
  }

  render() {

    var { values } = this.state;
    var { title, subtitle, props } = this.props;

    if (!values) {
      return null;
    }

    return (
      <Card title={title} subtitle={subtitle}>
        <ResponsiveContainer>
          <RadarChart 
            outerRadius={90} 
            width={730} 
            height={250} 
            data={data}
          >
          <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          <Radar name="Lily" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
          <PolarGrid />
          <Legend />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 150]} />
          </RadarChart>
        </ResponsiveContainer>
      </Card>
    );
  }
}