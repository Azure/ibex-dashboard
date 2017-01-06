import alt from '../alt';

class TimespanActions {

  constructor() {
    this.generateActions(
      'update24Hours', 
      'update1Week',
      'update1Month',
      'toggleChannel',
      'toggleAllChannel');
  }

}

export default alt.createActions(TimespanActions);
