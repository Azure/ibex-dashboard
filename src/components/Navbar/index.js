import React from 'react';
import {Link} from 'react-router';
import {AppBar, Tabs, Tab} from 'material-ui'

import './style.css';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalCharacters: 0,
      onlineUsers: 0,
      searchQuery: '',
      ajaxAnimationClass: ''
    }
  }

  componentDidMount() {
  }

  componentWillMount() {
  }

  onChange(state) {
  }

  handleSubmit(event) {
  }

  render () {
    return (
      <AppBar title="Bots Dashboard" className="nav-appBar">
        <Tabs className="nav-tabs" value={window.location.pathname}>
          <Tab label="Home" value="/" containerElement={<Link to="/" />} />
        </Tabs>
      </AppBar>
    );
  }
}

export default Navbar;