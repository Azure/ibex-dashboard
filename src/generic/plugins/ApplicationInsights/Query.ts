
import * as $ from 'jquery';
import * as _ from 'lodash';
import {DataSourcePlugin, DataSourceOptions} from '../DataSourcePlugin';
import ActionsCommon from '../../../actions/actions-common';
import { appInsightsUri, appId, apiKey } from './common';

declare var process : any;

class ApplicationInsightsDataOptions extends DataSourceOptions {
  /** @type {string} */
  query;
  /** @type {(string|object)[]} mappings */
  mappings;
}

export default class ApplicationInsightsQuery extends DataSourcePlugin {

  /**
   * @param options - Options object
   */
  constructor(options: ApplicationInsightsDataOptions) {
    super('ApplicationInsights-Query', options);

    var props = this._props;
    var params: any = props.params;
    if (!params.query || !props.dependencies || !props.dependencies.length) {
      throw new Error('AIAnalyticsEvents requires a query to run and dependencies that trigger updates.');
    }
  }

  bind (actionClass) {
    super.bind(actionClass);
    actionClass.a = "try";
  }

  /**
   * update - called when dependencies are created
   * @param {object} dependencies
   * @param {function} callback
   */
  updateDependencies(dependencies) {

    var { timespan } = dependencies;

    var params: any = this._props.params;
    var mappings = params.mappings;
    var queryspan = ActionsCommon.timespanToQueryspan(timespan);
    var url = `${appInsightsUri}/${appId}/query?timespan=${queryspan}&query=${encodeURIComponent(params.query)}`;
    
    return (dispatch) => {
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
            return dispatch(ActionsCommon.prepareResult(this._props.id, resultRows));
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

          return dispatch(ActionsCommon.prepareResult(this._props.id, rows));
        })
        .fail((err) => {
          return this.failure(err);
        });
    }
  }

}