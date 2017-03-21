import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-addons-test-utils';
import * as renderer from 'react-test-renderer';
import * as _ from 'lodash';

import { Dialog, DialogsActions } from '../components/generic/Dialogs';
import MDDialog from 'react-md/lib/Dialogs';
import Table from '../components/generic/Table';

import dashboard from './mocks/dashboard';
import dialogData from './mocks/dialog';

describe('Dialog', () => {

  let dialog;

  it('First render without content', () => {
    dialog = TestUtils.renderIntoDocument(<Dialog dialogData={dialogData} dashboard={dashboard} />);
    let elements = TestUtils.scryRenderedComponentsWithType(dialog, Table);
    expect(elements.length).toBe(0);
  });

  it('Opening a dialog', function () {

    DialogsActions.openDialog(dialogData.id, { title: 'Title', intent: 'Intent', queryspan: '30D' });
    
    console.dir(dialog._reactInternalInstance);
    //dialog._reactInternalInstance._currentElement

    let elements = TestUtils.scryRenderedComponentsWithType(dialog, Table);
    expect(elements.length).toBeGreaterThan(0);

  });

  afterAll(() => {
    ReactDOM.unmountComponentAtNode(dialog);
  })
});