import React from 'react';
import { getHumanDateFromNow, getSentimentDescription } from '../../utils/Utils.js';
import { getSentimentStyle } from '../../utils/Style.js';
import {SERVICES} from '../../services/services';

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

export default class Facebook extends React.Component {

    _loadDetail(id){
        SERVICES.FetchMessageDetail(this.props.siteKey, id, ["facebook-messages", "facebook-comments"], [], (error, response, body) => {
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
        const text = this.state.properties.fullText || this.props.content.sentence;
        const dateText = getHumanDateFromNow(this.state.properties.createdtime);
        const sentiment = this.state.properties.sentiment;
        const sentimentStyle = getSentimentStyle(sentiment);
        const link = this.state.properties.properties.link;
        const tags = this.state.properties.edges || [];
        const originalSource = this.state.properties.properties.originalSources && this.state.properties.properties.originalSources.length > 0 ? this.state.properties.properties.originalSources[0] : "";
        const title = this.state.properties.properties.title || "";
        const sentimentDescription = getSentimentDescription(sentiment);
        return (
            <div className="facebook">
                <h6 style={styles.listItemHeader}>
                    {
                        originalSource !== "" && !originalSource.startsWith("facebook-") ? <span>{originalSource}</span> : undefined
                    }
                </h6>
                {
                    link && link !== "" ? <p className="drop"><a href={link} target="_blank">Read Original</a></p> : undefined 
                }
                <p className="date"><i className="fa fa-clock-o fa-1"></i>&nbsp;{dateText}</p>
                {
                    title !== "" ? <p style={styles.title}>{title}</p> : undefined
                }
                <p className="title">{text}</p>
                <p className="sentiment" style={sentimentStyle} title={sentiment}>{sentimentDescription}</p>
                <p className="subheading">Tags</p>
                <ul className="drop">
                  {tags && tags.map(tag => {
                    return <li key={tag}><span className="label label-primary">{tag}</span></li>
                  },this)}
                </ul>
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