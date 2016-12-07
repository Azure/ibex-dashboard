import React from 'react';
import {Header} from '../components/Header';
import Fluxxor from 'fluxxor';
import {Dashboard} from '../components/Dashboard';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");

export const EntryPage = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],

  componentDidMount(){
      this.getFlux().actions.DASHBOARD.initializeDashboard(this.props.params.siteKey);
  },
  getStateFromFlux: function() {
    return this.getFlux().store("DataStore").getState();
  },
  render() {
    return (
    this.state.settings.properties ? 
      <div>
        <Header flux={this.props.flux} 
                {...this.props.params} 
                siteSettings={this.state.settings}/>
        <Dashboard flux={this.props.flux} 
                {...this.props.params} />
      </div>
    : <div />
  )}
});
