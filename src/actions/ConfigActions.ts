import alt, { AbstractActions } from '../alt';

interface IConfigActions {
  update(configName: string, args: IDictionary): any;
}

class ConfigActions extends AbstractActions implements IConfigActions {
  constructor(alt: AltJS.Alt) {
    super(alt);
  }

  update(configName: string, args: IDictionary) {
    return { configName, args };
  }
}

const configActions = alt.createActions<IConfigActions>(ConfigActions);

export default configActions;
