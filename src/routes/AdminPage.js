import React from 'react';
import { Header } from '../components/Header';
import { Admin } from '../components/Admin';
import '../styles/Admin.css';
import Fluxxor from 'fluxxor';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("AdminStore");

export const AdminPage = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  componentDidMount(){
      this.getFlux().actions.ADMIN.load_settings(this.props.params.siteKey);
  },

  getStateFromFlux() {
        return this.getFlux().store("AdminStore").getState();
  },

  componentWillReceiveProps(){
    if(this.state.settings.name && this.state.settings.name !== this.props.params.siteKey){
      this.getFlux().actions.ADMIN.load_settings(this.props.params.siteKey);
    }
  },

  render() {
    return (
      <div>
        { this.state.settings.properties ? 
           <div>
              <Header flux={this.props.flux} {...this.props.params} 
                      siteSettings={this.state.settings}/>
              <Admin flux={this.props.flux} {...this.props.params} />
            </div>
          : undefined
        }
      </div>
    )
  }
});