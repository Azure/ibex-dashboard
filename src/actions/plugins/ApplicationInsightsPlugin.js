
import $ from 'jquery';
import _ from 'lodash';
import Constants from '../constants';
import {DataSourcePlugin, IDataSourceOptions} from './DataSourcePlugin';

var appInsightsUri = 'https://api.applicationinsights.io/beta/apps';
var appId = process.env.REACT_APP_APP_INSIGHTS_APPID;
var apiKey = process.env.REACT_APP_APP_INSIGHTS_APIKEY;

class AIHelper {

  /**
   * Execute a query with the application insights query API.
   * @param {QueryConfig} config - Configuration for the query
   * @param {function} callback
   */
  fetchQuery(config, callback) {

    var mappings = this._props.mappings;
    var queryspan = ActionsCommon.timespanToQueryspan(timespan);
    var url = `${appInsightsUri}/${appId}/query?timespan=${queryspan}&query=${this._props.params.query}`;
    
    $.ajax({
        url,
        method: "GET",
        headers: {
          "x-api-key": apiKey
        }
      })
      .then(json => {

        var resultRows = json.Tables[0].Rows;
        if (!mappings || mappings.length === 0) {
          return callback(null, ActionsCommon.prepareResult(resultRows));
        }

        var rows = resultRows.map(row => {
          var item = {};
          mappings.forEach((mapping, index) => {
            var key = typeof mapping === 'string' ? mapping : mapping.key;
            var idx = mapping.idx ? mapping.idx : index;
            var def = mapping.def ? mapping.def : null;
            item[key] = mapping.val && row[idx] && mapping.val(row[index]) || row[idx] || def;
          });
          return item;
        });

        return callback(null, this._prepareResult(rows));
      })
      .fail((err) => {
        return callback(err);
      });
  }

  /**
   * Execute a query with the application insights events API.
   * @param {EventsQueryConfig} config - Configuration for the query
   * @param {function} callback
   */
  fetchEvents(config, callback) {

    var {
      timespan,
      search,
      top,
      skip
    } = config || new EventsQueryConfig();

    var queryspan = ActionsCommon.timespanToQueryspan(timespan);
    var url = `${appInsights.uri}/${ActionsCommon.appInsightsAppId}/events/exceptions?timespan=${queryspan}` +
      search ? `&$search=${encodeURIComponent(search)}` : '' +
      `&&$orderby=timestamp` +
      top ? `&$top=${top}` : '' +
      skip ? `&$skip=${skip}` : '';

    $.ajax({
        url,
        method: "GET",
        headers: {
          "x-api-key": ActionsCommon.appInsightsApiKey
        }
      })
      .then(json => {

        return callback(null, this._helper.prepareResult(json.value));
      })
      .fail((err) => {
        return callback(err);
      });
  }
}

class QueryConfig {
  /** @type {string} */
  timespan;
}

interface IApplicationInsightsOptions extends IDataSourceOptions {
  /** @type {string} */
  query;
  /** @type {(string|object)[]} mappings */
  mappings;
}

export class ApplicationInsightsData extends DataSourcePlugin {

  type = 'application-insights';
  _helper = new AIHelper();

  /**
   * @param {ApplicationInsightsDataOptions} options - Options object
   */
  constructor(options) {
    super(options);

    var props = this._props;
    if (!props.params.query || !props.dependencies || !props.dependencies.length) {
      throw new Error('AIAnalyticsEvents requires a query to run and dependencies that trigger updates.');
    }

    // Bind helper method to 'this'
    this._helper.timespanToQueryspan = this._helper.timespanToQueryspan.bind(this);
    this._helper.prepareResult = this._helper.prepareResult.bind(this);
    this._helper.fetchQuery = this._helper.fetchQuery.bind(this);
    this._helper.fetchEvents = this._helper.fetchEvents.bind(this);
  }

  /**
   * update - called when dependencies are created
   * @param {object} dependencies
   * @param {function} callback
   */
  updateDependencies(dependencies, callback) {

    var { timespan } = dependencies;

    // TODO: insert dependencies into query [format]or[function]

    if (this._props.type == 'generic') {
      this._helper.fetchQuery({timespan}, callback);
    } else {
      this._helper.fetchEvents(dependencies, callback);
    }
  }
}