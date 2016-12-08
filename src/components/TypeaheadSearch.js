import Fluxxor from 'fluxxor';
import React from 'react';
import {SERVICES} from '../services/services';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import '../styles/TypeaheadSearch.css';

const FluxMixin = Fluxxor.FluxMixin(React);
//const maxDefaultResult = 12;
const ENGLISH_LANGUAGE = "en";
const ALL_EDGE_TYPES = "All";
const getSuggestionValue = suggestion => suggestion.name.trim();
const getSuggestions = (value, defaultSuggestions) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 || defaultSuggestions.length === 0 ? [] 
      : defaultSuggestions.filter(edge => edge.name.toLowerCase().indexOf(inputValue) > -1);
};

export const TypeaheadSearch = React.createClass({
  mixins: [FluxMixin],

  getInitialState(){
      return {
          suggestions: [],
          value: ''
      }
  },


  componentWillReceiveProps(nextProps) {
       const value = nextProps.data;

       if(value !== this.state.value){
           this.setState({value});
       }
  },

  onSuggestionSelected(event, { suggestion }){
    this.getFlux().actions.DASHBOARD.changeSearchFilter(suggestion, this.props.siteKey);
  },

  onChange(event, { newValue }){
    const value = newValue;

    this.setState({value});
  },

  onSuggestionsFetchRequested({ value }){
    this.setState({
      suggestions: getSuggestions(value, this.props.edges)
    });
  },
  
  renderSuggestion(element, language, {query}) { 
    const suggestionText = element[language=='en'?'name':'name_'+language];
    console.log("suggestionText", suggestionText);
    const matches = match(suggestionText, query);
    const parts = parse(suggestionText, matches);
    const iconMap = new Map([["Location", "fa fa-map-marker fa-2x"], ["Term", "fa fa-tag fa-2x"]]);

    return (
      <span className="suggestion-content">
        <span className="type">
          {<i className={iconMap.get(element.type)} />}
        </span>
        <span className="name">
          {
            parts.map((part, index) => {
              const className = part.highlight ? 'highlight' : null;

              return (
                <span className={className} key={index}>{part.text}</span>
              );
            })
          }
        </span>
      </span>
    );
  },

  onSuggestionsClearRequested(){
    this.setState({
      suggestions: []
    });
  },
  
  render: function(){
    const { suggestions, value } = this.state;
    const inputProps = {
      placeholder: 'Type \'c\'',
      value,
      onChange: this.onChange
    };

    return (
        <div className="input-group">
                  <span className="input-group-addon">
                      <i className="fa fa-search"></i>
                  </span>
                  { 
                    this.props.data ? 
                      <Autosuggest suggestions={suggestions}
                                inputProps={inputProps}
                                focusInputOnSuggestionClick={true}
                                onSuggestionSelected={this.onSuggestionSelected}
                                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                onSuggestionsClearRequested={this.onSuggestionsClearRequested}                               
                                renderSuggestion={this.renderSuggestion}
                                getSuggestionValue={getSuggestionValue} />
                                : undefined
                  }
        </div>
    );
  }
});
