import * as React from 'react';

import XLabels from './XLabels';
import DataGrid from './DataGrid';

import './HeatMapStyle.css';

export interface HeatMapProps {
  xLabels: (string | number)[];
  yLabels: (string | number)[];
  data: HeatMapCellData[][];
  background?: string;
  height?: number;
  xLabelWidth?: number;
  onClick?: (data: HeatMapCellData) => void;
}

export interface HeatMapCellData {
  label: string;
  color: string;
  value: number;
  clusterName?: string;
}

export default class HeatMapImp<T> extends React.Component<HeatMapProps> {
  constructor(props: HeatMapProps) {
    super(props);
  }

  public render() {
    let { xLabels, yLabels, data, background, height, xLabelWidth, onClick } = this.props;

    background = background ? background : '#329fff';
    height = height ? height : 24;
    xLabelWidth = xLabelWidth ? xLabelWidth : 95;

    return (
      <div style={{ marginRight: '10px' }}>
        <DataGrid
          {...{xLabels, yLabels, data, background, height, xLabelWidth, onClick}}
        />
        <XLabels labels={xLabels} width={xLabelWidth} />
      </div>
    );
  }
}