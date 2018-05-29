import alt, { AbstractActions } from '../alt';

import KustoClientApi from '../api/external/KustoClientApi';

interface IQueryExplorerActions {
  prepareExecuteQuery(query: string): any;
  updateQuery(query: string): any;
  updateResponse(response: KustoQueryResults): any;
  executeQuery(clusterName: string, databaseName: string, query: string): any;
  updateRenderType(newRenderType: string): any;
}

class QueryExplorerActions extends AbstractActions implements IQueryExplorerActions {
  prepareExecuteQuery(query: string) {
    return { query };
  }

  updateQuery(query: string) {
    return { query };
  }
  updateResponse(response: KustoQueryResults) {
    return { response };
  }

  updateRenderType(newRenderType: string) {
    return { newRenderType };
  }

  executeQuery(clusterName: string, databaseName: string, query: string) {
    this.prepareExecuteQuery(query);
    
    let kustoClientApi = new KustoClientApi();

    kustoClientApi.executeQuery(clusterName, databaseName, query)
                  .then((value: KustoQueryResults) => {
                    this.updateResponse(value);
                  })
                  .catch((reason: any) => {
                    // tslint:disable-next-line:no-console
                    console.log(reason);
                  });
  }
}

const queryExplorerActions = alt.createActions<IQueryExplorerActions>(QueryExplorerActions);

export default queryExplorerActions;