import * as React from 'react';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';
import Dialog from 'react-md/lib/Dialogs';

import MonacoQueryEditor from './components/monacoQueryEditor';
import QueryResultPreview from './components/queryResultPreview';
import QueryExplorerActions from '../../actions/QueryExplorerActions';
import FilterElementCreator from '../Dashboard/components/ElementCreator/FilterElementCreator';
import ConfigurationStore from '../../stores/ConfigurationsStore';
import ConfigurationActions from '../../actions/ConfigurationsActions';

import './QueryExplorerStyle.css';

export interface QueryExplorerProps {
  clusterName: string;
  databaseName: string;
  renderAs?: 'table';
}

export interface QueryExplorerState {
  showElementMetadata: boolean;
  elementTitle?: string;
  elementSubtitle?: string;
}

export default class QueryExplorer extends React.Component<QueryExplorerProps, QueryExplorerState> {
  private queryText: string;

  constructor(props: QueryExplorerProps) {
    super(props);

    this.onQueryTextChanged = this.onQueryTextChanged.bind(this);
    this.onExecuteQuery = this.onExecuteQuery.bind(this);
    this.onElementTitleChanged = this.onElementTitleChanged.bind(this);
    this.onElementSubtitleChanged = this.onElementSubtitleChanged.bind(this);
    this.onPinToDashboard = this.onPinToDashboard.bind(this);

    this.queryText = 'MaQosSummary | limit 1000 | summarize count() by bin(TIMESTAMP, 1s)';

    this.state = {
      showElementMetadata: false,
      elementSubtitle: '',
      elementTitle: ''
    };
  }

  public render() {
    const { showElementMetadata } = this.state;

    return (
      <div className="query-explorer-container">
        <div className="connection-container">
          <TextField
            id="cluster"
            label="Cluster:"
            lineDirection="center"
            className="md-cell--stretch"
            value={this.props.clusterName}
          />
          
          <TextField
            id="database"
            label="Database:"
            lineDirection="center"
            className="md-cell--stretch"
            value={this.props.databaseName}
          />
        </div>

        <div>
          <TextField
            id="ElementTitle"
            label="Title"
            lineDirection="center"
            className="md-cell md-cell--bottom"
            onChange={this.onElementTitleChanged}
          />

          <TextField
            id="ElementSubTitle"
            label="Subtitle"
            lineDirection="center"
            className="md-cell md-cell--bottom"
            onChange={this.onElementSubtitleChanged}
          />
        </div>

        <Button 
          primary 
          raised
          label="Go" 
          style={{ width: 100 }} 
          onClick={this.onExecuteQuery} 
        />

        <Button 
            primary 
            raised
            label="Pin to dashboard" 
            style={{ width: 180, marginLeft: '5px' }} 
            onClick={this.onPinToDashboard} 
          />

        <div className="monaco-and-result-container">
          <MonacoQueryEditor onChange={this.onQueryTextChanged}/>

          <div style={{ height: '21px', backgroundColor: 'gray' }} />
          
          <QueryResultPreview renderAs="timeline" />        
        </div>
      </div>
    );
  }

  private onQueryTextChanged(value: string) {
    this.queryText = value;
  }

  private onExecuteQuery() {
    QueryExplorerActions.executeQuery('kuskus', 'kuskus', this.queryText);
  }

  private onElementTitleChanged(elementTitle: string) {
    this.setState({ elementTitle });
  }

  private onElementSubtitleChanged(elementSubtitle: string) {
    this.setState({ elementSubtitle });
  }

  private onPinToDashboard() {
    const { elementTitle, elementSubtitle } = this.state;

    // Get current dashboard from state
    let configurationState = ConfigurationStore.getState();
    let currentDashboard = configurationState.dashboard;

    let elementId = elementTitle.replace(' ', '');

    // Create new data source for the new query
    let newDataSource: KustoDataSource = {
      id: 'ds_' + elementId,
      type: 'Kusto/Query',
      dependencies: { queryTimespan: 'timespan:queryTimespan', granularity: 'timespan:granularity' },
      params: {
        // tslint:disable-next-line:no-eval
        query: eval(`() => \`${this.queryText}\``)
      },
      format: { type: 'timeline', args: { timeField: 'TIMESTAMP', valueField: 'count_' }}
    };

    // Create new element
    let newElement: IElement = {
      id: 'element_' + elementId,
      type: 'Timeline',
      title: elementTitle,
      subtitle: elementSubtitle,
      size: { w: 4, h: 8 },
      source: 'ds_' + elementId
    };

    // Add the data source + element to dashboard and close this screen
    currentDashboard.dataSources.push(newDataSource);
    currentDashboard.elements.push(newElement);

    ConfigurationActions.saveConfiguration(currentDashboard);
  }
}