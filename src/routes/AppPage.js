import React from 'react';
import {Header} from '../components/Header';

export const AppPage = React.createClass({
  render() {
    return (
    <div>
      {this.props.children}
    </div>
  )}
});
