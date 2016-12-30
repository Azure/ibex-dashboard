import React from 'react';
import { getHumanDateFromNow, getSentimentDescription } from '../../utils/Utils.js';
import { getSentimentStyle } from '../../utils/Style.js';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import Highlighter from 'react-highlight-words';
import Chip from 'material-ui/Chip';
import MapViewPort from './MapViewPort';
import {blue300, indigo900} from 'material-ui/styles/colors';

const styles = {
    chip: {
      margin: 4,
    },
    highlight: {
        backgroundColor: '#ffd54f',
        fontWeight: '600'
    }
};

export default class Tweet extends React.Component {

    render() {
        const text = this.props.content.sentence;
        const tags = this.props.content.featureEdges || [];
        const dateText = getHumanDateFromNow(this.props.content.postedTime, "MM/DD HH:mm:ss");
        const sentiment = this.props.content.sentiment;
        const coordinates = this.props.content.coordinates;
        const originalSource = this.props.content.originalSource;
        const sentimentStyle = getSentimentStyle(sentiment);
        const sentimentDescription = getSentimentDescription(sentiment);

        return (
            <div id="fact">
                <div className="container-fluid">
                    <div className="row whitespace">
                      <div className="col-md-3 viewport">
                        <p className="drop">
                            <MapViewPort coordinates={coordinates} mapSize={[375, 400]}/>
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
                                <p className="drop"><i className="fa fa-clock-o fa-1"></i><span className="date">{dateText}</span></p>
                                <p className="subheading">Sources</p>
                                <div className="drop">
                                {
                                    originalSource && originalSource !== "" && !originalSource.startsWith("twitter") ? 
                                        <Chip key={originalSource} style={styles.chip}>
                                                                <Avatar icon={<FontIcon className="material-icons">share</FontIcon>} />
                                                                {originalSource}
                                        </Chip> : undefined
                                }
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

};

Tweet.defaultProps = {
    content: null,
};

Tweet.propTypes = {
    content: React.PropTypes.object.isRequired,
};