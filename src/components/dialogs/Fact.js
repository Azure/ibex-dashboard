import React from 'react';
import Fluxxor from 'fluxxor';
import { getHumanDateFromNow, getSentimentDescription } from '../../utils/Utils.js';
import { getSentimentStyle } from '../../utils/Style.js';
import MapViewPort from './MapViewPort';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import Highlighter from 'react-highlight-words';
import Chip from 'material-ui/Chip';
import {blue300, indigo900} from 'material-ui/styles/colors';

const sourcesBlackList = ["http://www.alchemyapi.com/","http://www.bing.com/","http://www.tadaweb.com/"];
const FluxMixin = Fluxxor.FluxMixin(React),
  StoreWatchMixin = Fluxxor.StoreWatchMixin("FactDetailStore");
const styles = {
    listItemHeader: {
        font: '.777777778em Arial,Helvetica,sans-serif',
        marginBottom: '3px',
        fontWeight: 500,
        marginTop: '2px',
        textAlign: 'left',
        color: '#f44d3c',
        fontSize: '22px'
    },
    title: {
        font: '.777777778em Arial,Helvetica,sans-serif',
        fontWeight: 700,
        fontSize: '16px',
        color: 'rgb(51, 122, 183)'
    },
    chip: {
      margin: 4,
    },
    highlight: {
        backgroundColor: '#ffd54f',
        fontWeight: '600'
    }
};

export const Fact = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],

  _loadFactDetail: function (id) {
    this.getFlux().actions.DASHBOARD.loadDetail(this.props.siteKey, id, ["tadaweb"], []);
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

    const factDetail = this.state.factDetail.properties || {};
    const dateCreated = getHumanDateFromNow(factDetail.createdtime);
    const text = factDetail.fullText || factDetail.sentence;
    const originalSource = factDetail.properties.originalSources && factDetail.properties.originalSources.length > 0 ? factDetail.properties.originalSources : "";
    const title = factDetail.properties.title || "";
    const tags = this.props.content.featureEdges || [];
    const link = factDetail.properties.link || "";
    const sentiment = factDetail.sentiment;
    const sentimentStyle = getSentimentStyle(sentiment);
    const sentimentDescription = getSentimentDescription(sentiment);

    return (
      <div id="fact">
        <div className="container-fluid">
          <div className="row whitespace">
            <div className="caption">
              <h6 style={styles.listItemHeader}>
                    {
                        title !== "" ? <span>{title}</span> : undefined
                    }
                    {  
                        link !== "" ? <span className="link"><a href={link} target="_blank">Read Original</a></span>
                          : undefined
                    }
              </h6>
              <h3>{}</h3>
            </div>
            <div className="col-md-3 viewport">
              <p className="drop">
                   <MapViewPort coordinates={this.state.factDetail.coordinates} mapSize={[375, 400]}/>
              </p>
            </div>
            <div className="col-md-7">
              <div className="article">
                <p className="text">
                   <Highlighter searchWords={tags}
                                highlightStyle={styles.highlight}
                                textToHighlight={text} />
                </p>
              </div>
            </div>
            <div className="col-md-2">
              <div className="details">
                <p className="subheading sentiment" style={sentimentStyle} title={sentiment}>{sentimentDescription}</p>
                <p className="subheading">Date created</p>
                <p className="drop"><i className="fa fa-clock-o fa-1"></i><span className="date">{dateCreated}</span></p>
                <p className="subheading">Sources</p>
                <div className="drop">
                  {originalSource && originalSource.filter(source=>sourcesBlackList.indexOf(source)===-1).map(source => {
                      let sourceFormatted = source.replace(/http:\/\/www./g, '').replace(/.com\//g, '').replace(/http:\/\//g, '').replace(/https:\/\//g, '');
                      
                      return <Chip key={sourceFormatted} style={styles.chip}>
                                              <Avatar icon={<FontIcon className="material-icons">share</FontIcon>} />
                                            {sourceFormatted}
                             </Chip>;
                   })}
                </div>
                <p className="subheading">Tags</p>
                <div className="drop">
                  {tags && tags.map(tag => <Chip key={tag} backgroundColor={blue300} style={styles.chip}>
                                              <Avatar size={32} color={blue300} backgroundColor={indigo900}>
                                                {tag.substring(0, 2)}
                                              </Avatar>
                                            {tag}
                                           </Chip>)}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

});
