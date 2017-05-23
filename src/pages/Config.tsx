import * as React from 'react';

import ConfigDashboard from '../components/ConfigDashboard';

import ConfigurationsActions from '../actions/ConfigurationsActions';
import ConfigurationsStore from '../stores/ConfigurationsStore';


export default class Config extends React.Component<any, any> {



  constructor(props: any) {
    super(props);
  }


  render() {

    return (
      <div className="md-grid">
          <div className="md-cell md-cell--12">
              <ConfigDashboard connections={this.props.connections} standaloneView={this.props.standaloneView} dashboardId={this.props.dashboardId}  />
          </div>
      </div>
    );
  }
}
