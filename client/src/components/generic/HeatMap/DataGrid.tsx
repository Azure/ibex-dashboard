import * as React from 'react';
import FixedBox from './FixedBox';
import { HeatMapProps } from './HeatMapImp';

export default class DataGrid extends React.Component<HeatMapProps> {
  public render() {
    const { xLabels, yLabels, data, xLabelWidth, background, height, onClick } = this.props;
    const flatArray = data.map((v, i) => v.map(s => s.value)).reduce((i, o) => [...o, ...i], []);
    const max = Math.max(...flatArray);
    const min = Math.min(...flatArray);

    return (
      <div className="dataGrid">
        {yLabels.map((y, yi) => (
          <div key={y} style={{display: 'flex'}}>
            <FixedBox width={xLabelWidth}>
              <div className="lineTitle" style={{paddingTop: `${height / 3.7}px`}}>{y}</div>
            </FixedBox>
            
            <div className="lineContainer">
              {xLabels.map((x, xi) => (
                <div
                  title={data[yi][xi] ? `${data[yi][xi].value}` : ''}
                  key={`${x}_${y}`}
                  onClick={onClick && data[yi][xi] ? _ => onClick(data[yi][xi]) : undefined}
                  className="cell"
                  style={{
                    background: data[yi][xi] ? data[yi][xi].color || background : 'white',
                    height,
                    // opacity: data[yi][xi] && data[yi][xi].color ? 
                    //             1 : 
                    //             ((data[yi][xi].value - min) / (max - min) || 1),
                    lineHeight: `${height}px`
                  }}
                >
                  {data[yi][xi] ? data[yi][xi].label || '' : ''}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
}