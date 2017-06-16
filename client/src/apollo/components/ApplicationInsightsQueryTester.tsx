import * as React from 'react';
import { gql, graphql } from 'react-apollo';
import { appId, apiKey } from '../../data-sources/plugins/ApplicationInsights/common';
import QueryRenderer, { IQueryRendererProps } from './QueryRenderer';

const query = gql`
query ($query:String!, $appId:String!, $apiKey:String!) {
  AI(query:$query, appId:$appId, apiKey:$apiKey) {
    body
  }
}
`;

interface IQueryResults {
  AI: { body: any };
}

interface IQueryRendererWithDataProps {
  query: string;
}

const QueryRendererWithData =
graphql<IQueryResults, IQueryRendererWithDataProps, IQueryRendererProps>(query, {
  options: (ownProps) => { return { variables: { query: ownProps.query, appId, apiKey } }; },
  props: ({ ownProps, data }) => {
    return {
      loading: data.loading,
      error: data.error && data.error.message,
      query: ownProps.query,
      results: data.AI && data.AI.body,
    } as IQueryRendererProps;
  },
})(QueryRenderer);

interface IApplicationInsightsQueryTesterState {
  query: string;
}

export class ApplicationInsightsQueryTester extends React.Component<{}, IApplicationInsightsQueryTesterState> {
  state = {
    query: '',
  };

  render() {
    return (
      <div className="ApplicationInsightsQueryTester">
        <input className="ApplicationInsightsQueryTester-query" onChange={this.onChange} placeholder="Query..." />
        {this.state.query && <QueryRendererWithData query={this.state.query} />}
      </div>
    );
  }

  onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      query: ev.target.value,
    });
  }
}