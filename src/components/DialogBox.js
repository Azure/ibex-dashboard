import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
// view components
import Tweet from './dialogs/Tweet.js';
import Facebook from './dialogs/Facebook.js';
import {Fact} from './dialogs/Fact.js';
import Acled from './dialogs/Acled.js';

const dialogContentStyle = {
  width: '80%',
  maxWidth: 'none'
};

const innerContentStyle = {
    height: '400px'
};

export default class DialogBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    open = (data) => {
        this.setState({ open: true, data: data });
    }

    close = () => {
        this.setState({ open: false });
    }

    render() {
        const actions = [
            <FlatButton
                label="Done"
                primary={true}
                onTouchTap={this.close}
                />,
        ];
        const content = this.renderType();
        const title = (this.state.data && this.state.data.title) ? this.state.data.title : "";
        
        return (
            <Dialog
                    title={title}
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.close}
                    autoScrollBodyContent={true}
                    contentStyle={dialogContentStyle}
                    >
                    <div className="content" style={innerContentStyle}>{content}</div>
                </Dialog>
        );
    }

    renderType() {
        if (!this.state.data) {
            return;
        }
        let type = this.state.data.source || this.state.data.type;
        if (!type) {
            return this.renderText("Unknown data source");
        }
        switch(type) {
            case "twitter":
                return ( <Tweet {...this.props} content={this.state.data}></Tweet> );
            case "facebook":
            case "facebook-messages":
                return ( <Facebook {...this.props} content={this.state.data}></Facebook> );
            case "fact":
            case "tadaweb":
                return ( <Fact {...this.props} content={this.state.data}></Fact> );
            case "acled":
                return ( <Acled {...this.props} content={this.state.data}></Acled> );
            default:
                return this.renderText("Unknown data type");
        }
    }

    renderText(title) {
        return (
            <div className="default">
                <h1>{title}</h1>
            </div>
        );
    }

};
