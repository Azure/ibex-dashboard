import alt, { AbstractActions } from '../alt';
import * as request from 'xhr-request';

interface IRefreshActions {
  updateInterval(newInterval: number): any;
}

class RefreshActions extends AbstractActions implements IRefreshActions {
  constructor(alt: AltJS.Alt) {
    super(alt);
  }

  updateInterval(newInterval: number) {
   return { refreshInterval: newInterval };
  }
}

const refreshActions = alt.createActions<IRefreshActions>(RefreshActions);

export default refreshActions;
