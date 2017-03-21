import * as React from 'react';

import ToastStore, { IToastStoreState, IToast } from './ToastStore';
import ToastActions from './ToastActions';

import Snackbar from 'react-md/lib/Snackbars';

export default class Toast extends React.Component<any, IToastStoreState> {

  constructor(props: any) {
    super(props);

    this.state = ToastStore.getState();

    this.onChange = this.onChange.bind(this);
    this.removeToast = this.removeToast.bind(this);
  }

  onChange(state) {
    this.setState(state);
  }

  componentDidMount() {
    ToastStore.listen(this.onChange);
  }

  private removeToast() {
    ToastActions.removeToast();
  }

  render() {
    return (
      <Snackbar toasts={...this.state.toasts} onDismiss={this.removeToast} />
    );
  }
}