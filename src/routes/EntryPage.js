import React from 'react';
import {Header} from '../components/Header';
import Footer from '../components/Footer';
import {Dashboard} from '../components/Dashboard';

export const EntryPage = React.createClass({
  render() {
    return (
    <div>
	    <Header flux={this.props.flux} {...this.props.params} routePage="Dashboard" />
        <Dashboard flux={this.props.flux} {...this.props.params} />
        <Footer flux={this.props.flux} />
    </div>
  )}
});
