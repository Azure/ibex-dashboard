import * as React from 'react';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';

import Card from '../../Card';
import { GenericComponent, IGenericProps, IGenericState } from '../GenericComponent';
import HeatMapImp, { HeatMapCellData } from './HeatMapImp';

interface HeatMapProps extends IGenericProps {
  props: {
    background?: string;
    height?: number;
    xLabelWidth?: number;
    onClick?: string;
    tooltip?: string;
  };
}

interface HeatMapState extends IGenericState {
  values: HeatMapCellData[][];
  xLabels: (string | number)[];
  yLabels: (string | number)[];
}

export default class HeatMap extends GenericComponent<HeatMapProps, HeatMapState> {
  static fromSource(source: string) {
    return {
      values: GenericComponent.sourceFormat(source, 'values'),
      xLabels: GenericComponent.sourceFormat(source, 'xLabels'),
      yLabels: GenericComponent.sourceFormat(source, 'yLabels'),
    };
  }

  constructor(props: any) {
    super(props);

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      values: undefined,
      xLabels: [],
      yLabels: []
    };
  }

  handleClick(heatmapCell: HeatMapCellData) {
    this.trigger('onHeatMapCellClick', heatmapCell);
  }

  render() {
    let { values, xLabels, yLabels } = this.state;
    let { id, title, subtitle, props } = this.props;
    let { background, height, xLabelWidth, onClick, tooltip } = props;

    if (!values || !values.length) {
        return <CircularProgress key="loading" id="spinner" />;
    }

    return (

      <Card id={id} title={title} subtitle={subtitle}>
        <HeatMapImp 
          data={values}
          xLabels={xLabels}
          yLabels={yLabels}
          onClick={this.handleClick}
        />
      </Card>
    );
  }
}