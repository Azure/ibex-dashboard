import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
// view components
import Tweet from './dialogs/Tweet.js';
import Facebook from './dialogs/Facebook.js';
import Acled from './dialogs/Acled.js';
import {Fact} from './dialogs/Fact.js';
import '../styles/DialogBox.css';

const dialogWideStyle = {
  width: '80%',
  maxWidth: 'none'
};

const dialogCompactStyle = {
  width: '50%',
  maxWidth: 'none'
};

const contentLoadingStyle = {
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
        const dialogStyle = this.renderDialogStyle();
        const contentStyle = this.renderContentStyle();
        return (
            <Dialog
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.close}
                    autoScrollBodyContent={true}
                    contentStyle={dialogStyle}
                    >
                    <div className="content" style={contentStyle}>{content}</div>
                </Dialog>
        );
    }

    renderType() {
        if (!this.state.data) {
            return;
        }
        let type = this.state.data.source;
        if (!type) {
            return this.renderText("Unknown data source");
        }
        switch(type) {
            case "twitter":
                return ( <Tweet {...this.props} content={this.state.data}></Tweet> );
            case "facebook-messages":
                return ( <Facebook {...this.props} content={this.state.data}></Facebook> );
            case "facebook-comments":
                return ( <Facebook {...this.props} content={this.state.data}></Facebook> );
            case "tadaweb":
                return ( <Fact {...this.props} content={this.state.data}></Fact> );
            case "acled":
                return ( <Acled {...this.props} content={this.state.data}></Acled> );
            default:
                return this.renderText("Unknown data type");
        }
    }

    renderDialogStyle() {
        if (!this.state || !this.state.data) {
            return dialogCompactStyle;
        }
        let type = this.state.data.source;
        if (type === "tadaweb") {
            return dialogWideStyle;
        }
        return dialogCompactStyle;
    }

    renderContentStyle() {
        if (!this.state || !this.state.data) {
            return {};
        }
        let type = this.state.data.source;
        if (type === "tadaweb" || type === "facebook-messages") {
            return contentLoadingStyle;
        }
        return {};
    }

    renderText(title) {
        return (
            <div className="default">
                <h1>{title}</h1>
            </div>
        );
    }

};
