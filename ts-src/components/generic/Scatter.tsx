import * as React from 'react';
import { GenericComponent, IGenericProps, IGenericState } from './GenericComponent';
import Card from '../Card';
import { ScatterChart, Scatter as ScatterLine, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer }  from 'recharts';

import * as _ from 'lodash';
import * as moment from 'moment';

import colors from '../colors';
var { ThemeColors } = colors;

interface IScatterProps extends IGenericProps {
  theme?: string[]
}

interface IScatterState extends IGenericState {

}

export default class Scatter extends GenericComponent<IScatterProps, IScatterState> {

  dateFormat (time) {
    return moment(time).format('MMM-DD');
  }
  
  hourFormat (time) {
    return moment(time).format('HH:mm');
  }

  render() {

    var { title, subtitle, theme } = this.props;

    var { timeFormat, values, lines } = this.state;
    var format = timeFormat === "hour" ? this.hourFormat : this.dateFormat;
    var themeColors = theme || ThemeColors;

    const data01 = [{x: 100, y: 200, z: 200}, {x: 120, y: 100, z: 260},
                    {x: 170, y: 300, z: 400}, {x: 140, y: 250, z: 280},
                    {x: 150, y: 400, z: 500}, {x: 110, y: 280, z: 200}];
    const data02 = [{x: 200, y: 260, z: 240}, {x: 240, y: 290, z: 220},
                    {x: 190, y: 290, z: 250}, {x: 198, y: 250, z: 210},
                    {x: 180, y: 280, z: 260}, {x: 210, y: 220, z: 230}];

    var scatters = [];
    // if (data && data.length) {
    //   scatters = lines.map((line, idx) => {
    //     return <Scatter key={idx} name={line.name} dataKey={line} stroke={ThemeColors[idx]} dot={false} ticksCount={5}/>
    //   })
    // }

    return (
      <Card title={ title }
            subtitle={ subtitle }>
        <ResponsiveContainer>
          <ScatterChart margin={{top: 5, right: 30, left: 20, bottom: 5}}>
            <XAxis dataKey={'x'} tickFormatter={format} minTickGap={20} name='stature'/>
            <YAxis dataKey={'y'} name='weight' unit='kg'/>
            <ZAxis dataKey={'z'} range={[60, 600]} name='score' unit='km'/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip cursor={{strokeDasharray: '3 3'}}/>
            <Legend/>
            <ScatterLine name='A school' data={data01} fill={colors.ThemeColors[0]}/>
            <ScatterLine name='B school' data={data02} fill={colors.ThemeColors[1]}/>
          </ScatterChart>
        </ResponsiveContainer>
      </Card>
    );
  }
}