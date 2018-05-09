import * as React from 'react';
import FixedBox from './FixedBox';
import { HeatMapProps } from './HeatMapImp';

export default class DataGrid extends React.Component<HeatMapProps> {
  public render() {
    const { xLabels, yLabels, data, xLabelWidth, background, height } = this.props;
    const flatArray = data.map((v, i) => v.map(s => s.value)).reduce((i, o) => [...o, ...i], []);
    const max = Math.max(...flatArray);
    const min = Math.min(...flatArray);
    return (
      <div>
        {yLabels.map((y, yi) => (
          <div key={y} style={{display: 'flex'}}>
            <FixedBox width={xLabelWidth}>
              <div style={{textAlign: 'right', paddingRight: '5px', paddingTop: `${height / 3.7}px`}}>{y}</div>
            </FixedBox>
            {xLabels.map((x, xi) => (
              <div
                title={`${data[yi][xi].value}`}
                key={`${x}_${y}`}
                onClick={(_) => data[yi][xi].onClick(xi, yi, data[yi][xi])}
                style={{
                  background: data[yi][xi].color || background,
                  margin: '1px 1px 0 0',
                  height,
                  flex: 1,
                  opacity: data[yi][xi].color ? 
                              1 : 
                              ((data[yi][xi].value - min) / (max - min) || 1),
                  lineHeight: `${height}px`,
                  textAlign: 'center'
                }}
              >
                {data[yi][xi].label || ''}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}