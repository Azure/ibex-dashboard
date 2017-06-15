import * as React from 'react';

export interface IEchoProps {
  echo: String;
}

export default class Echo extends React.PureComponent<IEchoProps, void> {
  render() {
    return (
      <div>
        {this.props.echo}
      </div>
    );
  }
}