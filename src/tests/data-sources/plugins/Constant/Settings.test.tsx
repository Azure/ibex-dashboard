import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { setupTests } from '../../../utils/setup';
import * as TestUtils from 'react-addons-test-utils';
import { DataSourceConnector, IDataSourceDictionary } from '../../../../data-sources';
import plugins from '../../../../data-sources/plugins';
import { BaseDatasourceSettings, IBaseSettingsProps, IBaseSettingsState } 
                from '../../../../components/common/BaseDatasourceSettings';

import ConstantDatasourceSettings from '../../../../data-sources/plugins/Constant/Settings'
import dashboardMock from '../../../mocks/dashboards/constants';

describe('testing data-source settings component', () => {

  let dashbaord: IDataSourceDictionary;
  let constantds;
  
   beforeAll((done) => {
    dashbaord = setupTests(dashboardMock, done);

    let element = dashbaord.dataSources[0];
    let ReactElementClass = plugins[element.type];
    if (ReactElementClass && ReactElementClass.editor) {
      let SettingsEditor: any = ReactElementClass.editor;
      constantds = TestUtils.renderIntoDocument(<SettingsEditor settings={element} />);
      
    }
    
  });

});