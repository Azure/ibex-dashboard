import * as React from 'react';
import PropTypes from 'prop-types';

import XLabels from './XLabels';
import DataGrid from './DataGrid';

export interface HeatMapProps {
  xLabels: (string | number)[];
  yLabels: (string | number)[];
  data: HeatMapCellData[][];
  background?: string;
  height?: number;
  xLabelWidth?: number;
}

export interface HeatMapCellData {
  label: string;
  color: string;
  value: number;
  onClick?: (x: number, y: number, data: HeatMapCellData) => void;
}

export default class HeatMapImp extends React.Component<HeatMapProps> {
  constructor(props: HeatMapProps) {
    super(props);
  }

  public render() {
    let { xLabels, yLabels, data, background, height, xLabelWidth } = this.props;

    background = background ? background : '#329fff';
    height = height ? height : 30;
    xLabelWidth = xLabelWidth ? xLabelWidth : 60;

    return (
      <div>
        <DataGrid
          {...{xLabels, yLabels, data, background, height, xLabelWidth}}
        />
        <XLabels labels={xLabels} width={xLabelWidth} />
      </div>
    );
  }
}