import * as Alt from 'alt';
export default new Alt();

/**
*
* Declarations for inheritance purposes
*
*/

export class AbstractActions implements AltJS.ActionsClass {
  constructor(alt:AltJS.Alt){}
  dispatch: ( ...payload:Array<any>) => void;
  generateActions: ( ...actions: string[]) => void
}

export class AbstractStoreModel<S> implements AltJS.StoreModel<S> {
  bindListeners:(obj:any)=> void;
  exportPublicMethods:(config:{[key:string]:(...args:Array<any>) => any}) => any;
  exportAsync:( source:any) => void;
  waitFor:any;
  exportConfig:any;
  getState:() => S;
}