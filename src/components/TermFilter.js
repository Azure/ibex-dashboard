import React from 'react';
import Fluxxor from 'fluxxor';
import Multiselect from 'react-widgets/lib/Multiselect';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");

export const TermFilter = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getInitialState(){
    return {};  
  },
  
  onFilterChange(filters){
      this.getFlux().actions.DASHBOARD.changeTermsFilter(filters);
  },

  getStateFromFlux() {
    return this.getFlux().store("DataStore").getState();
  },

  FilterEnabledTerms(){
      let filteredTerms = [];

      for (var [term, value] of this.state.associatedKeywords.entries()) {
          if(value.enabled){
              filteredTerms.push(term);
          }
      }

      return filteredTerms;
 },

  render(){      
      return (
        <div>
        {
            this.props.data && this.props.data.length > 0 ? 
             <Multiselect {...this.props} value={this.FilterEnabledTerms()} 
                          onChange={this.onFilterChange}/>
            : undefined
        }
        </div>
      );
  }
});
