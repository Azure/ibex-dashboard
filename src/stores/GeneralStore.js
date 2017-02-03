import _ from 'lodash';
import alt from '../alt';
import GeneralActions from '../actions/GeneralActions';

class GeneralStore {
  constructor() {
    this.bindListeners({
      initialize: GeneralActions.initialize,
      refresh: GeneralActions.refresh,
    });

    this.state = {
      filters: {
        timespan: {
          values: ['24 hours', '1 week', '1 month'],
          selectedValue: '24 hours'
        }
      },
      queries: {
        id: 'exceptions',
        query: ` exceptions` +
                ` | summarize count_error=count() by handledAt, innermostMessage` +
                ` | order by count_error desc `,
        mappings: [
          { key: 'handledAt', def: 'Unknown' },
          { key: 'message', def: '' }, 
          { key: 'count', def: '' }
        ],
        data: []
      }
    };
  }

  refresh(result) {
    this.setState(result);
  }
}

export default alt.createStore(GeneralStore, 'GeneralStore');
