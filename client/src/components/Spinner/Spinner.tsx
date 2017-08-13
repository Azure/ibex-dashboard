import * as request from 'xhr-request';
import * as React from 'react';
import * as _ from 'lodash';

import CSSTransitionGroup from 'react-addons-css-transition-group';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import Snackbar from 'react-md/lib/Snackbars';

import SpinnerStore, { ISpinnerStoreState } from './SpinnerStore';
import SpinnerActions from './SpinnerActions';

interface ISpinnerState extends ISpinnerStoreState {
}

export default class Spinner extends React.Component<any, ISpinnerState> {

  constructor(props: any) {
    super(props);

    this.state = SpinnerStore.getState();

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.onChange(SpinnerStore.getState());
    SpinnerStore.listen(this.onChange);
  }

  componentWillUnmount() {
    SpinnerStore.unlisten(this.onChange);
  }

  onChange(state: ISpinnerState) {
    this.setState(state);
  }

  render () {

    let refreshing = this.state.pageLoading || this.state.requestLoading || false;

    return (
      <div>
        {refreshing && <CircularProgress key="progress" id="contentLoadingProgress" />}
      </div>
    );
  }
}