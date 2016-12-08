import React from 'react';
import { Header } from '../components/Header';
import { FactsList } from '../components/FactsList';
import '../styles/Facts.css';
import Fluxxor from 'fluxxor';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("FactsStore");
      
export const FactsPage = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  componentDidMount(){
      this.getFlux().actions.ADMIN.load_settings(this.props.params.siteKey);
  },
  getStateFromFlux() {
        return this.getFlux().store("FactsStore").getState();
  },

  render() {
    return (
      <div>
        <Header flux={this.props.flux} {...this.props.params} routePage="Facts" />
        <FactsList flux={this.props.flux} {...this.props.params} />
      </div>
    )
  }
});