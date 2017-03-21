import * as React from 'react';
import * as $ from 'jquery';
import * as _ from 'lodash';

import CSSTransitionGroup from 'react-addons-css-transition-group';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import Snackbar from 'react-md/lib/Snackbars';

import SpinnerStore, { ISpinnerStoreState } from './SpinnerStore';
import SpinnerActions from './SpinnerActions';

import {Toast, ToastActions, IToast} from '../generic/Toast';

interface ISpinnerState extends ISpinnerStoreState {
}

export default class Spinner extends React.Component<any, ISpinnerState> {

  constructor(props) {
    super(props);

    this.state = SpinnerStore.getState();

    this.onChange = this.onChange.bind(this);
    this._429ApplicationInsights = this._429ApplicationInsights.bind(this);

    var self = this;
    $.ajaxSetup({
      beforeSend: function() {
        SpinnerActions.startRequestLoading();
      },
      complete: function(response) {
        SpinnerActions.endRequestLoading();

        if (response.status === 429) {
          self._429ApplicationInsights();
        }
      }
    });

    // Todo: Add timeout to requests - if no reply received, turn spinner off
  }

  componentDidMount() {
    SpinnerStore.listen(this.onChange);
  }

  _429ApplicationInsights() {
    let toast : IToast = { text: 'You have reached the maximum number of Application Insights requests.' };
    ToastActions.addToast(toast);
  }

  onChange(state) {
    this.setState(state);
  }

  render () {

    let refreshing = this.state.pageLoading || this.state.requestLoading || false;

    return (
      <div>
        { refreshing && <CircularProgress key="progress" id="contentLoadingProgress" /> }
      </div>
    )
  }
}