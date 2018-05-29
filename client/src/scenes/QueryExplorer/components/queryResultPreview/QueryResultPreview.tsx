import * as React from 'react';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';

import TableVisual from './components/DataVisualization/TableVisual';
import TimelineVisual from './components/DataVisualization/TimelineVisual';
import QueryExplorerStore, { QueryExplorerState, QueryInformation } from '../../../../stores/QueryExplorerStore';

export interface QueryResultPreviewProps {
  queryResponse?: KustoQueryResults;
  renderAs?: 'table' | 'timeline';
}

export interface QueryResultPreviewState {
  queryResponseInformation?: QueryInformation;  
}

export default class QueryResultPreview extends React.Component<QueryResultPreviewProps, QueryResultPreviewState> {
  
  constructor(props: QueryResultPreviewProps) {
    super(props);

    this.state = {
      queryResponseInformation: {
        isLoading: false,
        query: null,
        renderAs: null,
        response: null
      }
    };

    this.onQueriesExplorerStoreChange = this.onQueriesExplorerStoreChange.bind(this);
  }

  public componentDidMount() {
    QueryExplorerStore.listen(this.onQueriesExplorerStoreChange);
  }

  public render() {
    return (
      <div style={{ height: '40%' }}>
        {
          (this.state.queryResponseInformation &&
           this.state.queryResponseInformation.isLoading &&
           <div style={{ width: '100%', top: 130, left: 0 }}>
              <CircularProgress id="testerProgress" />
           </div>)
        }
        {
          (this.state.queryResponseInformation &&
           !this.state.queryResponseInformation.isLoading &&
           this.props.renderAs === 'table' && 
           <TableVisual queryResponse={this.state.queryResponseInformation.response} />)
        }
        {
          (this.state.queryResponseInformation &&
           !this.state.queryResponseInformation.isLoading &&
           this.props.renderAs === 'timeline' && 
           <TimelineVisual queryResponse={this.state.queryResponseInformation.response} />)
        }
      </div>
    );
  }

  private onQueriesExplorerStoreChange(queryExplorerStoreState: QueryExplorerState) {
    this.setState({ queryResponseInformation: queryExplorerStoreState.queryInformation });
  }
}