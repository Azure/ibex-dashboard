var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var $ = require("jquery");
var DataSourcePlugin_1 = require("../DataSourcePlugin");
var common_1 = require("./common");
var ApplicationInsightsQuery = (function (_super) {
    __extends(ApplicationInsightsQuery, _super);
    /**
     * @param options - Options object
     */
    function ApplicationInsightsQuery(options) {
        var _this = _super.call(this, 'ApplicationInsights-Query', 'values', options) || this;
        var props = _this._props;
        var params = props.params;
        if (!params.query) {
            throw new Error('AIAnalyticsEvents requires a query to run and dependencies that trigger updates.');
        }
        if (!props.dependencies.queryTimespan) {
            throw new Error('AIAnalyticsEvents requires dependencies: timespan; queryTimespan');
        }
        return _this;
    }
    /**
     * update - called when dependencies are created
     * @param {object} dependencies
     * @param {function} callback
     */
    ApplicationInsightsQuery.prototype.updateDependencies = function (dependencies) {
        var _this = this;
        var queryTimespan = dependencies.queryTimespan;
        var params = this._props.params;
        var query = typeof params.query === 'function' ? params.query(dependencies) : params.query;
        var mappings = params.mappings;
        var queryspan = queryTimespan;
        var url = common_1.appInsightsUri + "/" + common_1.appId + "/query?timespan=" + queryspan + "&query=" + encodeURIComponent(query);
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
                    return dispatch({ values: resultRows });
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
                return dispatch({ values: rows });
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
