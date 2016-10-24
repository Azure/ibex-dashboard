import React from 'react';
import { Header } from '../components/Header';
import { FactDetail } from '../components/FactDetail';
import '../styles/Facts.css';

export const FactDetailPage = React.createClass({
  render() {
    return (
      <div>
        <Header flux={this.props.flux} {...this.props.params} routePage="Facts" />
        <FactDetail flux={this.props.flux} {...this.props.params} />
      </div>
    )
  }
});
