import React from 'react';
import Fluxxor from 'fluxxor';
import { Link } from 'react-router';
import { getHumanDate } from '../../utils/Utils.js';

const FluxMixin = Fluxxor.FluxMixin(React),
  StoreWatchMixin = Fluxxor.StoreWatchMixin("FactDetailStore");

export const Fact = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],

  _loadFactDetail: function (id) {
    console.log("load id:", id, "props:", this.props);
    this.getFlux().actions.DASHBOARD.loadDetail(this.props.siteKey, id, ["tadaweb"]);//FACTS.load_fact(id);
  },

  getInitialState: function () {
    this._loadFactDetail(this.props.content.id);
  },

  getStateFromFlux: function () {
    let state = this.getFlux().store("FactDetailStore").getState();
    // prevent FOC
    console.log("state:", state, " props:", this.props);
    if (state.factDetail && state.factDetail.properties.messageid !== this.props.content.id) {
        state.factDetail = null;
    }
    return state;
  },

  render() {

    // loading state
    if (!this.state.factDetail) {
      return (
        <div className="fact">
          <div className="container-fluid">
            <p>Loading fact&hellip;</p>
          </div>
        </div>
      );
    }

    // error
    if (!this.state.factDetail.properties) {
      console.log("fact detail:", this.state.factDetail);
      return (
        <div className="fact">
          <div className="container-fluid">

            <div className="row">
              <div className="col-md-12"><h1>Error, unexpected fact data.</h1></div>
            </div>

          </div>
        </div>
      );
    }

    let factDetail = this.state.factDetail;
    let fact = factDetail.properties;
    let dateCreated = getHumanDate(fact.createdtime, "ddd MMM DD YYYY HH:mm:ss zZZ");
    let text = fact.sentence;

    return (
      <div className="fact">
        <div className="container-fluid">

          <div className="row whitespace">
            <div className="col-md-9">
              <div className="article">
                <p className="text">{text}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="details">
                <p className="drop"><a href={fact.link} target="_blank">Read Original</a></p>

                <p className="subheading">Date created</p>
                <p className="drop">{dateCreated}</p>

                <p className="subheading">Sources</p>
                <ul className="drop">
                  {fact.sources && fact.sources.map(function (url) {
                    return <li key={url}><a href={url} className="truncate" target="_blank">{url}</a></li>;
                  })}
                </ul>

                <p className="subheading">Tags</p>
                <ul className="drop">
                  {fact.tags && fact.tags.map(function (tag) {
                    return <li key={tag}><Link to={`/site/${this.props.siteKey}/facts/tags/${tag}`}>{tag}</Link></li>;
                  },this)}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

});
