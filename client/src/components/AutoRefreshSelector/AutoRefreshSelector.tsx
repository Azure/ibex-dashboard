import * as request from 'xhr-request';
import * as React from 'react';
import * as _ from 'lodash';

import RefreshStore, { IRefreshStoreState } from './RefreshStore';
import SelectField from 'react-md/lib/SelectFields';

import RefreshActions from './RefreshActions';

import { DataSourceConnector, IDataSourceDictionary, IDataSource } from '../../data-sources/DataSourceConnector';

interface IRefreshState extends IRefreshStoreState {
    refreshMenuVisible?: boolean;
}

export default class AutoRefreshSelector extends React.Component<any, IRefreshState> {

  oneSecInMs = 1000;
  oneMinInMs = 60 * this.oneSecInMs;
  refreshIntervals = [
    {text: 'None', intervalMs: -1},
    {text: '30 Sec', intervalMs: 30 * this.oneSecInMs},
    {text: '60 Sec', intervalMs: 60 * this.oneSecInMs},
    {text: '90 Sec', intervalMs: 90 * this.oneSecInMs},
    {text: '2 Min', intervalMs: 2 * this.oneMinInMs},
    {text: '5 Min', intervalMs: 5 * this.oneMinInMs},
    {text: '15 Min', intervalMs: 15 * this.oneMinInMs},
    {text: '30 Min', intervalMs: 30 * this.oneMinInMs},
  ];

  constructor(props: any) {
    super(props);

    this.state = RefreshStore.getState();

    this.handleRefreshIntervalChange = this.handleRefreshIntervalChange.bind(this);
  }

  handleRefreshIntervalChange = (refreshInterval: string) => {
    var oneSec = 1000;
    var interval = this.refreshIntervals.find((x) => { return x.text === refreshInterval; }).intervalMs;
    
    RefreshActions.updateInterval(interval);
    RefreshActions.setRefreshTimer(
      interval, 
      DataSourceConnector.refreshDs);
  }

  render () {

    let refreshDropDownTexts = this.refreshIntervals.map((x) => { return x.text; });
    return (
      <SelectField
              id="autorefresh"
              label="Auto Refresh"
              placeholder="0"
              defaultValue={'None'}
              position={SelectField.Positions.BELOW}
              menuItems={refreshDropDownTexts}
              toolbar={false}
              onChange={this.handleRefreshIntervalChange}
              className="md-select-field--toolbar"
            />
    );
  }
}