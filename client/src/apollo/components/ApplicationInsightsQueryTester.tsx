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

export interface IApplicationInsightsQueryTesterProps {
  query: string;
}

export const ApplicationInsightsQueryTester =
graphql<IQueryResults, IApplicationInsightsQueryTesterProps, IQueryRendererProps>(query, {
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