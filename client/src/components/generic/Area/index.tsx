import * as React from 'react';
import { GenericComponent, IGenericProps, IGenericState } from '../GenericComponent';
import * as moment from 'moment';
import * as _ from 'lodash';
import { AreaChart, Area as AreaFill, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Tooltip, ResponsiveContainer, Legend, defs } from 'recharts';
import Card from '../../Card';
import Switch from 'react-md/lib/SelectionControls/Switch';
import colors from '../../colors';
var { ThemeColors } = colors;

import '../generic.css';

import AreaSettings from './Settings';

interface IAreaProps extends IGenericProps {
  theme?: string[];
  showLegend?: boolean;
  isStacked?: boolean;
}

interface IAreaState extends IGenericState {
  timeFormat: string;
  values: Object[];
  lines: Object[];
  isStacked: boolean;
}

export default class Area extends GenericComponent<IAreaProps, IAreaState> {

  static editor = AreaSettings;
  static defaultProps = {
    isStacked: false
  };

  state = {
    timeFormat: '',
    values: [],
    lines: [],
    isStacked: this.props.isStacked
  };

  static fromSource(source: string) {
    return {
      values: GenericComponent.sourceFormat(source, 'graphData'),
      lines: GenericComponent.sourceFormat(source, 'lines'),
      timeFormat: GenericComponent.sourceFormat(source, 'timeFormat')
    };
  }

  constructor(props: IAreaProps) {
    super(props);

    // apply nested props
    if (props && props.props) {
      if (props.props.isStacked !== undefined) {
        this.state.isStacked = props.props.isStacked as boolean;
      }
    }
  }

  dateFormat(time: string): string {
    return moment(time).format('MMM-DD');
  }

  hourFormat(time: string): string {
    return moment(time).format('HH:mm');
  }

  generateWidgets() {
    const { isStacked } = this.state;
    return (
      <Switch
        id="stack"
        name="stack"
        label="Stack"
        checked={isStacked}
        defaultChecked
        onChange={this.handleStackChange}
      />
    );
  }

  handleStackChange = (checked) => {
    // NB: a render workaround is required when toggling stacked area view.
    this.setState({ isStacked: checked, values: this.state.values.slice() });
  }

  render() {
    const { timeFormat, values, lines, isStacked } = this.state;
    const { id, title, subtitle, theme, props } = this.props;
    const { showLegend, areaProps } = props;

    const format = timeFormat === 'hour' ? this.hourFormat : this.dateFormat;
    const themeColors = theme || ThemeColors;

    const stackProps = !isStacked ? {} : { stackId : 1 };

    const widgets = this.generateWidgets();

    let fillElements = [];
    if (values && values.length && lines) {
      fillElements = lines.map((line, idx) => {
        return (
          <AreaFill
            key={idx}
            dataKey={line}
            {...stackProps}
            type="monotone"
            stroke={themeColors[idx % themeColors.length]}
            fill={themeColors[idx % themeColors.length]}
          />
        );
      });
    }

    return (
      <Card id={id} title={title} subtitle={subtitle} widgets={widgets}>
        <ResponsiveContainer>
          <AreaChart
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            data={values}
            {...areaProps}
          >
            <XAxis dataKey="time" tickFormatter={format} minTickGap={20} />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            {showLegend !== false && <Legend />}
            {fillElements}
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    );
  }
}