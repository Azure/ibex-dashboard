import * as React from 'react';
import Navbar from './Navbar';

class App extends React.Component<any, any> {

  render() {

    var { children } = this.props;

    return (
      // <Navbar history={this.props.history}>
      <Navbar history={this.props.history}>
        { children }
      </Navbar>
    );
  }
}

export default App;