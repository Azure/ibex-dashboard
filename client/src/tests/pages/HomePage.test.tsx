import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-addons-test-utils';

import Home from '../../pages/Home'

describe('Home', () => {
  let setup;
  let setupComponent;

  it('Home is loading', () => {
    setup = TestUtils.renderIntoDocument(<Home />);
    TestUtils.isElementOfType(setup, 'div');
  });
});