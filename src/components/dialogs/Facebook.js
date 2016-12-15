import React from 'react';
import { getHumanDateFromNow, getSentimentDescription } from '../../utils/Utils.js';
import { getSentimentStyle } from '../../utils/Style.js';
import {SERVICES} from '../../services/services';

export default class Facebook extends React.Component {

    _loadDetail(id){
        let fields = ["messageid", "sentence", "edges", "createdtime", "sentiment", "orig_language", "source"];
        let additionalVars = {}; // NB: need to figure out how to pass langCode dynamically? eg. {"langCode": "ar"};
        SERVICES.FetchMessageDetail(this.props.siteKey, id, ["facebook-messages"], fields, additionalVars, (error, response, body) => {
            if (error || response.statusCode !== 200 || !body.data || !body.data.event ) {
                console.error("Failed to fetch details for id:", id, error);
                return;
            }
            let payload = body.data.event;
            this.setState({...payload});
        });
    }

    componentDidMount() {
        console.log(this.props);
        this._loadDetail(this.props.content.id);
    }

    render() {
        // loading details
        if (!this.state){
            return (
                <div className="facebook">
                    <p>Loading details&hellip;</p>
                </div>
            );
        }
        // show details
        const text = this.state.properties.sentence || this.props.content.sentence;
        const dateText = getHumanDateFromNow(this.state.properties.createdtime);
        const sentiment = this.state.properties.sentiment;
        const sentimentStyle = getSentimentStyle(sentiment);
        const sentimentDescription = getSentimentDescription(sentiment);
        return (
            <div className="facebook">
                <p className="date">{dateText}</p>
                <p className="title">{text}</p>
                <p className="sentiment" style={sentimentStyle} title={sentiment}>{sentimentDescription}</p>
            </div>
        );
    }

};

Facebook.defaultProps = {
    content: null,
};

Facebook.propTypes = {
    content: React.PropTypes.object.isRequired,
};