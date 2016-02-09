import React, { PropTypes, Component } from 'react';

export default class App extends Component {
   render() {
    return(
      <div>
        {this.props ? this.props.children : undefined}
      </div>
    );
  }
};
