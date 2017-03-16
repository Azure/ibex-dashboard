Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
const _ = require("lodash");
const DataSourcePlugin_1 = require("../DataSourcePlugin");
const common_1 = require("./common");
class ApplicationInsightsQuery extends DataSourcePlugin_1.DataSourcePlugin {
    /**
     * @param options - Options object
     */
    constructor(options) {
        super('ApplicationInsights-Query', 'values', options);
        var props = this._props;
        var params = props.params;
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
        var { queryTimespan } = dependencies;
        var params = this._props.params;
        var query = typeof params.query === 'function' ? params.query(dependencies) : params.query;
        var mappings = params.mappings;
        var queryspan = queryTimespan;
        var url = `${common_1.appInsightsUri}/${common_1.appId}/query?timespan=${queryspan}&query=${encodeURIComponent(query)}`;
        return (dispatch) => {
            $.ajax({
                url,
                method: "GET",
                headers: {
                    "x-api-key": common_1.apiKey
                }
            })
                .then(json => {
                var resultRows = json.Tables[0].Rows;
                if (!mappings || mappings.length === 0) {
                    return dispatch({ values: resultRows });
                }
                var rows = resultRows.map(row => {
                    var item = {};
                    mappings.forEach((mapping, index) => {
                        var key = typeof mapping === 'string' ? mapping : mapping.key;
                        var idx = mapping.idx ? mapping.idx : index;
                        var def = mapping.def ? mapping.def : null;
                        item[key] = (mapping.val && row[idx] && mapping.val(row[index])) || row[idx] || def;
                    });
                    return item;
                });
                return dispatch({ values: rows });
            })
                .fail((err) => {
                return this.failure(err);
            });
        };
    }
}
exports.default = ApplicationInsightsQuery;
