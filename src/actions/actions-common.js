var jquery_1 = require("jquery");
var appInsights = {
    uri: 'https://api.applicationinsights.io/beta/apps'
};
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
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
var EventsQueryConfig = (function () {
    function EventsQueryConfig() {
    }
    return EventsQueryConfig;
}());
var QueryConfig = (function () {
    function QueryConfig() {
    }
    return QueryConfig;
}());
var ActionsCommon = (function () {
    function ActionsCommon() {
    }
    ActionsCommon.timespanToQueryspan = function (timespan) {
        return timespan === '24 hours' ? 'PT24H' : timespan === '1 week' ? 'P7D' : 'P30D';
    };
    ActionsCommon.timespanToGranularity = function (timespan) {
        return timespan === '24 hours' ? '1h' : timespan === '1 week' ? '1d' : '1d';
    };
    /**
   * Prepare results to ship via callback
   * @param {string} property Property name to set
   * @param {object} val value to put in property
   * @returns {object} object to be returned
   */
    ActionsCommon.prepareResult = function (property, val) {
        var obj = {};
        obj[property] = val;
        return obj;
    };
    /**
     * Translates timespan into its start date
     * @param {string} timespan - Configuration for the query
     * @returns {Date}
     */
    ActionsCommon.timespanStartDate = function (timespan) {
        var date = new Date();
        var days = timespan === '24 hours' ? 1 : timespan === '1 week' ? 7 : 30;
        date.setDate(date.getDate() - days);
        return date;
    };
    /**
     * Execute a query with the application insights query API.
     * @param {QueryConfig} config - Configuration for the query
     * @param {function} callback
     */
    ActionsCommon.fetchQuery = function (config, callback) {
        var _a = config || new QueryConfig(), timespan = _a.timespan, query = _a.query, mappings = _a.mappings;
        var queryspan = ActionsCommon.timespanToQueryspan(timespan);
        var url = appInsights.uri + "/" + ActionsCommon.appInsightsAppId + "/query?timespan=" + queryspan + "&query=" + query;
        jquery_1.default.ajax({
            url: url,
            method: "GET",
            headers: {
                "x-api-key": ActionsCommon.appInsightsApiKey
            }
        })
            .then(function (json) {
            var resultRows = json.Tables[0].Rows;
            if (!mappings || mappings.length === 0) {
                return callback(null, resultRows);
            }
            var rows = resultRows.map(function (row) {
                var item = {};
                mappings.forEach(function (mapping, index) {
                    var key = typeof mapping === 'string' ? mapping : mapping.key;
                    var idx = mapping.idx ? mapping.idx : index;
                    var def = mapping.def ? mapping.def : null;
                    item[key] = mapping.val && row[idx] && mapping.val(row[index]) || row[idx] || def;
                });
                return item;
            });
            return callback(null, rows);
        })
            .fail(function (err) {
            return callback(err);
        });
    };
    /**
     * Execute a query with the application insights events API.
     * @param {EventsQueryConfig} config - Configuration for the query
     * @param {function} callback
     */
    ActionsCommon.fetchEvents = function (config, callback) {
        var _a = config || new EventsQueryConfig(), timespan = _a.timespan, search = _a.search, top = _a.top, skip = _a.skip;
        var queryspan = ActionsCommon.timespanToQueryspan(timespan);
        var url = appInsights.uri + "/" + ActionsCommon.appInsightsAppId + "/events/exceptions?timespan=" + queryspan +
            search ? "&$search=" + encodeURIComponent(search) : '' +
            "&&$orderby=timestamp" +
            top ? "&$top=" + top : '' +
            skip ? "&$skip=" + skip : '';
        jquery_1.default.ajax({
            url: url,
            method: "GET",
            headers: {
                "x-api-key": ActionsCommon.appInsightsApiKey
            }
        })
            .then(function (json) {
            return callback(null, json.value);
        })
            .fail(function (err) {
            return callback(err);
        });
    };
    return ActionsCommon;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ActionsCommon;
ActionsCommon.appInsights = appInsights;
ActionsCommon.appInsightsAppId = appId; //appInsights.apps[app].appId;
ActionsCommon.appInsightsApiKey = apiKey; //appInsights.apps[app].apiKey;
