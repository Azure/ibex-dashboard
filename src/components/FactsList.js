import React from 'react';
import Fluxxor from 'fluxxor';
import ListView from './ListView';
import { Link } from 'react-router';
import {SERVICES} from '../services/services';
import { getHumanDate, containsEqualValues, contains } from '../utils/Utils.js';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';

// Material UI style overrides
const styles = {
  radioButton: {
    width: "auto",
    float: "left",
    marginRight: "20px"
  },
  checkbox: {
    marginTop: "6px",
    marginRight: "20px"
  },
  iconStyle: {
    marginRight: "4px"
  },
  button: {
    marginLeft:"5px",
    height:"20px",
    lineHeight:'1',
    textAlign: "center",
  },
};

const FluxMixin = Fluxxor.FluxMixin(React),
  StoreWatchMixin = Fluxxor.StoreWatchMixin("FactsStore");

export const FactsList = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],

  displayName: 'FactsList',

  // Card sizes
  _cardWidth: 320,
  _cardHeight: 140,
  _gutter: 20,

  resetState: function (state, filter) {
    state.loaded = false;
    state.facts = [];
    state.skip = 0;
    state.pageState.filter = filter;
    return state;
  },

  getStateFromFlux: function () {
    let state = this.getFlux().store("FactsStore").getState();
    const tags = this.fragmentToArray(this.props.tags);
    const filter = state.pageState.filter;
    if (!containsEqualValues(tags, filter)) {
      // changed page
      return this.resetState(state, tags);
    }
    return state;
  },

  componentWillReceiveProps: function (nextProps) {
    let state = this.getStateFromFlux();
    const tags = this.fragmentToArray(this.props.tags);
    const filter = this.fragmentToArray(nextProps.tags);
    if (!containsEqualValues(tags, filter)) {
      // reset page state when page query is changed
      state = this.resetState(state, filter);
    }
    this.setState(state);
  },

  componentDidMount: function () {
    // get list of unique tags
    if (this.state.tags.length === 0) {
      this.loadTags();
    }
    // get first page of all facts 
    if (this.state.facts.length === 0) {
      this.loadFacts();
    }
  },

  componentDidUpdate(prevProps, prevState) {
    const tags = this.fragmentToArray(this.props.tags);
    const filter = this.fragmentToArray(prevProps.tags);
    // update facts with selected page filter
    if (!containsEqualValues(tags, filter)) {
      this.loadFacts();
    }
  },

  render() {
    // Loading state
    if (!this.state.loaded) {
      return (<div className="loadingPage"><p>Loading facts&hellip;</p></div>);
    }

    const facts = this.state.facts;
    const tags = this.renderTags();

    // No results
    if (facts.length === 0) {
      return (
        <div id="facts" >
          <div id="filters">
            {tags}
          </div>
          <div className="noResults">
            <h3>No facts found.</h3>
            <p>Suggestions:</p>
            <ul>
              <li>Try reducing number of tag filters</li>
              <li><Link to={`/site/${this.props.siteKey}/facts/`}>Reset filters</Link></li>
            </ul>
          </div>
        </div>);
    }

    // List view 
    return (
      <div id="facts">
        <div id="filters">
          {tags}
        </div>
        <ListView ref="factsListView"
          minCardWidth={this._cardWidth}
          maxCardHeight={this._cardHeight}
          gutter={this._gutter}
          items={facts}
          renderCardItem={this.renderCardItem}
          loadItems={this.loadFacts}
          subtractedElements={['.navbar', '#filters']}
          />
      </div>
    );
  },

  translate(sentence, fromLanguage, toLanguage, factId) {
      let self = this;
      SERVICES.translateSentence(sentence, fromLanguage, toLanguage, (translatedSentence, error) => {
        if(translatedSentence){
          self.state.facts.forEach(fact => {
              if (fact.id === factId) {
                fact.language = toLanguage;
                fact.title = translatedSentence
              }
          });
          self.setState({
              elements: self.state
          });
        }
        else{
          console.error(`[${error}] occured while translating sentense`);
        }
      }
      );
  },

  renderCardItem(item, style) {
    const dateString = getHumanDate(item.id);
    return (
      <div className="cell" style={style}>
        <div className="card">
          <p className="date">{dateString}
           {this.state.language!=item.language ?<button className="btn btn-primary btn-sm"  style={styles.button} 
           onClick={() => this.translate(item.title, item.language, this.state.language, item.id)}>Translate</button>: ''}
          </p>
          <h3 className="title truncate-2"><Link to={`/site/${this.props.siteKey}/facts/detail/${item.id}`}>{item.title}</Link></h3>
          <ul className="tags">
            {item.tags.sort().map(function (tag) {
              return <li key={tag}><Link to={`/site/${this.props.siteKey}/facts/tags/${tag}`}>{tag}</Link></li>;
            }, this)}
          </ul>
        </div>
      </div>
    );
  },

  renderTags() {
    const tags = this.state.tags;
    const filter = this.state.pageState.filter;
    const hasFiltered = (filter.length > 0);
    if (tags.length === 0) {
      return;
    }
    return (
      <ul className="uniqueTags">
        {tags && tags.map(tag => {
          let isChecked = contains(filter, tag);
          return <li key={tag} className="checkboxes"><Checkbox id={tag} label={tag} defaultChecked={isChecked} onCheck={this.onCheck} style={styles.checkbox} iconStyle={styles.iconStyle} /></li>;
        })}
        <li><FlatButton label="Apply" style={styles.button} onClick={this.onApply} /></li>
        {hasFiltered &&
          <li><FlatButton label="Reset" href={`/#/site/${this.props.siteKey}/facts/`} style={styles.button} /></li>
        }
      </ul>
    );
  },

  loadTags: function () {
    this.getFlux().actions.FACTS.load_fact_tags();
  },

  loadFacts() {
    const skip = this.state.skip;
    const pageSize = this.state.pageSize;
    let tagArray = [];
    if (this.state.pageState.filter.length > 0) {
      tagArray = this.state.pageState.filter;
    }
    this.getFlux().actions.FACTS.load_facts(pageSize, skip, tagArray);
  },

  fragmentToArray(fragment) {
    return (fragment) ? fragment.split('+') : [];
  },

  arrayToFragment(array) {
    return (array) ? array.join('+') : "";
  },

  onCheck(e, isChecked) {
    // checkbox has changed
  },

  onApply(e) {
    let url = "/site/{0}/facts/".format(this.props.siteKey);
    const newFilter = this.getNewFilter();
    if (newFilter.length !== 0) {
      let fragment = this.arrayToFragment(newFilter);
      url = "/site/{0}/facts/tags/{1}".format(this.props.siteKey, fragment)
    }
    // change page url fragment
    window.location.hash = url;
  },

  getNewFilter() {
    const checkedList = document.querySelectorAll('input:checked');
    if (checkedList.length === 0) {
      return [];
    }
    return [].map.call(checkedList, (x) => x.id);
  }

});