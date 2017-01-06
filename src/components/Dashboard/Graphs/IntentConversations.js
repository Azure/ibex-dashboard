import React, { Component } from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';

import TextField from 'material-ui/TextField';
import {Tabs, Tab} from 'material-ui'
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import ReportProblem from 'material-ui/svg-icons/action/report-problem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import ActionQuestionAnswer from 'material-ui/svg-icons/action/question-answer';

import IntenStore from '../../../stores/IntentStore';
import IntentActions from '../../../actions/IntentActions';


var styles = {
  item: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  timestamp: {
    width: '30%'
  },
  count: {
    width: '10%',
  },
  message: {
    width: '60%',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
}

class IntentConversations extends Component {
  // static propTypes = {}
  // static defaultProps = {}

  static getStores() {
    return [IntenStore];
  }

  static getPropsFromStores() {
    return IntenStore.getState();
  }

  handleClose() {
    IntentActions.selectIntent(null);
  }

  handleCoversationClick(conversation) {
    IntentActions.selectConversation(conversation.conversation);
  }

  render() {
    const { selectedIntent, intentConversations, selectedConversation } = this.props;
    
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
        title={`Conversations for ${selectedIntent}`}
        modal={false}
        open={!!selectedIntent && !selectedConversation}
        actions={dialogActions}
        autoScrollBodyContent={true}
        onRequestClose={this.handleClose}>
        <Table selectable={false} multiSelectable={false}>
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={styles.message}>Conversations</TableHeaderColumn>
              <TableHeaderColumn style={styles.count}>Count</TableHeaderColumn>
              <TableHeaderColumn style={styles.timestamp}></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {intentConversations.map( (conversation, index) => (
              <TableRow key={index}>
                <TableRowColumn style={styles.message}>{conversation.conversation}</TableRowColumn>
                <TableRowColumn style={styles.count}>{conversation.count}</TableRowColumn>
                <TableRowColumn style={styles.timestamp}>
                  <IconButton onClick={this.handleCoversationClick.bind(this, conversation)}><ActionQuestionAnswer /></IconButton>
                </TableRowColumn>
              </TableRow>
              ))}
          </TableBody>
        </Table>
      </Dialog>
    );
  }
}

export default connectToStores(IntentConversations);