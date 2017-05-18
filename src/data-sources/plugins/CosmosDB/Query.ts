import * as request from 'xhr-request';
import { DataSourcePlugin, IOptions } from '../DataSourcePlugin';
import { DataSourceConnector } from '../../DataSourceConnector';
import CosmosDBConnection from '../../connections/cosmos-db';

let connectionType = new CosmosDBConnection();

interface IQueryParams {
  query?: ((dependencies: any) => string) | string;
  parameters?: (string | object)[];
  mappings?: (string | object)[];
  databaseId?: string;
  collectionId?: string;
  calculated?: (results: any) => object;
}

export default class CosmosDBQuery extends DataSourcePlugin<IQueryParams> {
  type = 'CosmosDB-Query';
  defaultProperty = 'doc';
  connectionType = connectionType.type;

  constructor(options: IOptions<IQueryParams>, connections: IDict<IStringDictionary>) {
    super(options, connections);
    this.validateTimespan(this._props);
    this.validateParams(this._props.params);
  }

  /**
   * update - called when dependencies are created
   * @param {object} dependencies
   * @param {function} callback
   */
  updateDependencies(dependencies: any) {
    let emptyDependency = false;
    Object.keys(this._props.dependencies).forEach((key) => {
      if (typeof dependencies[key] === 'undefined') { emptyDependency = true; }
    });

    // If one of the dependencies is not supplied, do not run the query
    if (emptyDependency) {
      return (dispatch) => {
        return dispatch();
      };
    }

    // Validate connection
    let connection = this.getConnection();
    let { host, key } = connection;
    if (!connection || !host || !key) {
      return (dispatch) => {
        return dispatch();
      };
    }

    // Get Dashboard Id
    const paths = location.pathname.split('/');
    if (paths.length !== 3) {
      throw Error('Expected location pathname:' + paths);
    }
    const dashboardId = paths[paths.length - 1];

    const params = this._props.params;
    const query: string = this.compileQuery(params.query, dependencies);

    const url = `/api/cosmosdb/${dashboardId}`;
    const body = {
      verb: 'POST',
      databaseId: params.databaseId,
      collectionId: params.collectionId,
      resourceType: 'docs',
      query: query,
      parameters: params.parameters
    };

    return (dispatch) => {
      request(url, {
        method: 'POST',
        json: true,
        body: body,
      },      (error, json) => {
        if (error || !json.Documents) {
          return this.failure(error);
        }
        return dispatch(json.Documents);
      });
    };
  }

  updateSelectedValues(dependencies: IDictionary, selectedValues: any) {
    if (Array.isArray(selectedValues)) {
      return Object.assign(dependencies, { 'selectedValues': selectedValues });
    } else {
      return Object.assign(dependencies, { ... selectedValues });
    }
  }

  private compileQuery(query: any, dependencies: any): string {
    return typeof query === 'function' ? query(dependencies) : query;
  }

  private validateTimespan(props: any) {
  }

  private validateParams(params: IQueryParams): void {
  }
}