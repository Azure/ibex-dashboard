import React from 'react';
import Fluxxor from 'fluxxor';
import { SERVICES } from '../services/services';
import { Link } from 'react-router';
import { routes } from '../routes/routes';
import { getHumanDate } from '../utils/Utils.js';

const FluxMixin = Fluxxor.FluxMixin(React),
  StoreWatchMixin = Fluxxor.StoreWatchMixin("FactsStore");

export const FactDetail = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],

  factId: null,
  next: null,
  prev: null,

  _loadFactDetail: function (id) {
    this.getFlux().actions.FACTS.load_fact(id);
  },

  getInitialState: function () {
    this._loadFactDetail(this.props.factId);
  },

  getStateFromFlux: function () {
    return this.getFlux().store("FactsStore").getState();
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState(this.getStateFromFlux());
    this._loadFactDetail(nextProps.factId);
  },

  componentWillMount: function() {
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    this._getAdjacentArticles(nextProps.factId);
    return true;
  },

  render() {
    // loading state
    if (!this.state.factDetail) {
      return (
        <div id="fact">
          <div className="container-fluid">

            <div className="row topBar">
              <div className="col-md-3">
                <Link to={`/site/${this.props.siteKey}/facts`} className="navBtn">&lt; Back</Link>
              </div>
              <div className="col-md-6">
              </div>
              <div className="col-md-3">
              </div>
            </div>

            <div className="loadingPage"><p>Loading fact&hellip;</p></div>
          </div>
        </div>
      );
    }

    // error
    if (!this.state.factDetail.fact) {
      return (
        <div id="fact">
          <div className="container-fluid">

            <div className="row topBar">
              <div className="col-md-3">
                <Link to={`/site/${this.props.siteKey}/facts`} className="navBtn">&lt; Back</Link>
              </div>
              <div className="col-md-6">
              </div>
              <div className="col-md-3">
              </div>
            </div>

            <div className="row">
              <div className="col-md-12"><h1>Error, fact data not found.</h1></div>
            </div>

          </div>
        </div>
      );
    }

    let factDetail = this.state.factDetail;
    let fact = factDetail.fact;
    let dateProcessed = getHumanDate(factDetail.id);
    let datePublished = fact.published_at; //getHumanDate(fact.published_at);

    return (
      <div id="fact">
        <div className="container-fluid">

          <div className="row topBar">
            <div className="col-md-3">
              <Link to={`/site/${this.props.siteKey}/facts`} className="navBtn">&lt; Back</Link>
            </div>
            <div className="col-md-6">
            </div>
            <div className="col-md-3">
            </div>
          </div>

          <div className="row whitespace">
            <div className="col-md-3">
              <div className="details">
                {this.prev && <Link to={`/site/${this.props.siteKey}/facts/${this.prev.id}`} className="truncate">&larr; {this.prev.title}</Link>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="details">
                {this.next && <Link to={`/site/${this.props.siteKey}/facts/${this.next.id}`}>{this.next.title} &rarr;</Link>}
              </div>
              <div className="article">
                <h1>{fact.title}</h1>
                <p className="text">{fact.text}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="details">
                <p className="drop"><a href={fact.link} target="_blank">Read Original</a></p>

                <p className="subheading">Date processed</p>
                <p className="drop">{dateProcessed}</p>

                <p className="subheading">Date published</p>
                <p className="drop">{datePublished}</p>

                <p className="subheading">Sources</p>
                <ul className="drop">
                  {fact.sources.map(function (item) {
                    return <li key={item}><a href={item} className="truncate" target="_blank">{item}</a></li>;
                  })}
                </ul>

                <p className="subheading">Tags</p>
                <ul className="drop">
                  {fact.tags.map(function (item) {
                    return <li key={item}>{item}</li>;
                  })}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  },

  _getAdjacentArticles(id) {
    let loadedFacts = this.state.facts;
    let date = this._getDateWithId(id);
    if (!loadedFacts.length > 0 || date === false) {
      return;
    }
    let section = loadedFacts.find(x => x.year === date.year && x.month === date.month && x.day === date.day);
    let sectionIndex = loadedFacts.indexOf(section);
    let facts = section.facts;
    let fact = facts.find(x => x.id === id);
    let index = facts.indexOf(fact);
    let l = facts.length;

    this.prev = this.next = null;
    if (index-1 < l) {
      this.prev = facts[index-1];
    }
    if (index+1 < l) {
      this.next = facts[index+1];
    }

    // prev section
    if (!this.prev && sectionIndex-1 >= 0) {
      let prevFacts = loadedFacts[sectionIndex-1].facts;
      this.prev = prevFacts[prevFacts.length-1];
    }
    // next section
    if (!this.next && sectionIndex+1 < loadedFacts.length) {
      let nextFacts = loadedFacts[sectionIndex+1].facts;
      this.next = nextFacts[0];
    }
  },

  _getDateWithId(id) {
    if (id.length < 10) {
      return false;
    }
    return {
      "year": parseInt(id.substr(0,4) ,10),
      "month": parseInt(id.substr(5,2), 10),
      "day": parseInt(id.substr(8,2), 10)
    };
  }

});
