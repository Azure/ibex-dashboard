import { DataSourcePlugin, IOptions } from '../DataSourcePlugin';
import { getToken } from '../../../utils/authorization';
import KustoConnection from '../../connections/kusto';

let connectionType = new KustoConnection();

interface IQueryParams {
  query?: ((dependencies: any) => string) | string;
  clusterName?: string;
  databaseName?: string;
  queries?: IDictionary;
  calculated?: (results: any) => object;
}

export default class KustoQuery extends DataSourcePlugin<IQueryParams> {
  type = 'Kusto-Query';
  defaultProperty = 'values';
  connectionType = connectionType.type;

  /**
   * @param options - Options object
   * @param connections - List of available connections
   */
  constructor(options: IOptions<IQueryParams>, connections: IDict<IStringDictionary>) {
    super(options, connections);
    this.validateParams(this._props.params);
  }

  public dependenciesUpdated(dependencies: IDict<any>, args: IDict<any>, callback: (result: any) => void) {
    let emptyDependency = false;
    Object.keys(this._props.dependencies).forEach(dependencyKey => {
      if (typeof dependencies[dependencyKey] === 'undefined') { emptyDependency = true; }
    });

    // If one of the dependencies is not supplied, do not run the query
    if (emptyDependency) {
      return (dispatch) => {
        return dispatch();
      };
    }

    // Validate connection
    let connection = this.getConnection();
    let { clusterName, databaseName } = connection;
    if (!connection || !clusterName || !databaseName) {
      return (dispatch) => {

        return dispatch();
      };
    }

    const params = this._props.params;
    const query: string = this.compileQuery(params.query, dependencies);
    const calculated = params.calculated;

    let returnedResults = {
      values: null
    };

    return (dispatch) => {
      getToken().then((token: string) => {
        fetch(`https://${clusterName}.kusto.windows.net/v1/rest/query`, {
          method: 'POST',
          body: JSON.stringify({
            'db': databaseName,
            'csl': query,
          }),
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${token}`,
          }
        })
        .then((response) => {
          response.json().then((resultTables: KustoQueryResults) => {
            let parsedKustoResponse = this.mapAllTables(resultTables);

            // Assign the result table
            returnedResults.values = parsedKustoResponse[0];

            // Extracting calculated values
            if (typeof params.calculated === 'function') {
              let additionalValues = params.calculated(parsedKustoResponse[0]) || {};
              Object.assign(returnedResults, additionalValues);
            }
            
            return dispatch(returnedResults);
          });
        })
        .catch((reason) => {
          // tslint:disable-next-line:no-console
          console.log(reason);
        });
      }); 
    };
  }

  public updateSelectedValues(dependencies: IDict<any>, selectedValues: any, callback: (result: any) => void) {
    if (Array.isArray(selectedValues)) {
      return Object.assign(dependencies, { 'selectedValues': selectedValues });
    } else {
      return Object.assign(dependencies, { ... selectedValues });
    }
  }

  private compileQuery(query: any, dependencies: any): string {
    return typeof query === 'function' ? query(dependencies) : query;
  }

  private validateParams(params: IQueryParams): void {
  }

  private mapAllTables(results: KustoQueryResults): {}[][] {
    if (!results || !results.Tables || !results.Tables.length) {
      return [];
    }

    return results.Tables.map((table, idx) => this.mapTable(table));
  }

  /**
   * Map the Kusto results array into JSON objects
   * @param table Results table to be mapped into JSON object
   */
  private mapTable(table: KustoTable): Array<{}> {
    return table.Rows.map((rowValues, rowIdx) => {
      let row = {};

      table.Columns.forEach((col, idx) => {
        row[col.ColumnName] = rowValues[idx];
      });

      return row;
    });
  }
}