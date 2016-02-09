import React, { PropTypes, Component } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import App from '../components/App';
import HomePage from '../components/HomePage';

export const EntryPage = React.createClass({
  render() {
    return (
    <div>
	    <Header routePage="EntryPage" />
	    <App {...this.props.params} >
         <HomePage />
      </App>
      <Footer />
    </div>
  )}
});
