import React, { Component } from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import $ from 'jquery';
import moment from 'moment';

import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import IntenStore from '../../../stores/IntentStore';
import IntentActions from '../../../actions/IntentActions';

import './ConversationMessages.css'
var styles = {
  item: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  timestamp: {
    width: '30%'
  },
  message: {
    width: '70%',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
}

class ConversationMessages extends Component {
  // static propTypes = {}
  // static defaultProps = {}

  static getStores() {
    return [IntenStore];
  }

  static getPropsFromStores() {
    return IntenStore.getState();
  }

  handleClose() {
    IntentActions.selectConversation(null);
  }

  componentDidUpdate() {
    var $container = $('.dialog-messages').find('h3').first().next();
    var $content = $container.find('>div');
    $container.animate({ scrollTop: $content.height() }, 'slow');
  }

  render() {
    const { selectedConversation, conversationMessages } = this.props;
    
    // Display tabs for all messages or grouped by type
    var dialogActions = [
        <FlatButton
          label="Cancel"
          primary={true}
          onTouchTap={this.handleClose}
        />,
    ]

    return (
      <Dialog
        className='dialog-messages'
        title={`Messages for ${selectedConversation}`}
        modal={false}
        open={!!selectedConversation}
        actions={dialogActions}
        autoScrollBodyContent={true}
        onRequestClose={this.handleClose}>
        <Table selectable={false} multiSelectable={false}>
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={styles.timestamp}>Timestamp</TableHeaderColumn>
              <TableHeaderColumn style={styles.message}>Message</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {conversationMessages.map( (msg, index) => (
              <TableRow key={index}>
                <TableRowColumn style={styles.timestamp}>
                  {moment(msg.timestamp).format('MMM-DD HH:mm:ss')}
                </TableRowColumn>
                <TableRowColumn className={msg.eventName.replace(/\./g, '_')} style={styles.message}>{msg.message}</TableRowColumn>
              </TableRow>
              ))}
          </TableBody>
        </Table>
      </Dialog>
    );
  }
}

export default connectToStores(ConversationMessages);