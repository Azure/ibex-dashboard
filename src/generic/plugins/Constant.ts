
import * as $ from 'jquery';
import * as _ from 'lodash';
import {DataSourcePlugin, DataSourceOptions} from './DataSourcePlugin';
import ActionsCommon from '../../actions/actions-common';

declare var process : any;

class ConstantOptions extends DataSourceOptions {
  params: {
    values: Array<string>;
    selectedValue: string;
  }
}

export default class Constant extends DataSourcePlugin {

  constructor(options: ConstantOptions) {
    super('Constant', options);

    var props = this._props;
    var params = options.params;
    if (!params.values || !params.values.length) {
      throw new Error('Constant requires a values list.');
    }

    props.actions.push.apply(props.actions, [ 'initialize' ]);
  }

  initialize() {
    var { selectedValue } = <any>this._props.params;
    var obj = {};
    obj[this._props.id] = selectedValue;
    return obj;
  }

  /**
   * updateDependencies - called when dependencies are created
   */
  updateDependencies(dependencies) {
    return dependencies;
  }
}