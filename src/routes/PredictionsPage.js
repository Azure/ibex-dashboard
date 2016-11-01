import React from 'react';
import { Header } from '../components/Header';
import { Predictions } from '../components/Predictions';
import '../styles/Predictions.css';

export const PredictionsPage = React.createClass({
  render() {
    return (
      <div className="fullbleed">
        <Header flux={this.props.flux} {...this.props.params} routePage="Predictions" />
        <Predictions flux={this.props.flux} {...this.props.params} />
      </div>
    )
  }
});