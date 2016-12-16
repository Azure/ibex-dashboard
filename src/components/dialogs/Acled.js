import React from 'react';
import { getHumanDateFromNow, getSentimentDescription } from '../../utils/Utils.js';
import { getSentimentStyle } from '../../utils/Style.js';

export default class Acled extends React.Component {

    render() {
        const text = this.props.content.sentence;
        const dateText = getHumanDateFromNow(this.props.content.postedTime, "MM/DD HH:mm:ss");
        const sentiment = this.props.content.sentiment;
        const sentimentStyle = getSentimentStyle(sentiment);
        const sentimentDescription = getSentimentDescription(sentiment);

        return (
            <div className="acled">
                <p className="date">{dateText}</p>
                <p className="title">{text}</p>   
                <p className="sentiment" style={sentimentStyle} title={sentiment}>{sentimentDescription}</p>
            </div>
        );
    }

};

Acled.defaultProps = {
    content: null,
};

Acled.propTypes = {
    content: React.PropTypes.object.isRequired,
};