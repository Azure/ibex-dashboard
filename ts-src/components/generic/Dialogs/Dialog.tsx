import * as React from 'react';

import DialogsActions from './DialogsActions';
import DialogsStore from './DialogsStore';

import MDDialog from 'react-md/lib/Dialogs';
import Button from 'react-md/lib/Buttons/Button';
import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';

export default class Dialog extends React.PureComponent<any, any> {
  constructor(props) {
    super(props);

    this.state = DialogsStore.getState();
    this.onChange = this.onChange.bind(this);
    this.openDialog = this.openDialog.bind(this);
  }

  componentDidMount() {
    DialogsStore.listen(this.onChange);
  }

  onChange(state) {
    var { dialogId, dialogArgs } = state;
    this.setState({ dialogId, dialogArgs });
  }

  closeDialog = () => {
    DialogsActions.closeDialog();
  };

  openDialog = () => {
    DialogsActions.openDialog('conversations', { title: this.state.dialogArgs.title + ':Blue', intent: 'bla', queryTimespan: 'jjj' });
  }

  render() {
    const { id } = this.props;
    const { dialogId, dialogArgs } = this.state;
    var { title } = dialogArgs || { title: '' }
    var visible = id === dialogId;

    const items = [
      'Single line text goes here',
      'Two line wrapped text goes here making it wrap to next line',
      'Single line text goes here',
      'Three line wrapped text goes here making it wrap to the next line and continues longer to be here',
    ].map((primaryText, i) => (
      <ListItem key={i} onClick={this.openDialog} primaryText={primaryText} />
    ));
    return (
      <MDDialog
        id={id}
        visible={visible}
        title={title}
        onHide={this.closeDialog}
      >
        <List>
          {items}
        </List>
      </MDDialog>
    );
  }
}