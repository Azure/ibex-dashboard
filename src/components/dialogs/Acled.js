import React from 'react';
import { getHumanDateFromNow, getSentimentDescription } from '../../utils/Utils.js';
import { getSentimentStyle } from '../../utils/Style.js';
import {SERVICES} from '../../services/services';

const DATETIME_FORMAT = "MM/DD HH:mm:ss";
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
    }
};

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
        const dateText = getHumanDateFromNow(this.state.properties.createdtime, DATETIME_FORMAT);
        const sentiment = this.state.properties.sentiment;
        const originalSource = this.state.properties.properties.originalSources && this.state.properties.properties.originalSources.length > 0 ? this.state.properties.properties.originalSources[0] : "";
        const title = this.state.properties.properties.title;
        const sentimentStyle = getSentimentStyle(sentiment);
        const sentimentDescription = getSentimentDescription(sentiment);

        return (
            <div className="acled">
                <h6 style={styles.listItemHeader}>
                    {
                        originalSource !== "" ? <span>{originalSource}</span> : undefined
                    }
                </h6>
                <p style={styles.title}>{title}</p>
                <p className="title"><i className="fa fa-clock-o fa-1"></i>&nbsp;{dateText}</p>  
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