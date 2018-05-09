import * as React from 'react';
import FixedBox from './FixedBox';

interface XLabelsProps {
  labels: (string | number)[];
  width: number;
}

export default class XLabels extends React.Component<XLabelsProps> {
  public render() {
    const { labels, width } = this.props;

    return (
      <div style={{display: 'flex'}}>
        <FixedBox width={width} />
        {labels.map(x => (
          <div key={x} style={{flex: 1, textAlign: 'center'}}>
            {x}
          </div>
        ))}
      </div>
    );
  }
}