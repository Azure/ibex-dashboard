import * as React from 'react';

import Card from '../../Card';
import { GenericComponent, IGenericProps, IGenericState } from '../GenericComponent';
import HeatMapImp, { HeatMapCellData } from './HeatMapImp';

interface HeatMapProps extends IGenericProps {
  props: {
    xLabels: (string | number)[];
    yLabels: (string | number)[];
    background?: string;
    height?: number;
    xLabelWidth?: number;
    onClick?: string;
    tooltip?: string;
  };
}

interface HeatMapState extends IGenericState {
  values: HeatMapCellData[][];
}

export default class HeatMap extends React.Component<HeatMapProps, HeatMapState> {
  static fromSource(source: string) {
    return {
      values: GenericComponent.sourceFormat(source, 'values'),
    };
  }

  constructor(props: any) {
    super(props);

    const xLabels = new Array(24).fill(0).map((_, i) => `${i}`);
    const yLabels = ['Sun', 'Mon', 'Tue'];
    const data = new Array(yLabels.length)
      .fill(0)
      .map(() => new Array(xLabels.length).fill({}).map(() => { return {
        value: Math.floor(Math.random() * 100),
        label: 'C',
        color: 'red'
      } as HeatMapCellData;
      }));

    this.state = {
      values: data
    };
  }

  render() {
    let { values } = this.state;
    let { id, title, subtitle, props } = this.props;
    let { background, height, xLabelWidth, onClick, tooltip } = props;
    const xLabels = new Array(24).fill(0).map((_, i) => `${i}`);
    const yLabels = ['Sun', 'Mon', 'Tue'];

    return (

      <Card id={id} title={title} subtitle={subtitle}>
        <HeatMapImp 
          data={values}
          xLabels={xLabels}
          yLabels={yLabels}
        />
      </Card>
    );
  }
}