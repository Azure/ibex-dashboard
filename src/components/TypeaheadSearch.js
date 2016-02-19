import Fluxxor from 'fluxxor';
import React, { PropTypes, Component } from 'react';
import Autosuggest from 'react-autosuggest';

const FluxMixin = Fluxxor.FluxMixin(React);
const maxDefaultResult = 12;

export const TypeaheadSearch = React.createClass({
  mixins: [FluxMixin],
  
  typeaheadItemSelected(suggestion, event){
    let oldValue =  this.props.data || '';
    let newValue =  suggestion.value || '';
    let newType =  suggestion.type || '';
    
    if(oldValue.trim() === newValue.trim()){
        return;
    }
    
    if(oldValue != newValue){
        this.getFlux().actions.DASHBOARD.changeSearchFilter(newValue, newType);
    }
  },
  
  defaultSuggestions(){
        return this.getFlux().store("DataStore").dataStore.defaultResults;
  },
  
  filterResults(input, callback){
      let filteredResults = [];
      this.getFlux().store("DataStore").dataStore.defaultResults
           .forEach((element, key, map) => {
               if(element.value.toLowerCase().indexOf(input) > -1){
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
    
  handleBlur(value){
      let newValue = value.target.value.trim();
      let oldValue = this.props.data || '';      
  },
  
  renderSuggestion(element, input) { // In this example, 'suggestion' is a string
     let suggestion = element.value; 
     let valueType = element.type;
     
     let beginNormalFont = '', highlightedSequence = '', endNormalFont = '';
     let matchingPosition = suggestion.toLowerCase().indexOf(input.toLowerCase());
         beginNormalFont = suggestion.substring(0, (matchingPosition != -1) ? matchingPosition : input.length);

     if(matchingPosition != -1){
       highlightedSequence = suggestion.substring(matchingPosition, matchingPosition + input.length);
       endNormalFont = suggestion.substring(matchingPosition + input.length, suggestion.length);
     }

    return (                                     // and it returns a ReactElement
      <span><span className="suggestionType">{valueType}</span> - {beginNormalFont}<strong className="react-autosuggest__highlighted_search_text">{(input.length > 0)?highlightedSequence:''}</strong>{endNormalFont}</span>
    );
  },
  
  suggestionValue(suggestion){
      return suggestion.type + ' - ' + suggestion.value;
  },
  
  render: function(){
    let inputAttributes = {
          className: 'twitter-input',
          placeholder: this.props.data || '',
          onBlur: this.handleBlur
    };

    return (
        <div>
           <Autosuggest suggestions={this.getSuggestions}
                        inputAttributes={inputAttributes}
                        suggestionRenderer={this.renderSuggestion}
                        onSuggestionSelected={this.typeaheadItemSelected}
                        showWhen={input => input.trim().length >= 0}
                        suggestionValue={this.suggestionValue}
                        scrollBar = {true} />        
        </div>
    );
  }
});
