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
      this.getFlux().actions.FACTS.load_settings(this.props.params.siteKey);
  },
  getStateFromFlux() {
        return this.getFlux().store("FactsStore").getState();
  },
  render() {
    return (
      this.state.settings.properties ? 
      <div>
        <Header flux={this.props.flux} 
                     {...this.props.params} 
                      routePage="Facts"
                      siteSettings={this.state.settings} />
        <FactsList flux={this.props.flux} {...this.props.params} />
      </div> 
      : <div />
    )
  }
});