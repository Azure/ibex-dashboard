import * as React from 'react';
import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo';
import { makeExecutableSchema } from 'graphql-tools';
import { typeDefs } from '../typeDefs';
import { ApplicationInsightsQueryTester } from '../components/ApplicationInsightsQueryTester';

makeExecutableSchema({ typeDefs });

const networkInterface = createNetworkInterface({ uri: 'http://localhost:4000/apollo' });
const client = new ApolloClient({ networkInterface: networkInterface });

class Dashboard extends React.Component<any, any> {
  render() {
    return (
      <ApolloProvider client={client}>
        <div>
          <ApplicationInsightsQueryTester />
        </div>
      </ApolloProvider>
    );
  }
}

export default Dashboard;