import * as React from 'react';
import * as ReactDOM from 'react-dom';
import InfoDrawer from '../../components/common/InfoDrawer';
import * as TestUtils from 'react-addons-test-utils';

describe('Info drawer', () => {

  it('check info drawer is loading', () => {
    Object.defineProperty(window, "matchMedia", {
      value: jest.fn(() => { return { matches: true } })
    });

    TestUtils.renderIntoDocument(<InfoDrawer
      width={300}
      title="title"
      buttonIcon="help"
      buttonTooltip="Click here to learn more"
      buttonLabel="instructions" />);
  });
});