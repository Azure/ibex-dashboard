import $ from 'jquery';
import _ from 'lodash';

const appInsights = {
  uri: 'https://api.applicationinsights.io/beta/apps'
};

function getUrlVars()
{
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++)
  {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

// Using http://uri?appId={appId}&apiKey={apiKey}
var variables = getUrlVars();
var appId = process.env.REACT_APP_APP_INSIGHTS_APPID || variables['appId'];
var apiKey = process.env.REACT_APP_APP_INSIGHTS_APIKEY || variables['apiKey'];

class EventsQueryConfig {
  /** @type {string} */
  timespan;
  /** @type {string=} */
  search;
  /** @type {number=} */
  top;
  /** @type {number=} */
  skip;
}

class QueryConfig {
  /** @type {string} */
  query;
  /** @type {string} */
  timespan;
  /** @type {(string|object)[]} */
  mappings;
}

export default class ActionsCommon {

  static appInsights = appInsights;
  static appInsightsAppId = appId;//appInsights.apps[app].appId;
  static appInsightsApiKey = apiKey;//appInsights.apps[app].apiKey;

  static timespanToQueryspan(timespan) {
    return timespan === '24 hours' ? 'PT24H' : timespan === '1 week' ? 'P7D' : 'P30D';
  }

  static timespanToGranularity(timespan) {
    return timespan === '24 hours' ? '5m' : timespan === '1 week' ? '1d' : '1d';
  }

    /**
   * Prepare results to ship via callback
   * @param {string} property Property name to set
   * @param {object} val value to put in property
   * @returns {object} object to be returned
   */
  static prepareResult(property, val) {
    var obj = {};
    obj[property] = val;
    return obj;
  }

  /**
   * Translates timespan into its start date
   * @param {string} timespan - Configuration for the query
   * @returns {Date}
   */
  static timespanStartDate(timespan) {
    var date = new Date();
    var days = timespan === '24 hours' ? 1 : timespan === '1 week' ? 7 : 30;
    date.setDate(date.getDate() - days);
    return date;
  }

  /**
   * Execute a query with the application insights query API.
   * @param {QueryConfig} config - Configuration for the query
   * @param {function} callback
   */
  static fetchQuery(config, callback) {

    var {
      timespan,
      query,
      mappings
    } = config || new QueryConfig();

    var queryspan = ActionsCommon.timespanToQueryspan(timespan);
    var url = `${appInsights.uri}/${ActionsCommon.appInsightsAppId}/query?timespan=${queryspan}&query=${query}`;

    $.ajax({
        url,
        method: "GET",
        headers: {
          "x-api-key": ActionsCommon.appInsightsApiKey
        }
      })
      .then(json => {

        var resultRows = json.Tables[0].Rows;
        if (!mappings || mappings.length === 0) {
          return callback(null, resultRows);
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

        return callback(null, rows);
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
  static fetchEvents(config, callback) {

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

        return callback(null, json.value);
      })
      .fail((err) => {
        return callback(err);
      });
  }
}