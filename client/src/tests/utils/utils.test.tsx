import utils from '../../utils'; 
import dashboardWithDialog from '../mocks/dashboards/dialogs';

describe('Toast', () => {

    let element;

    it('test utility methods', () => {
      var dashboardStr = utils.objectToString(dashboardWithDialog);
      expect(dashboardStr.length).toBeGreaterThanOrEqual(1);
    });

});