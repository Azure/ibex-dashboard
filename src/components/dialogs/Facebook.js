import React from 'react';
import { getHumanDate } from '../../utils/Utils.js';

export default class Facebook extends React.Component {

    render() {
        const text = this.props.content.sentence;
        const dateText = getHumanDate(this.props.content.postedTime, "MM/DD HH:mm:ss");
        const sentiment = this.props.content.sentiment;
        return (
            <div className="facebook">
                <p>{dateText}</p>
                <p>{text}</p>
                
                <p>Sentiment: {sentiment}</p>
            </div>
        );
    }

};

Facebook.defaultProps = {
    content: null,
};

Facebook.propTypes = {
    content: React.PropTypes.object,
};