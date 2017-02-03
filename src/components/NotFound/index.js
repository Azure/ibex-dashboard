import React, { Component } from 'react';
import classnames from 'classnames';

import './style.css';

export default class NotFound extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  render() {
    const { className } = this.props;
    return (
      <div className={classnames('NotFound', className)}>
        <h1>
          404 <small>Not Found :(</small>
        </h1>
      </div>
    );
  }
}
