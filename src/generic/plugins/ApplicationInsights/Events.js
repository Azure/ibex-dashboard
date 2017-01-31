var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var $ = require("jquery");
var DataSourcePlugin_1 = require("../DataSourcePlugin");
var actions_common_1 = require("../../../actions/actions-common");
var common_1 = require("./common");
var ApplicationInsightsEvents = (function (_super) {
    __extends(ApplicationInsightsEvents, _super);
    function ApplicationInsightsEvents(options) {
        var _this = _super.call(this, 'ApplicationInsights-Events', 'values', options) || this;
        var props = _this._props;
        var params = props.params;
        if (!params.query || !props.dependencies || !props.dependencies.length) {
            throw new Error('AIAnalyticsEvents requires a query to run and dependencies that trigger updates.');
        }
        return _this;
    }
    /**
     * update - called when dependencies are created
     * @param {object} dependencies
     * @param {function} callback
     */
    ApplicationInsightsEvents.prototype.updateDependencies = function (dependencies, callback) {
        var timespan = dependencies.timespan, eventType = dependencies.eventType, search = dependencies.search, top = dependencies.top, skip = dependencies.skip;
        eventType = eventType || 'customEvents'; // traces; customEvents; exceptions; etc...
        var queryspan = actions_common_1.default.timespanToQueryspan(timespan);
        var url = common_1.appInsightsUri + "/" + actions_common_1.default.appInsightsAppId + "/events/" + eventType + "?timespan=" + queryspan +
            search ? "&$search=" + encodeURIComponent(search) : '' +
            "&&$orderby=timestamp" +
            top ? "&$top=" + top : '' +
            skip ? "&$skip=" + skip : '';
        $.ajax({
            url: url,
            method: "GET",
            headers: {
                "x-api-key": actions_common_1.default.appInsightsApiKey
            }
        })
            .then(function (json) {
            return callback(null, actions_common_1.default.prepareResult('value', json.value));
        })
            .fail(function (err) {
            return callback(err);
        });
    };
    return ApplicationInsightsEvents;
}(DataSourcePlugin_1.DataSourcePlugin));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ApplicationInsightsEvents;
