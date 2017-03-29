
//import * as $ from 'jquery';
import * as request from 'xhr-request';
import * as _ from 'lodash';
import { DataSourcePlugin, IDataSourceOptions } from '../DataSourcePlugin';
import { appInsightsUri } from './common';
import ApplicationInsightsConnection from '../../connections/application-insights';

let connectionType = new ApplicationInsightsConnection();

interface IQueryOptions extends IDataSourceOptions {
  query: string
  mappings: (string|object)[];
}

export default class ApplicationInsightsQuery extends DataSourcePlugin {

  type = 'ApplicationInsights-Query';
  defaultProperty = 'values';
  connectionType = connectionType.type;

  /**
   * @param options - Options object
   */
  constructor(options: IQueryOptions, connections: IDict<IStringDictionary>) {
    super(options, connections);

    var props = this._props;
    var params: any = props.params;
    if (!params.query) {
      throw new Error('AIAnalyticsEvents requires a query to run and dependencies that trigger updates.');
    }

    if (!props.dependencies.queryTimespan) {
      throw new Error('AIAnalyticsEvents requires dependencies: timespan; queryTimespan');
    }
  }

  /**
   * update - called when dependencies are created
   * @param {object} dependencies
   * @param {function} callback
   */
  updateDependencies(dependencies) {

    var emptyDependency = _.find(_.keys(this._props.dependencies), dependencyKey => {
      return typeof dependencies[dependencyKey] === 'undefined';
    });

    if (emptyDependency) {
      return (dispatch) => {
        return dispatch();
      };
    }

    // Validate connection
    let connection = this.getConnection();
    let { appId, apiKey } = connection;
    if (!connection || !apiKey || !appId) {
      return (dispatch) => {
        return dispatch();
      };
    }

    var { queryTimespan } = dependencies;

    var params: any = this._props.params;
    var query = typeof params.query === 'function' ? params.query(dependencies) : params.query;
    var mappings = params.mappings;
    var queryspan = queryTimespan;
    var url = `${appInsightsUri}/${appId}/query?timespan=${queryspan}&query=${encodeURIComponent(query)}`;

    return (dispatch) => {

      request(url, {
          method: "GET",
          json: true,
          headers: {
            "x-api-key": apiKey
          }
        }, (error, json) => {

          if (error) {
            return this.failure(error);
          }

          let q = query;

          // Check if result is valid
          let tables = this.mapAllTables(json, mappings);
          let resultStatus: IQueryStatus[] = _.last(tables);
          if (!resultStatus || !resultStatus.length) {
            return dispatch(json);
          }

          // Map tables to appropriate results
          var resultTables = tables.filter((table, idx) => {
            return idx < resultStatus.length && resultStatus[idx].Kind === 'QueryResult';
          });

          let returnedResults = {
            values: (resultTables.length && resultTables[0]) || null
          };

          return dispatch(returnedResults);          
        });
    }
  }

  private mapAllTables(results: IQueryResults, mappings: IDictionary): any[][] {

    if (!results || !results.Tables || !results.Tables.length) {
      return [];
    }

    return results.Tables.map(table => this.mapTable(table, mappings));
  }

  /**
   * Map the AI results array into JSON objects
   * @param table Results table to be mapped into JSON object
   * @param mappings additional mappings to activate of the row
   */
  private mapTable(table: IQueryResult, mappings: IDictionary): Array<any> {
    mappings = mappings || {};

    return table.Rows.map((rowValues, rowIdx) => {
      var row = {};

      table.Columns.forEach((col, idx) => {
        row[col.ColumnName] = rowValues[idx];
      });

      // Going over user defined mappings of the values
      _.keys(mappings).forEach(col => {
        row[col] = 
          typeof mappings[col] === 'function' ? 
            mappings[col](row[col], row, rowIdx) :
            mappings[col];
      });

      return row;
    });
  }
}