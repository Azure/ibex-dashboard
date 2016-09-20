import React from 'react';
import {Header} from '../components/Header';
import {Dashboard} from '../components/Dashboard';

export const EntryPage = React.createClass({
  render() {
    return (
    <div>
	    <Header flux={this.props.flux} {...this.props.params} routePage="Dashboard" />
        <Dashboard flux={this.props.flux} {...this.props.params} />
    </div>
  )}
});
