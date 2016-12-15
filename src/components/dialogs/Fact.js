import React from 'react';
import Fluxxor from 'fluxxor';
import { Link } from 'react-router';
import { getHumanDateFromNow, getSentimentDescription } from '../../utils/Utils.js';
import { getSentimentStyle } from '../../utils/Style.js';

const FluxMixin = Fluxxor.FluxMixin(React),
  StoreWatchMixin = Fluxxor.StoreWatchMixin("FactDetailStore");

export const Fact = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],

  _loadFactDetail: function (id) {
    let fields = ["messageid","sentence","edges","createdtime","sentiment","orig_language","source","fullText"];
    this.getFlux().actions.DASHBOARD.loadDetail(this.props.siteKey, id, ["tadaweb"], fields);
  },

  getInitialState: function () {
    this._loadFactDetail(this.props.content.id);
  },

  getStateFromFlux: function () {
    let state = this.getFlux().store("FactDetailStore").getState();
    // prevent FOC
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
    let dateCreated = getHumanDateFromNow(fact.createdtime);
    let text = fact.fullText || fact.sentence;
    let sources = fact.sources || [];
    let tags = fact.tags || [];
    let sentiment = fact.sentiment;
    let sentimentStyle = getSentimentStyle(sentiment);
    let sentimentDescription = getSentimentDescription(sentiment);

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
                  {sources && sources.map(function (url) {
                    return <li key={url}><a href={url} className="truncate" target="_blank">{url}</a></li>;
                  })}
                </ul>

                <p className="subheading">Tags</p>
                <ul className="drop">
                  {tags && tags.map(function (tag) {
                    return <li key={tag}><Link to={`/site/${this.props.siteKey}/facts/tags/${tag}`}>{tag}</Link></li>;
                  },this)}
                </ul>

                <p className="subheading sentiment" style={sentimentStyle} title={sentiment}>{sentimentDescription}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

});
