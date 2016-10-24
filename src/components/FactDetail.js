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

  getInitialState: function () {
    var factId = this.props.factId;
    this.getFlux().actions.FACTS.load_fact(factId);
  },

  getStateFromFlux: function () {
    return this.getFlux().store("FactsStore").getState();
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState(this.getStateFromFlux());
  },

  render() {
    // loading state
    if (!this.state.factDetail) {
      return (
        <div className="loadingPage"><p>Loading fact&hellip;</p></div>
      );
    }

    // error
    if (!this.state.factDetail.fact) {
      return (
        <div id="fact">
          <div className="container-fluid">

            <div className="row topBar">
              <div className="col-md-2">
                <Link to={`/site/${this.props.siteKey}/facts`} className="navBtn">&lt; Back</Link>
              </div>
              <div className="col-md-8">
              </div>
              <div className="col-md-2">
              </div>
            </div>

            <div className="row">
              <div className="col-md-12"><h1>Error, fact data not found.</h1></div>
            </div>

          </div>
        </div>
      );
    }

    var factDetail = this.state.factDetail;
    var fact = factDetail.fact;
    var dateProcessed = getHumanDate(factDetail.id);
    var datePublished = getHumanDate(fact.published_at);

    return (
      <div id="fact">
        <div className="container-fluid">

          <div className="row topBar">
            <div className="col-md-2">
              <Link to={`/site/${this.props.siteKey}/facts`} className="navBtn">&lt; Back</Link>
            </div>
            <div className="col-md-8">
            </div>
            <div className="col-md-2">
            </div>
          </div>

          <div className="row whitespace">
            <div className="col-md-3">
            </div>
            <div className="col-md-6">
              <h1>{fact.title}</h1>
              <p className="text">{fact.text}</p>
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

});
