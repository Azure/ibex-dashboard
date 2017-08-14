import { IDataSourceDictionary } from '../../data-sources';
import { setupTests } from '../utils/setup';
import Sample from '../../data-sources/plugins/Sample';

import { formatTests } from './formats';
import * as formats from '../../utils/data-formats';

describe('Data Source: Application Insights: Forked Query', () => {

  let mockPlugin = new Sample(<any>{
      params: {
        values: [ 'value 1', 'value 2', 'value 3' ],
        samples: {
          values: [ 'value1', 'value2', 'value3' ] 
        }
      }
    }, {});

  Object.keys(formatTests).forEach(testFormat => {

    it ('Check data format ' + testFormat, () => {

      let test = formatTests[testFormat];
      let values = test.state;
    
      let result = formats[testFormat](test.format, test.state, {}, mockPlugin, {});
      expect(result).toMatchObject(test.expected);
    });
  });
});
