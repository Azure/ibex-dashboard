import { runWithAdal } from 'react-adal';
import { authContext } from './utils/authorization';

runWithAdal(authContext, () => {
  // eslint-disable-next-line
  require('./index.authenticated');
});