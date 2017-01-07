import React, { Component } from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';

import {List, ListItem} from 'material-ui/List';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import ErrorsStore from '../../stores/ErrorsStore';
import ErrorsActions from '../../actions/ErrorsActions';

class ErrorDetails extends Component {
  // static propTypes = {}
  // static defaultProps = {}

  static getStores() {
    return [ErrorsStore];
  }

  static getPropsFromStores() {
    return ErrorsStore.getState();
  }

  handleClose() {
    ErrorsActions.selectError(null);
  }

  render() {
    const { selectedError } = this.props;
    
    // Display tabs for all messages or grouped by type
    var dialogActions = [
        <FlatButton
          label="Cancel"
          primary={true}
          onTouchTap={this.handleClose}
        />,
    ];

    return (
      <Dialog
        title={`Error Details`}
        modal={false}
        open={!!selectedError}
        actions={dialogActions}
        autoScrollBodyContent={true}
        onRequestClose={this.handleClose}>
        <List>
        {Object.keys(selectedError || {}).map( (key, index) => (
          <ListItem key={index}>
            {key}:{(!selectedError[key] && '') || (typeof selectedError[key] == 'string' && selectedError[key]) || JSON.stringify(selectedError[key])}
          </ListItem>
          ))}
        </List>
      </Dialog>
    );
  }
}

export default connectToStores(ErrorDetails);