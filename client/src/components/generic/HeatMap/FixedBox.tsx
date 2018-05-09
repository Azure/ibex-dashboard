import * as React from 'react';

interface FixedBoxProps {
  width: number;
  children?: string | JSX.Element;
}

export default class FixedBox extends React.Component<FixedBoxProps> {
  public render() {
    let { width, children } = this.props;

    // Default values
    children = children ? children : ' ';

    return <div style={{flex: `0 0 ${width}px`}}> {children} </div>;
  }
}