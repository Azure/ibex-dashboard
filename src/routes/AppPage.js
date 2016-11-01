import React from 'react';
import '../styles/Global.css';

export const AppPage = React.createClass({
  render() {
    return (
    <div id="pages">
      {this.props.children}
    </div>
  )}
});
