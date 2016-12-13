import React from 'react';
import { getHumanDate } from '../../utils/Utils.js';

export default class Tweet extends React.Component {

    render() {
        const text = this.props.content.sentence;
        const dateText = getHumanDate(this.props.content.postedTime, "MM/DD HH:mm:ss");
        const sentiment = this.props.content.sentiment;
        return (
            <div className="tweet">
                <p>{dateText}</p>
                <p>{text}</p>
                
                <p>Sentiment: {sentiment}</p>
            </div>
        );
    }

};

Tweet.defaultProps = {
    content: null,
};

Tweet.propTypes = {
    content: React.PropTypes.object,
};