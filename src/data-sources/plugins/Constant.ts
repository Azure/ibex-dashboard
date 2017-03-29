
import * as _ from 'lodash';
import {DataSourcePlugin, IDataSourceOptions} from './DataSourcePlugin';

interface IConstantOptions extends IDataSourceOptions {
  params: {
    values: Array<string>;
    selectedValue: string;
  };
}

export default class Constant extends DataSourcePlugin {

  type = 'Constant';
  defaultProperty = 'selectedValue';

  constructor(options: IConstantOptions, connections: IDict<IStringDictionary>) {
    super(options, connections);

    var props = this._props;
    var params = options.params;

    props.actions.push.apply(props.actions, [ 'initialize', 'updateSelectedValue' ]);
  }

  initialize() {
    var { selectedValue, values } = <any> this._props.params;
    return { selectedValue, values };
  }

  /**
   * updateDependencies - called when dependencies are created
   */
  updateDependencies(dependencies: IDictionary, args: IDictionary, callback: (result: any) => void) {
    var result = _.extend(dependencies, args);

    if (typeof callback === 'function') {
      return callback(result);
    }

    return result;
  }

  updateSelectedValue(dependencies: IDictionary, selectedValue: any) {
    return { selectedValue };
  }
}