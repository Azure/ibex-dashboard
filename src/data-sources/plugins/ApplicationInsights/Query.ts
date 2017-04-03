
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
    
    // Validating params
    this.validateParams(props, params);
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

    let { queryTimespan } = dependencies;
    let params: any = this._props.params;
    let tableNames: Array<string> = [];
    let mappings: Array<any> = [];

    // Checking if this is a single query or a fork query
    let query: string;
    let isForked = !params.query && params.table;

    if (!isForked) {
      query = this.compileQuery(params.query, dependencies);
      mappings.push(params.mappings);

    } else {
      let queries: Array<any> = params.queries || [];
      let table: string = params.table;

      query = ` ${params.table} | fork `;
      _.keys(queries).forEach(queryKey => {

        let queryParams = queries[queryKey];
        tableNames.push(queryKey);
        mappings.push(queryParams.mappings);

        let subquery = this.compileQuery(queryParams.query, dependencies);
        query += ` (${subquery}) `;
      });

    }

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

          tableNames.forEach((table: string, idx: number) => {
            returnedResults[table] = resultTables.length > idx ? resultTables[idx] : null;
          });

          return dispatch(returnedResults);          
        });
    }
  }

  private mapAllTables(results: IQueryResults, mappings: Array<IDictionary>): any[][] {

    if (!results || !results.Tables || !results.Tables.length) {
      return [];
    }

    return results.Tables.map((table, idx) => this.mapTable(table, mappings[idx]));
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

  private compileQuery(query: any, dependencies: any): string {
    return typeof query === 'function' ? query(dependencies) : query;
  }

  private validateParams(props: any, params: any): void {

    if (!props.dependencies.queryTimespan) {
      throw new Error('AIAnalyticsEvents requires dependencies: timespan; queryTimespan');
    }

    if (params.query) {
      if (params.table || params.queries) {
        throw new Error('Application Insights query should either have { query } or { table, queries } under params.');
      }
      if (typeof params.query !== 'string' && typeof params.query !== 'function') {
        throw new Error('{ query } param should either be a function or a string.');
      }
    }

    if (params.table) {
      if (!params.queries) {
        return this.failure(new Error('Application Insights query should either have { query } or { table, queries } under params.'));
      }
      if (typeof params.table !== 'string' || typeof params.queries !== 'object' || Array.isArray(params.queries)) {
        throw new Error('{ table, queries } should be of types { "string", { query1: {...}, query2: {...} }  }.');
      }
    }

    if (!params.query && !params.table) {
      throw new Error('{ table, queries } should be of types { "string", { query1: {...}, query2: {...} }  }.');
    }
  }
}