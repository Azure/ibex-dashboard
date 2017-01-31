
import {DataSourcePlugin, IDataSourceOptions} from './DataSourcePlugin';

interface IConstantOptions extends IDataSourceOptions {
  params: {
    values: Array<string>;
    selectedValue: string;
  }
}

export default class Constant extends DataSourcePlugin {

  constructor(options: IConstantOptions) {
    super('Constant', 'selectedValue', options);

    var props = this._props;
    var params = options.params;

    props.actions.push.apply(props.actions, [ 'initialize', 'updateSelectedValue' ]);
  }

  initialize() {
    var { selectedValue, values } = <any>this._props.params;
    return { selectedValue, values };
  }

  /**
   * updateDependencies - called when dependencies are created
   */
  updateDependencies(dependencies) {
    return dependencies;
  }

  updateSelectedValue(dependencies, selectedValue) {
    return { selectedValue };
  }
}