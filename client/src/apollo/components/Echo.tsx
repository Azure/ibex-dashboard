import { gql, graphql } from 'react-apollo';
import EchoRenderer, { IEchoProps } from './renderer/Echo';
import { appId, apiKey } from '../../data-sources/plugins/ApplicationInsights/common';

const echoQuery = gql`
query echo($query:String!,$appId:String!,$apiKey:String!) {
  AI(query:$query,appId:$appId,apiKey:$apiKey) {
    body
  }
}
`;

interface IEchoQueryResult {
  AI: { body: String };
}

export const Echo = graphql<IEchoQueryResult, IEchoProps>(echoQuery, {
  options: (ownProps) => { return { variables: { query: ownProps.echo, appId, apiKey } }; },
  props: ({ ownProps, data }) => {
    const { loading, error, AI } = data;
    return {
      loading: loading,
      error: error && error.message,
      echo: AI && AI.body,
    };
  },
})(EchoRenderer);