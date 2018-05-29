import * as React from 'react';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';

import MonacoQueryEditor from './components/monacoQueryEditor';
import QueryResultPreview from './components/queryResultPreview';
import QueryExplorerActions from '../../actions/QueryExplorerActions';

import './QueryExplorerStyle.css';

export interface QueryExplorerProps {
  renderAs?: 'table';
}

export default class QueryExplorer extends React.Component<QueryExplorerProps> {
  private queryText: string;

  constructor(props: QueryExplorerProps) {
    super(props);

    this.onQueryTextChanged = this.onQueryTextChanged.bind(this);
    this.onExecuteQuery = this.onExecuteQuery.bind(this);

    this.queryText = 'MaQosSummary | limit 1000 | summarize count() by bin(TIMESTAMP, 1s)';
  }

  public render() {
    return (
      <div className="query-explorer-container">
        <div className="connection-container">
          <TextField
            id="cluster"
            label="Cluster:"
            lineDirection="center"
            className="md-cell--stretch"
          />
          
          <TextField
            id="database"
            label="Database:"
            lineDirection="center"
            className="md-cell--stretch"
          />
        </div>

        <Button 
          primary 
          raised
          label="Go" 
          style={{ width: 100 }} 
          onClick={this.onExecuteQuery} 
        />

        <MonacoQueryEditor onChange={this.onQueryTextChanged}/>

        <div style={{ height: '21px', backgroundColor: 'gray' }} />
        
        <QueryResultPreview renderAs="timeline" />

      </div>
    );
  }

  private onQueryTextChanged(value: string) {
    this.queryText = value;
  }

  private onExecuteQuery() {
    QueryExplorerActions.executeQuery('kuskus', 'kuskus', this.queryText);
  }
}