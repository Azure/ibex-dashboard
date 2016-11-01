import React from 'react';
import { Header } from '../components/Header';
import { FactsList } from '../components/FactsList';
import '../styles/Facts.css';

export const FactsPage = React.createClass({
  render() {
    return (
      <div>
        <Header flux={this.props.flux} {...this.props.params} routePage="Facts" />
        <FactsList flux={this.props.flux} {...this.props.params} />
      </div>
    )
  }
});