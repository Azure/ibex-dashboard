import alt, { AbstractStoreModel } from '../alt';

import queryExplorerActions from '../actions/QueryExplorerActions';

export interface QueryInformation {
  query?: string;
  response?: KustoQueryResults;
  isLoading?: boolean;
  renderAs?: 'table' | 'timeline' | 'bars' | 'pie';
}

export interface QueryExplorerState {
  queryInformation: QueryInformation;
}

class QueryExplorerStore extends AbstractStoreModel<QueryExplorerState> implements QueryExplorerState {
  queryInformation: QueryInformation;

  constructor() {
    super();
    
    this.queryInformation = {
      isLoading: false,
    };

    // TODO - get the values from a cookie, else initialize it
    this.bindListeners({
      prepareExecuteQuery: queryExplorerActions.prepareExecuteQuery,
      updateQuery: queryExplorerActions.updateQuery,
      updateResponse: queryExplorerActions.updateResponse,
      updateRenderType: queryExplorerActions.updateRenderType
    });
  }
  
  updateQuery(state: any) {
    this.queryInformation.query = state.query;
  }

  updateResponse(state: any) {
    this.queryInformation.isLoading = false;
    this.queryInformation.response = state.response;
  }

  updateRenderType(state: any) {
    this.queryInformation.renderAs = state.newRenderType;
  }

  prepareExecuteQuery(state: any) {
    this.queryInformation.isLoading = true;
  }
}

const queryExplorerStore = alt.createStore<QueryExplorerState>((QueryExplorerStore as AltJS.StoreModel<any>),
                                                               'QueryExplorerStore');

export default queryExplorerStore;