import React, { Component } from 'react';
import classnames from 'classnames';

import './style.css';

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedFoods: [],
    }
  }
  
  render() {
    const { className } = this.props;
    return (
      <div className={classnames('Home', className)} >
        <div className='Home-header ui text container'>
          <h1>Bots Dashboard</h1>
          <p>Move to the <b>Dashboard</b> tab to see bot analytics</p>
        </div>
      </div>
    );
  }
}

export default Home;
