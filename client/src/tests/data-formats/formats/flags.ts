import { IFormatTest } from './formats';

export default <IFormatTest> {
  format: 'flags',
  state: { values: [ 'value 1', 'value 2', 'value 3' ] },
  expected:  {
    'value 1': false,
    'value 2': false,
    'value 3': false,
    'values-all': [ 'value 1', 'value 2', 'value 3' ],
    'values-selected': [],
  }
};