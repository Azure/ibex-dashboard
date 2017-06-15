import { gql, graphql } from 'react-apollo';
import EchoRenderer, { IEchoProps } from './renderer/Echo';

const echoQuery = gql`
query echo($query:String!) {
  AI(query:$query) {
    body
  }
}
`;

interface IEchoQueryResult {
  AI: { body: String };
}

export const Echo = graphql<IEchoQueryResult, IEchoProps>(echoQuery, {
  options: (ownProps) => { return { variables: { query: ownProps.echo } }; },
  props: ({ ownProps, data }) => {
    const { loading, error, AI } = data;
    return {
      loading: loading,
      error: error && error.message,
      echo: AI && AI.body,
    };
  },
})(EchoRenderer);