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

    nameKey: string;
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

    const data05 = [
      { subject: 'Math', A: 120, B: 110, fullMark: 150 },
      { subject: 'Chinese', A: 98, B: 130, fullMark: 150 },
      { subject: 'English', A: 86, B: 130, fullMark: 150 },
      { subject: 'Geography', A: 99, B: 100, fullMark: 150 },
      { subject: 'Physics', A: 85, B: 90, fullMark: 150 },
      { subject: 'History', A: 65, B: 85, fullMark: 150 },
    ];

    return (
      <Card title={title} subtitle={subtitle}>
        <ResponsiveContainer>
          <RadarChart
            outerRadius={90}
            width={730}
            height={250}
            data={data05}
          >
            <Radar name="Mike" dataKey="NFL" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Radar name="Lily" dataKey="NBA" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
            <PolarGrid />
            <Legend />
            <PolarAngleAxis dataKey="intent" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
          </RadarChart>
        </ResponsiveContainer>
      </Card>
    );
  }
}