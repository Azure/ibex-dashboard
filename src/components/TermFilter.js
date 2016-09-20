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
      let newFilters = {};      
      this.props.data.forEach(term => newFilters[term] = filters.indexOf(term) > -1);

      this.getFlux().actions.DASHBOARD.changeTermsFilter(newFilters);
  },

  getStateFromFlux() {
    return this.getFlux().store("DataStore").getState();
  },

  render(){
      let value = [];
      if(this.state.filteredTerms){
          Object.keys(this.state.filteredTerms).forEach(term => {
              if(this.state.filteredTerms[term]){
                  value.push(term);
              }
          });
      }
      
      return (
        <div>
        {
            this.props.data && this.props.data.length > 0 ? 
             <Multiselect {...this.props} value={value} 
                          onChange={this.onFilterChange}/>
            : undefined
        }
        </div>
      );
  }
});
