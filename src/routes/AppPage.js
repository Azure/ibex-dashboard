import React from 'react';

export const AppPage = React.createClass({
  render() {
    return (
    <div>
      {this.props.children}
    </div>
  )}
});
