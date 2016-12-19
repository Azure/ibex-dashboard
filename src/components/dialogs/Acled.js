import React from 'react';
import { getHumanDateFromNow, getSentimentDescription } from '../../utils/Utils.js';
import { getSentimentStyle } from '../../utils/Style.js';
import {SERVICES} from '../../services/services';

export default class Acled extends React.Component {
    _loadDetail(id){
        SERVICES.FetchMessageDetail(this.props.siteKey, id, ["acled"], [], (error, response, body) => {
            if (error || response.statusCode !== 200 || !body.data || !body.data.event ) {
                console.error("Failed to fetch details for id:", id, error);
                return;
            }
            let payload = body.data.event;
            this.setState({...payload});
        });
    }

    componentDidMount() {
        this._loadDetail(this.props.content.id);
    }

    render() {
        if (!this.state){
            return (
                <div className="facebook">
                    <p>Loading details&hellip;</p>
                </div>
            );
        }
        const text = this.state.properties.fullText || this.state.properties.sentence;
        const dateText = getHumanDateFromNow(this.state.properties.createdtime, "MM/DD HH:mm:ss");
        const sentiment = this.state.properties.sentiment;
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