var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var $ = require("jquery");
var DataSourcePlugin_1 = require("../DataSourcePlugin");
var actions_common_1 = require("../../../actions/actions-common");
var common_1 = require("./common");
var ApplicationInsightsDataOptions = (function (_super) {
    __extends(ApplicationInsightsDataOptions, _super);
    function ApplicationInsightsDataOptions() {
        return _super.apply(this, arguments) || this;
    }
    return ApplicationInsightsDataOptions;
}(DataSourcePlugin_1.DataSourceOptions));
var ApplicationInsightsQuery = (function (_super) {
    __extends(ApplicationInsightsQuery, _super);
    /**
     * @param options - Options object
     */
    function ApplicationInsightsQuery(options) {
        var _this = _super.call(this, 'ApplicationInsights-Query', options) || this;
        var props = _this._props;
        var params = props.params;
        if (!params.query || !props.dependencies || !props.dependencies.length) {
            throw new Error('AIAnalyticsEvents requires a query to run and dependencies that trigger updates.');
        }
        return _this;
    }
    ApplicationInsightsQuery.prototype.bind = function (actionClass) {
        _super.prototype.bind.call(this, actionClass);
        actionClass.a = "try";
    };
    /**
     * update - called when dependencies are created
     * @param {object} dependencies
     * @param {function} callback
     */
    ApplicationInsightsQuery.prototype.updateDependencies = function (dependencies) {
        var _this = this;
        var timespan = dependencies.timespan;
        var params = this._props.params;
        var mappings = params.mappings;
        var queryspan = actions_common_1.default.timespanToQueryspan(timespan);
        var url = common_1.appInsightsUri + "/" + common_1.appId + "/query?timespan=" + queryspan + "&query=" + encodeURIComponent(params.query);
        return function (dispatch) {
            $.ajax({
                url: url,
                method: "GET",
                headers: {
                    "x-api-key": common_1.apiKey
                }
            })
                .then(function (json) {
                var resultRows = json.Tables[0].Rows;
                if (!mappings || mappings.length === 0) {
                    return dispatch(actions_common_1.default.prepareResult(_this._props.id, resultRows));
                }
                var rows = resultRows.map(function (row) {
                    var item = {};
                    mappings.forEach(function (mapping, index) {
                        var key = typeof mapping === 'string' ? mapping : mapping.key;
                        var idx = mapping.idx ? mapping.idx : index;
                        var def = mapping.def ? mapping.def : null;
                        item[key] = (mapping.val && row[idx] && mapping.val(row[index])) || row[idx] || def;
                    });
                    return item;
                });
                return dispatch(actions_common_1.default.prepareResult(_this._props.id, rows));
            })
                .fail(function (err) {
                return _this.failure(err);
            });
        };
    };
    return ApplicationInsightsQuery;
}(DataSourcePlugin_1.DataSourcePlugin));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ApplicationInsightsQuery;
