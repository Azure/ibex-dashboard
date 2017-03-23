import * as React from 'react';
import * as _ from 'lodash';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';

import { loadConfig } from '../common';
import { DataSourceConnector, IDataSourceDictionary } from '../../data-sources';
import connections from '../../data-sources/connections';

import ConnectionsStore from '../../stores/ConnectionsStore';
import ConnectionsActions from '../../actions/ConnectionsActions';

interface IConfigDashboardState {
  connections: IDictionary;
  error: string;
}

export default class ConfigDashboard extends React.Component<null, IConfigDashboardState> {

  state = {
    connections: {},
    error: null
  };

  dashboard: IDashboardConfig = null;
  dataSources: IDataSourceDictionary = {};

  constructor(props: any) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.state.connections = ConnectionsStore.getState();

    // Loading dashboard from 'dashboards' loaded to page
    loadConfig((dashboard: IDashboardConfig) => {

      this.dashboard = dashboard;
      DataSourceConnector.createDataSources(this.dashboard, this.dataSources);
    });
  }

  componentWillMount() {
    var requiredParameters = {};
    _.values(this.dataSources).forEach(dataSource => {

      // If no connection requirements were set, return
      if (!dataSource.plugin.connection) {
        return;
      }

      if (!connections[dataSource.plugin.connection]) {
        throw new Error(`No connection names ${dataSource.plugin.connection} was defined`);
      }

      var connectionType = connections[dataSource.plugin.connection];
      requiredParameters[dataSource.plugin.connection] = {};
      connectionType.params.forEach(param => { requiredParameters[dataSource.plugin.connection][param] = null });

      // Connection type is already defined - check params
      if (this.dashboard.config.connections[dataSource.plugin.connection]) {
        var connectionParams = this.dashboard.config.connections[dataSource.plugin.connection];

        // Checking that all param definitions are defined
        connectionType.params.forEach(param => {
          requiredParameters[dataSource.plugin.connection][param] = connectionParams[param];
        });
      }
    });

    this.setState({ connections: requiredParameters });
  }

  componentDidMount() {
    ConnectionsStore.listen(this.onChange);
  }

  componentWillUnmount() {
    ConnectionsStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  onParamChange(connectionKey, paramKey, value) {
    //debugger;
    this.state.connections[connectionKey][paramKey] = value;
    this.setState({ connections: this.state.connections });
  }

  onSave() {

  }

  onSaveGoToDashboard() {

  }

  render() {

    let { connections, error } = this.state;

    return (
      <div style={{ width: '100%' }}>
        {_.keys(connections).map(connectionKey => (
          <div key={connectionKey}>
            <h2>{connectionKey}</h2>
            {
              _.keys(connections[connectionKey]).map(paramKey => (
                <div key={paramKey}>
                  <TextField
                    id="paramKey"
                    label={paramKey}
                    defaultValue={connections[connectionKey][paramKey]}
                    lineDirection="center"
                    placeholder="Fill in required connection parameter"
                    className="md-cell md-cell--bottom"
                    onChange={this.onParamChange.bind(this, connectionKey, paramKey)}
                  />
                </div>
              ))
            }
          </div>
        ))}

        <br/>
        <Button flat primary label="Save" onClick={this.onSave}>save</Button>
        <Button flat secondary label="Save and Go to Dashboard" onClick={this.onSaveGoToDashboard}>save</Button>
      </div>
    );
  }
}
