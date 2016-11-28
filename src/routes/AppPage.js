import React from 'react';
import '../styles/Global.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export const AppPage = React.createClass({
  render() {
    return (
     <MuiThemeProvider>
      <div id="pages">
        {this.props.children}
      </div>
     </MuiThemeProvider>
  )}
});
