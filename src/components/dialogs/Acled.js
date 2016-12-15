import React from 'react';
import { getHumanDateFromNow } from '../../utils/Utils.js';

export default class Acled extends React.Component {

    render() {
        const text = this.props.content.sentence;
        const dateText = getHumanDateFromNow(this.props.content.postedTime, "MM/DD HH:mm:ss");
        const sentiment = this.props.content.sentiment;
        return (
            <div className="acled">
                <p>{dateText}</p>
                <p>{text}</p>
                <p>Sentiment: {sentiment}</p>
            </div>
        );
    }

};

Acled.defaultProps = {
    content: null,
};

Acled.propTypes = {
    content: React.PropTypes.object,
};