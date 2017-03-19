Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
const DataSourcePlugin_1 = require("../DataSourcePlugin");
const actions_common_1 = require("../../../actions/actions-common");
const common_1 = require("./common");
class ApplicationInsightsEvents extends DataSourcePlugin_1.DataSourcePlugin {
    constructor(options) {
        super('ApplicationInsights-Events', 'values', options);
        var props = this._props;
        var params = props.params;
        if (!params.query || !props.dependencies || !props.dependencies.length) {
            throw new Error('AIAnalyticsEvents requires a query to run and dependencies that trigger updates.');
        }
    }
    /**
     * update - called when dependencies are created
     * @param {object} dependencies
     * @param {function} callback
     */
    updateDependencies(dependencies, callback) {
        var { timespan, eventType, search, top, skip } = dependencies;
        eventType = eventType || 'customEvents'; // traces; customEvents; exceptions; etc...
        var queryspan = actions_common_1.default.timespanToQueryspan(timespan);
        var url = `${common_1.appInsightsUri}/${actions_common_1.default.appInsightsAppId}/events/${eventType}?timespan=${queryspan}` +
            search ? `&$search=${encodeURIComponent(search)}` : '' +
            `&&$orderby=timestamp` +
            top ? `&$top=${top}` : '' +
            skip ? `&$skip=${skip}` : '';
        $.ajax({
            url,
            method: "GET",
            headers: {
                "x-api-key": actions_common_1.default.appInsightsApiKey
            }
        })
            .then(json => {
            return callback(null, actions_common_1.default.prepareResult('value', json.value));
        })
            .fail((err) => {
            return callback(err);
        });
    }
}
exports.default = ApplicationInsightsEvents;
