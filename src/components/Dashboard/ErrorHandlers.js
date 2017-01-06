import React, { Component } from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';

import TextField from 'material-ui/TextField';
import {Tabs, Tab} from 'material-ui'
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import ReportProblem from 'material-ui/svg-icons/action/report-problem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import ActionOpen from 'material-ui/svg-icons/action/open-in-new';

import ErrorsStore from '../../stores/ErrorsStore';
import ErrorsActions from '../../actions/ErrorsActions';

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
    width: '50%',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  action: {
    width: '10%'
  }
}

class ErrorHandlers extends Component {
  // static propTypes = {}
  // static defaultProps = {}

  static getStores() {
    return [ErrorsStore];
  }

  static getPropsFromStores() {
    return ErrorsStore.getState();
  }

  constructor (props) {
    super(props);

    this.state = {
      selectedTab: 0
    };

    this.updateSearchTerm = this.updateSearchTerm.bind(this);
  }

  handleClose() {
    ErrorsActions.selectHandler(null);
  }

  componentDidMount() {
    const { selectedHandler, timespan, searchTerm } = this.props;
    ErrorsActions.queryExceptions(selectedHandler, timespan, searchTerm);
  }

  updateSearchTerm(event) {
    const { selectedHandler, timespan } = this.props;
    ErrorsActions.updateSearchTerm(event.target.value);
    ErrorsActions.queryExceptions(selectedHandler, timespan, event.target.value);
  }

  escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

  selectTab(tab) {
    this.setState({ selectedTab: tab });
  }

  handleClickError(error) {
    ErrorsActions.selectError(error);
  }

  render() {
    const { selectedHandler, errors, searchTerm, searchResults, selectedError } = this.props;
    
    // Filter grouped messages by search term - does not affect 'all messages' tab
    var errorItems = errors;
    if (searchTerm !== null && searchTerm !== '') {
      var search = new RegExp(this.escapeRegExp(searchTerm), "i");
      errorItems = errorItems.filter(error => {
        return error.message.search(search) >= 0;
      });
    }

    // Display tabs for all messages or grouped by type
    var dialogActions = [
        <Tabs value={this.state.selectedTab}>
          <Tab value={0} onClick={this.selectTab.bind(this, 0)} label='Message Count' />
          <Tab value={1} onClick={this.selectTab.bind(this, 1)} label='All Messages' />
        </Tabs>,
        <TextField onChange={this.updateSearchTerm} hintText="Search for an error..." />,
        <FlatButton
          label="Cancel"
          primary={true}
          onTouchTap={this.handleClose}
        />,
    ]

    var dialogContent = null;
    if (this.state.selectedTab === 0) {
      dialogContent = (
        <Table selectable={false} multiSelectable={false}>
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={styles.message}>Message</TableHeaderColumn>
              <TableHeaderColumn style={styles.count}>Count</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} >
            {errorItems.map( (error, index) => (
              <TableRow key={index}>
                <TableRowColumn style={styles.message}>{error.message}</TableRowColumn>
                <TableRowColumn style={styles.count}>{error.count}</TableRowColumn>
              </TableRow>
              ))}
          </TableBody>
        </Table>
      );
    } else {

      // All messages queried directly on API
      dialogContent = (
        <Table selectable={false} multiSelectable={false}>
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={styles.timestamp}>Timestamp</TableHeaderColumn>
              <TableHeaderColumn style={styles.count}>Count</TableHeaderColumn>
              <TableHeaderColumn style={styles.message}>Message</TableHeaderColumn>
              <TableHeaderColumn style={styles.action}></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} >
            {searchResults.map( (error, index) => (
              <TableRow key={index}>
                <TableRowColumn style={styles.timestamp}>{error.timestamp}</TableRowColumn>
                <TableRowColumn style={styles.count}>{error.count}</TableRowColumn>
                <TableRowColumn style={styles.message}>{error.exception && error.exception.innermostMessage}</TableRowColumn>
                <TableHeaderColumn style={styles.action}>
                  <IconButton onClick={this.handleClickError.bind(this, error)}><ActionOpen />></IconButton>
                </TableHeaderColumn>
              </TableRow>
              ))}
          </TableBody>
        </Table>
      );      
    }

    return (
      <Dialog
        title={`Handled At: ${selectedHandler}`}
        modal={false}
        open={!!selectedHandler && !selectedError}
        actions={dialogActions}
        autoScrollBodyContent={true}
        onRequestClose={this.handleClose}>
        {dialogContent}
      </Dialog>
    );
  }
}

export default connectToStores(ErrorHandlers);