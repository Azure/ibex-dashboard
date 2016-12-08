import React from 'react';
import Fluxxor from 'fluxxor';
import { Link } from 'react-router';
import { getHumanDate } from '../utils/Utils.js';

const FluxMixin = Fluxxor.FluxMixin(React),
  StoreWatchMixin = Fluxxor.StoreWatchMixin("FactsStore");

export const FactDetail = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],

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

  render() {
    let filter = "";
    if (this.state.pageState.filter.length > 0) {
      filter = "tags/" + this.state.pageState.filter.join('+');
    }
    const back = "/site/{0}/facts/{1}".format( this.props.siteKey, filter );

    // loading state
    if (!this.state.factDetail) {
      return (
        <div id="fact">
          <div className="container-fluid">

            <div className="row topBar">
              <div className="col-md-3">
                <Link to={back} className="navBtn">&lt; Back</Link>
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
                <Link to={back} className="navBtn">&lt; Back</Link>
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
    let dateProcessed = getHumanDate(factDetail.date);
    let datePublished = this._validDateString(fact.published_at); // NB: Using string for date here due to mixed formatting

    let prev = this.state.factLinks.prev;
    let next = this.state.factLinks.next;

    return (
      <div id="fact">
        <div className="container-fluid">

          <div className="row topBar">
            <div className="col-md-3">
              <Link to={back} className="navBtn">&lt; Back</Link>
            </div>
            <div className="col-md-6">
            </div>
            <div className="col-md-3">
            </div>
          </div>

          <div className="row whitespace">
            <div className="col-md-3">
              <div className="details">
                {prev && <Link to={`/site/${this.props.siteKey}/facts/detail/${prev.id}`} className="truncate">&larr; {prev.title}</Link>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="details">
                {next && <Link to={`/site/${this.props.siteKey}/facts/detail/${next.id}`}>{next.title} &rarr;</Link>}
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
                  {fact.sources.map(function (url) {
                    return <li key={url}><a href={url} className="truncate" target="_blank">{url}</a></li>;
                  })}
                </ul>

                <p className="subheading">Tags</p>
                <ul className="drop">
                  {fact.tags.map(function (tag) {
                    return <li key={tag}><Link to={`/site/${this.props.siteKey}/facts/tags/${tag}`}>{tag}</Link></li>;
                  },this)}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  },

  _validDateString(dateString) {
    if (dateString.length !== 10) {
      return "";
    }
    return dateString;
  }

});
