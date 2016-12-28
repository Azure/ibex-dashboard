import Fluxxor from 'fluxxor';
import React from 'react';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import '../styles/TypeaheadSearch.css';

const FluxMixin = Fluxxor.FluxMixin(React);
//const maxDefaultResult = 12;
const getSuggestionValue = (suggestion, lang) => {return suggestion[lang === 'en'? 'name': 'name_'+lang].trim();}
const getSuggestions = (value, edgeMap) => {

  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let filteredTerms = [];

  if(inputLength === 0){
      return [];
  } else{
      for (let key of edgeMap.keys()) {
          if(key.indexOf(inputValue) > -1){
                filteredTerms.push(edgeMap.get(key));
          }
      }
  }

  return filteredTerms;
};

export const TypeaheadSearch = React.createClass({
  mixins: [FluxMixin],

  getInitialState(){
      return {
          suggestions: [],
          defaultResults: [],
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
    event.preventDefault();
    this.getFlux().actions.DASHBOARD.reloadVisualizationState(this.props.siteKey, this.props.datetimeSelection, 
                                                              this.props.timespanType, this.props.dataSource, suggestion);
  },

  onChange(event, { newValue }){
    const value = newValue;

    this.setState({value});
  },

  getStateFromFlux() {
    return this.getFlux().store("DataStore").getState();
  },

  onSuggestionsFetchRequested({ value }){
    const state = this.getStateFromFlux();

    this.setState({
      suggestions: getSuggestions(value, state.allEdges.get(this.props.language))
    });
  },
  
  renderSuggestion(element, {query}) { 
    const suggestionText = element[this.props.language === 'en'? 'name': 'name_'+this.props.language];
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
                                getSuggestionValue={(value)=>getSuggestionValue(value, this.props.language)} />
                                : undefined
                  }
        </div>
    );
  }
});