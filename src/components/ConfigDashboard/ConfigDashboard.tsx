import * as React from 'react';
import * as _ from 'lodash';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';

import ConfigurationsActions from '../../actions/ConfigurationsActions';
import ConfigurationsStore from '../../stores/ConfigurationsStore';

import { DataSourceConnector, IDataSourceDictionary } from '../../data-sources';
import connections from '../../data-sources/connections';

import ConnectionsStore from '../../stores/ConnectionsStore';
import ConnectionsActions from '../../actions/ConnectionsActions';

interface IConfigDashboardState {
  dashboard?: IDashboardConfig;
  connections: IDictionary;
  error: string;
}

export default class ConfigDashboard extends React.Component<null, IConfigDashboardState> {

  state = {
    dashboard: null,
    connections: {},
    error: null
  };

  dataSources: IDataSourceDictionary = {};

  constructor(props: any) {
    super(props);

    this.loadParams = this.loadParams.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state.connections = ConnectionsStore.getState();

    ConfigurationsActions.loadConfiguration();
  }

  componentDidMount() {
    ConnectionsStore.listen(this.onChange);
    let { dashboard } = ConfigurationsStore.getState();

    if (dashboard) {
      DataSourceConnector.createDataSources(dashboard, this.dataSources);
      this.setState({ dashboard });
    }

    ConfigurationsStore.listen(state => {

      let { dashboard } = state;

      DataSourceConnector.createDataSources(dashboard, this.dataSources);
      this.setState({ dashboard });
    });
  }

  componentWillUnmount() {
    ConnectionsStore.unlisten(this.onChange);
  }

  private loadParams(): any {
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
      let { dashboard } = this.state;
      if (dashboard.config.connections[dataSource.plugin.connection]) {
        var connectionParams = dashboard.config.connections[dataSource.plugin.connection];

        // Checking that all param definitions are defined
        connectionType.params.forEach(param => {
          requiredParameters[dataSource.plugin.connection][param] = connectionParams[param];
        });
      }
    });

    return requiredParameters;
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

    if (!this.state.dashboard) {
      return null;
    }

    let connections = this.loadParams();
    let { error } = this.state;

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
