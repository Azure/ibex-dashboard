import React from 'react';
import { Header } from '../components/Header';
import { Admin } from '../components/Admin';
import '../styles/Admin.css';

export const AdminPage = React.createClass({
  render() {
    return (
      <div>
        <Header flux={this.props.flux} {...this.props.params} routePage="Admin" />
        <Admin flux={this.props.flux} {...this.props.params} />
      </div>
    )
  }
});