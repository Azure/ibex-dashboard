import * as React from 'react';
import { Media } from 'react-md/lib/Media';
import { ResponsiveContainer as RechartResponsiveContainer } from 'recharts';

interface IeContainerProps {
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

interface IContainerState {
  
}

/**
 * This class is used to remove warning from test cases
 */
export default class ResponsiveContainer extends React.PureComponent<IeContainerProps, IContainerState> { 

  render() {

    const { children, layout } = this.props;

    let containerProps = {};
    if (!layout || !layout.w) {
      containerProps['width'] = 100;
      containerProps['aspect'] = 1;
    }

    return (
      <RechartResponsiveContainer {...containerProps}>
        {children}
      </RechartResponsiveContainer>
    );
  }

}