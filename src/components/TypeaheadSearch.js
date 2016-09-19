import Fluxxor from 'fluxxor';
import React from 'react';
import Autosuggest from 'react-autosuggest';
import '../styles/TypeaheadSearch.css';

const FluxMixin = Fluxxor.FluxMixin(React);
const maxDefaultResult = 12;

export const TypeaheadSearch = React.createClass({
  mixins: [FluxMixin],
  
  typeaheadItemSelected(suggestion, event){
    let oldValue =  this.props.data || '';
    let newValue =  suggestion.searchTerm.trim();
    let newType =  suggestion.category.trim();
    
    if(oldValue === newValue){
        return;
    }
    
    if(oldValue !== newValue){
        this.getFlux().actions.DASHBOARD.changeSearchFilter(newValue, newType);
    }
  },
  
  defaultSuggestions(){
        return this.getFlux().store("DataStore").dataStore.defaultResults;
  },
  
  filterResults(input, callback){
      let filteredResults = [];
      this.getFlux().store("DataStore").dataStore.defaultResults
           .forEach(element => {
               if(element.searchTerm.indexOf(input) > -1){
                   filteredResults.push(element);
               }
           });
           
      callback(null, filteredResults);
  },
  
  getSuggestions(input, callback) {
    let defaultSuggestions = this.defaultSuggestions();
    if(input === ''){
      callback(null, defaultSuggestions.slice(0, Math.min(defaultSuggestions.length, maxDefaultResult)));
    } else {
      this.filterResults(input, callback);
    }
  },
  
  renderSuggestion(element, input) { // In this example, 'suggestion' is a string
     let suggestion = element.searchTerm; 
     let valueType = element.category;
     
     let beginNormalFont = '', highlightedSequence = '', endNormalFont = '';
     let matchingPosition = suggestion.toLowerCase().indexOf(input.toLowerCase());
         beginNormalFont = suggestion.substring(0, (matchingPosition !== -1) ? matchingPosition : input.length);

     if(matchingPosition !== -1){
       highlightedSequence = suggestion.substring(matchingPosition, matchingPosition + input.length);
       endNormalFont = suggestion.substring(matchingPosition + input.length, suggestion.length);
     }

    return (                                     // and it returns a ReactElement
      <span><span className="suggestionType">{valueType}</span> - {beginNormalFont}<strong className="react-autosuggest__highlighted_search_text">{(input.length > 0)?highlightedSequence:''}</strong>{endNormalFont}</span>
    );
  },
  
  suggestionValue(suggestion){  
      return suggestion.searchTerm.trim();
  },
  
  render: function(){
    let inputAttributes = {
          className: 'form-control form-control-search',
          placeholder: this.props.data || ''
    };

    return (
        <div className="input-group">
                  <span className="input-group-addon">
                      <i className="fa fa-search"></i>
                  </span>
                  <Autosuggest suggestions={this.getSuggestions}
                               inputAttributes={inputAttributes}
                               suggestionRenderer={this.renderSuggestion}
                               onSuggestionSelected={this.typeaheadItemSelected}
                               suggestionValue={this.suggestionValue}
                               scrollBar={true}
                               value={this.props.data} />
        </div>
    );
  }
});
