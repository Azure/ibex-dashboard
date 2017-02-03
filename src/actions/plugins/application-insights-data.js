
import $ from 'jquery';
import _ from 'lodash';
import Constants from '../constants';
import common from '../actions-common';

var appInsightsUri = 'https://api.applicationinsights.io/beta/apps';
var appId = process.env.REACT_APP_APP_INSIGHTS_APPID;
var apiKey = process.env.REACT_APP_APP_INSIGHTS_APIKEY;

class QueryConfig {
  /** @type {string} */
  timespan;
}

class EventsQueryConfig {
  /** @type {string} */
  timespan;
  /** @type {string} */
  search;
  /** @type {number} */
  top;
  /** @type {number} */
  skip;
}

class ApplicationInsightsDataOptions {
  /** @type {string} */
  query;
  /** @type {string} */
  type;
  /** @type {(string|object)[]} */
  dependencies;
  /** @type {(string|object)[]} */
  mappings;
  /** @type {string} outputResultsName - This would be variable storing the results */
  outputResultsName;
}

export class ApplicationInsightsData {

  _props = {
    type: 'generic',
    dependencies: [Constants.DefaultDimentions.Timespan],
    output: null,
    mappings: [],
    actions: [],
    listeners: [],
    params: {
      query: ''
    }
  }

  /**
   * @param {ApplicationInsightsDataOptions} options - Options object
   */
  constructor(options) {

    if (!options.params.query || !options.dependencies || !options.dependencies.length) {
      throw new Error('AIAnalyticsEvents requires a query to run and dependencies that trigger updates.');
    }
    
    var props = this._props;
    props.params.query = options.params.query;
    props.dependencies = props.dependencies.concat(options.dependencies);
    props.mappings = options.mappings;
    props.type = options.type === 'table' ? 'table' : 'generic';
    props.output = options.outputResultsName;
  }

  /**
   * @returns {string[]} Array of dependencies
   */
  getDependencies() {
    return this._props.dependencies;
  }

  getDependables() {
    return this._props.outputParameter;
  }

  getActions() {
    return this._props.actions;
  }

  getParams() {
    return Object.keys(this._props);
  }

  listen(listener) {
    if (!this._props.listeners.find(func => func === listener)) {
      this._props.listeners.push(listener);
    }
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
      this._fetchQuery({timespan}, callback);
    } else {
      this._fetchEvents(dependencies, callback);
    }
  }

  _timespanToQueryspan(timespan) {
    return timespan === '24 hours' ? 'PT24H' : timespan === '1 week' ? 'P7D' : 'P30D';
  }

  /**
   * Prepare results to ship via callback
   * @param {Array} results
   * @returns {object} object to be returned
   */
  _prepareResult(results) {
    var obj = {};
    obj[this._props.output] = results;
    return obj;
  }

  /**
   * Execute a query with the application insights query API.
   * @param {QueryConfig} config - Configuration for the query
   * @param {function} callback
   */
  _fetchQuery(config, callback) {

    var mappings = this._props.mappings;
    var queryspan = this._timespanToQueryspan(timespan);
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
          return callback(null, this._prepareResult(resultRows));
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
  _fetchEvents(config, callback) {

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

        return callback(null, this._prepareResult(json.value));
      })
      .fail((err) => {
        return callback(err);
      });
  }
}